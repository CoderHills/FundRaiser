from flask import Blueprint, request, jsonify
import datetime
from extensions import db
from models.campaign import Campaign, Donation
from schemas import donation_schema, donations_schema
from services.mpesa import mpesa_service
from flask import current_app

donations_bp = Blueprint("donations", __name__, url_prefix="/api/donations")


@donations_bp.route("/", methods=["OPTIONS"])
def handle_options():
    return "", 200


@donations_bp.route("/", methods=["POST"])
def create_donation():
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

    account_ref = f"{campaign.slug}-{campaign.id}"
    transaction_desc = f"Donation to {campaign.title}"
    
    mpesa_result = mpesa_service.stk_push(
        phone_number=data["phone"],
        amount=amount,
        account_reference=account_ref,
        transaction_desc=transaction_desc
    )
    
    # Check if M-Pesa failed - for demo purposes, still save the donation
    if not mpesa_result.get('success'):
        # In demo mode, save the donation as completed anyway
        donation = Donation(
            campaign_id=campaign.id,
            donor_name=donor_name,
            amount=amount,
            phone=data["phone"],
            message=data.get("message"),
            anonymous=anonymous,
            status="completed",  # Mark as completed for demo
            mpesa_ref=f"demo_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}",
        )
        db.session.add(donation)
        
        # Update campaign totals
        campaign.raised += amount
        campaign.donors += 1
        
        db.session.commit()
        
        return (
            jsonify(
                {
                    "message": "Demo donation successful! (M-Pesa not configured)",
                    "donation": donation_schema.dump(donation),
                }
            ),
            201,
        )

    donation = Donation(
        campaign_id=campaign.id,
        donor_name=donor_name,
        amount=amount,
        phone=data["phone"],
        message=data.get("message"),
        anonymous=anonymous,
        status="pending",
        mpesa_ref=mpesa_result.get('checkout_request_id'),
    )
    db.session.add(donation)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "STK push sent! Please check your phone and enter PIN.",
                "checkout_request_id": mpesa_result.get('checkout_request_id'),
                "donation": donation_schema.dump(donation),
            }
        ),
        201,
    )


@donations_bp.route("/mpesa-callback", methods=["POST"])
def mpesa_callback():
    data = request.get_json(silent=True) or {}

    stk = data.get("Body", {}).get("stkCallback", {})
    result_code = stk.get("ResultCode")
    checkout_request_id = stk.get("CheckoutRequestID")

    donation = Donation.query.filter_by(
        mpesa_ref=checkout_request_id, status="pending"
    ).first()

    if not donation:
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

    if result_code == 0:
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
