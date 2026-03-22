from datetime import datetime, timezone
from extensions import db


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.String(50), primary_key=True)  # e.g. "medical"
    label = db.Column(db.String(100), nullable=False)  # e.g. "Medical"

    campaigns = db.relationship("Campaign", back_populates="category_ref", lazy="dynamic")

    def __repr__(self):
        return f"<Category {self.id}>"


class Campaign(db.Model):
    __tablename__ = "campaigns"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    category_id = db.Column(db.String(50), db.ForeignKey("categories.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    organizer = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255))
    target = db.Column(db.Integer, nullable=False)
    raised = db.Column(db.Integer, default=0)
    donors = db.Column(db.Integer, default=0)
    days_left = db.Column(db.Integer, default=30)
    status = db.Column(db.String(20), default='pending')  # pending | active | rejected | completed | suspended
    verified = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)
    image = db.Column(db.Text)
    description = db.Column(db.Text)
    story = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    category_ref = db.relationship("Category", back_populates="campaigns")
    updates = db.relationship(
        "CampaignUpdate", back_populates="campaign", cascade="all, delete-orphan", lazy="dynamic"
    )
    donations = db.relationship(
        "Donation", back_populates="campaign", cascade="all, delete-orphan", lazy="dynamic"
    )

    def __repr__(self):
        return f"<Campaign {self.slug}>"


class CampaignUpdate(db.Model):
    __tablename__ = "campaign_updates"

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    campaign = db.relationship("Campaign", back_populates="updates")

    def __repr__(self):
        return f"<CampaignUpdate campaign={self.campaign_id}>"


class Donation(db.Model):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"), nullable=False)
    donor_name = db.Column(db.String(255), default="Anonymous")
    amount = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20))  # stored hashed/masked in production
    message = db.Column(db.Text)
    anonymous = db.Column(db.Boolean, default=False)
    mpesa_ref = db.Column(db.String(100))  # M-PESA transaction reference
    status = db.Column(
        db.String(20), default="pending"
    )  # pending | completed | failed
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    campaign = db.relationship("Campaign", back_populates="donations")

    def __repr__(self):
        return f"<Donation campaign={self.campaign_id} amount={self.amount}>"
