from extensions import ma
from models.campaign import Category, Campaign, CampaignUpdate, Donation


class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True


class CampaignUpdateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CampaignUpdate
        load_instance = True
        exclude = ("campaign",)


class DonationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance = True
        exclude = ("phone", "campaign")

    donor_name = ma.auto_field()

    def dump(self, obj, *args, **kwargs):
        data = super().dump(obj, *args, **kwargs)
        if hasattr(obj, 'anonymous') and obj.anonymous:
            data["donor_name"] = "Anonymous"
        return data


class CampaignSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = True
        include_fk = True

    category = ma.Nested(CategorySchema, attribute="category_ref", dump_only=True)
    updates = ma.List(ma.Nested(CampaignUpdateSchema), dump_only=True)
    recent_donors = ma.Method("get_recent_donors", dump_only=True)
    percent = ma.Method("get_percent", dump_only=True)

    def get_recent_donors(self, obj):
        recent = (
            obj.donations.filter_by(status="completed")
            .order_by(Donation.created_at.desc())
            .limit(5)
            .all()
        )
        return DonationSchema(many=True).dump(recent)

    def get_percent(self, obj):
        if obj.target == 0:
            return 0
        return min(round((obj.raised / obj.target) * 100), 100)


class CampaignListSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Campaign
        load_instance = True
        fields = (
            "id", "title", "slug", "category_id", "organizer",
            "location", "target", "raised", "donors", "days_left",
            "verified", "featured", "image", "description",
            "created_at",
        )

    category = ma.Nested(CategorySchema, attribute="category_ref", dump_only=True)
    percent = ma.Method("get_percent", dump_only=True)

    def get_percent(self, obj):
        if obj.target == 0:
            return 0
        return min(round((obj.raised / obj.target) * 100), 100)


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

campaign_schema = CampaignSchema()
campaigns_schema = CampaignListSchema(many=True)

donation_schema = DonationSchema()
donations_schema = DonationSchema(many=True)
