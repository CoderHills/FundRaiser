from flask import Blueprint, request, jsonify
from extensions import db
from models.campaign import Campaign, CampaignUpdate
from models.user import User
from schemas import campaign_schema, campaigns_schema
from werkzeug.security import check_password_hash
import jwt
from functools import wraps

campaigns_bp = Blueprint("campaigns", __name__, url_prefix="/api/campaigns")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        from flask import current_app
        token = None
        if 'Authorization' in request.headers:
            auth = request.headers['Authorization'].split()
            if len(auth) == 2 and auth[0].lower() == 'bearer':
                token = auth[1]
        
        if not token:
            return jsonify({'message': 'token missing'}), 401
        
        try:
            from flask import current_app
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'token invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated


@campaigns_bp.route("/", methods=["GET"])
def list_campaigns():
    query = Campaign.query

    category = request.args.get("category")
    if category:
        query = query.filter_by(category_id=category)

    featured = request.args.get("featured")
    if featured == "true":
        query = query.filter_by(featured=True)

    search = request.args.get("search", "").strip()
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Campaign.title.ilike(like),
                Campaign.organizer.ilike(like),
                Campaign.location.ilike(like),
            )
        )

    query = query.order_by(Campaign.featured.desc(), Campaign.created_at.desc())

    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 12, type=int), 50)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "campaigns": campaigns_schema.dump(pagination.items),
            "total": pagination.total,
            "pages": pagination.pages,
            "page": page,
            "per_page": per_page,
        }
    )


@campaigns_bp.route("/<slug>", methods=["GET"])
def get_campaign(slug):
    campaign = Campaign.query.filter_by(slug=slug).first_or_404(
        description=f"Campaign '{slug}' not found"
    )
    return jsonify(campaign_schema.dump(campaign))


@campaigns_bp.route("/", methods=["POST"])
@token_required
def create_campaign(current_user):
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required = ["title", "slug", "category_id", "organizer", "target"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    if Campaign.query.filter_by(slug=data["slug"]).first():
        return jsonify({"error": "A campaign with this slug already exists"}), 409

    campaign = Campaign(
        title=data["title"],
        slug=data["slug"],
        category_id=data["category_id"],
        organizer=data["organizer"],
        location=data.get("location"),
        target=data["target"],
        days_left=data.get("days_left", 30),
        image=data.get("image"),
        description=data.get("description"),
        story=data.get("story"),
        verified=data.get("verified", False),
        featured=data.get("featured", False),
    )
    db.session.add(campaign)
    db.session.commit()
    return jsonify(campaign_schema.dump(campaign)), 201


@campaigns_bp.route("/<slug>", methods=["PUT", "PATCH"])
def update_campaign(slug):
    campaign = Campaign.query.filter_by(slug=slug).first_or_404()
    data = request.get_json(silent=True) or {}

    updatable = [
        "title", "category_id", "organizer", "location",
        "target", "days_left", "image", "description",
        "story", "verified", "featured",
    ]
    for field in updatable:
        if field in data:
            setattr(campaign, field, data[field])

    db.session.commit()
    return jsonify(campaign_schema.dump(campaign))


@campaigns_bp.route("/<slug>", methods=["DELETE"])
def delete_campaign(slug):
    campaign = Campaign.query.filter_by(slug=slug).first_or_404()
    db.session.delete(campaign)
    db.session.commit()
    return jsonify({"message": f"Campaign '{slug}' deleted"}), 200


@campaigns_bp.route("/<slug>/updates", methods=["POST"])
def add_update(slug):
    campaign = Campaign.query.filter_by(slug=slug).first_or_404()
    data = request.get_json(silent=True) or {}

    if not data.get("text"):
        return jsonify({"error": "Update text is required"}), 400

    update = CampaignUpdate(
        campaign_id=campaign.id,
        text=data["text"],
        date=data.get("date"),
    )
    db.session.add(update)
    db.session.commit()
    return jsonify({"id": update.id, "text": update.text, "date": update.date}), 201
