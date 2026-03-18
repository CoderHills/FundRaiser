from flask import Blueprint, request, jsonify
from extensions import db
from models.campaign import Campaign, Donation
from schemas import donation_schema, donations_schema

donations_bp = Blueprint("donations", __name__, url_prefix="/api/donations")


@donations_bp.route("/", methods=["POST"])
def create_donation():
    """
    POST /api/donations/
    Body (JSON):
      campaign_id  : int (required)
      amount       : int in KES (required)
      phone        : str M-PESA number (required)
      donor_name   : str (optional, default "Anonymous")
      message      : str (optional)
      anonymous    : bool (optional, default false)

    In a real integration this endpoint would:
      1. Validate the amount
      2. Trigger an M-PESA STK push via Safaricom Daraja API
      3. Return a pending donation record
      4. A separate /api/donations/mpesa-callback endpoint would
         receive the async Daraja callback and mark the donation
         as completed + update campaign raised/donors totals.

    For now we simulate an immediate success.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required = ["campaign_id", "amount", "phone"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    campaign = Campaign.query.get(data["campaign_id"])
    if not campaign:
        return jsonify({"error": "Campaign not found"}), 404

    amount = int(data["amount"])
    if amount < 1:
        return jsonify({"error": "Donation amount must be at least KES 1"}), 400

    anonymous = data.get("anonymous", False)
    donor_name = "Anonymous" if anonymous else data.get("donor_name", "Anonymous")

    donation = Donation(
        campaign_id=campaign.id,
        donor_name=donor_name,
        amount=amount,
        phone=data["phone"],
        message=data.get("message"),
        anonymous=anonymous,
        status="completed",  # simulated — change to "pending" with real Daraja
        mpesa_ref=data.get("mpesa_ref"),
    )
    db.session.add(donation)

    # Update campaign totals
    campaign.raised += amount
    campaign.donors += 1

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Donation received. Asante sana!",
                "donation": donation_schema.dump(donation),
                "campaign": {
                    "id": campaign.id,
                    "raised": campaign.raised,
                    "donors": campaign.donors,
                },
            }
        ),
        201,
    )


@donations_bp.route("/mpesa-callback", methods=["POST"])
def mpesa_callback():
    """
    POST /api/donations/mpesa-callback
    Receives async callback from Safaricom Daraja after STK push.
    See: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
    """
    data = request.get_json(silent=True) or {}

    # Daraja wraps the result in Body.stkCallback
    stk = data.get("Body", {}).get("stkCallback", {})
    result_code = stk.get("ResultCode")
    checkout_request_id = stk.get("CheckoutRequestID")

    # Find matching pending donation by mpesa_ref (CheckoutRequestID)
    donation = Donation.query.filter_by(
        mpesa_ref=checkout_request_id, status="pending"
    ).first()

    if not donation:
        # Daraja still expects a 200 response
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

    if result_code == 0:
        # Payment successful
        donation.status = "completed"
        campaign = donation.campaign
        campaign.raised += donation.amount
        campaign.donors += 1
    else:
        donation.status = "failed"

    db.session.commit()
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200


@donations_bp.route("/campaign/<int:campaign_id>", methods=["GET"])
def list_campaign_donations(campaign_id):
    """
    GET /api/donations/campaign/<campaign_id>
    Query params:
      - page     : default 1
      - per_page : default 20
    """
    campaign = Campaign.query.get_or_404(campaign_id)

    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)

    pagination = (
        Donation.query.filter_by(campaign_id=campaign.id, status="completed")
        .order_by(Donation.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify(
        {
            "donations": donations_schema.dump(pagination.items),
            "total": pagination.total,
            "pages": pagination.pages,
            "page": page,
        }
    )
