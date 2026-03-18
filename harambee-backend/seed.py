"""
seed.py — Populate the database with initial data from campaigns.js
Run with: flask --app app.py shell < seed.py
Or simply: python seed.py (after setting FLASK_APP env var)
"""

from app import create_app
from extensions import db
from models.campaign import Category, Campaign, CampaignUpdate, Donation

CATEGORIES = [
    {"id": "medical", "label": "Medical"},
    {"id": "education", "label": "Education"},
    {"id": "emergency", "label": "Emergency"},
    {"id": "memorial", "label": "Memorial"},
    {"id": "community", "label": "Community"},
    {"id": "wedding", "label": "Wedding"},
    {"id": "business", "label": "Business"},
    {"id": "church", "label": "Church"},
]

CAMPAIGNS = [
    {
        "title": "Support Jane Muthoni's School Fees",
        "slug": "jane-muthoni-school",
        "category_id": "education",
        "organizer": "Muthoni Family",
        "location": "Kiambu, Kenya",
        "target": 120000,
        "raised": 85000,
        "donors": 156,
        "days_left": 25,
        "verified": True,
        "featured": True,
        "image": "/images/school.jpg",
        "description": "Jane Muthoni, Form 2 student at Kiambu High School, needs KES 120,000 for school fees, uniform and books for the coming term. Her single mother works as a househelp and cannot afford the fees.",
        "story": "Jane is a bright student who scored B+ in her KCPE exams. She dreams of becoming a doctor to help people in her community. The family lives in a single room in Juja and her mother earns KES 12,000 per month.\n\nSchool reopens in 3 weeks. Without the fees, Jane will miss another term.",
        "updates": [
            {"date": "April 5, 2024", "text": "Thank you! Jane has been admitted and is preparing for school. Uniform and books purchased."},
        ],
        "recent_donors": [
            {"name": "Anonymous", "amount": 2000, "anonymous": True},
            {"name": "Kiambu Teachers SACCO", "amount": 15000},
            {"name": "Cousin in US", "amount": 5000},
        ],
    },
    {
        "title": "Rebuild Mukuru Slum Clinic After Fire",
        "slug": "mukuru-clinic-fire",
        "category_id": "community",
        "organizer": "Mukuru Community Health",
        "location": "Nairobi, Kenya",
        "target": 800000,
        "raised": 523000,
        "donors": 289,
        "days_left": 12,
        "verified": True,
        "featured": True,
        "image": "/images/clinic.jpg",
        "description": "Last week's fire destroyed our community clinic serving 5,000 residents in Mukuru. We need to rebuild basic facilities for maternal care, vaccinations and daily medicine.",
        "story": "Mukuru Kwa Njenga Clinic has been serving the slum since 2015. The fire destroyed medicines, beds and equipment worth KES 800,000. Pregnant women and children are now walking 5km to the nearest facility.\n\nWe need to restore services within 2 weeks.",
        "updates": [
            {"date": "April 10, 2024", "text": "Temporary tent clinic operational. First vaccinations given to 120 children today."},
        ],
        "recent_donors": [
            {"name": "Anonymous", "amount": 1000, "anonymous": True},
            {"name": "Nairobi County Gov", "amount": 100000},
            {"name": "Local business", "amount": 5000},
        ],
    },
    {
        "title": "Joseph's Leg Surgery - Motorcycle Accident",
        "slug": "joseph-leg-surgery",
        "category_id": "medical",
        "organizer": "Joseph's Family",
        "location": "Mombasa, Kenya",
        "target": 450000,
        "raised": 289000,
        "donors": 134,
        "days_left": 8,
        "verified": True,
        "featured": True,
        "image": "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop",
        "description": "Joseph, 28, bodaboda rider from Likoni, broke his leg in accident. Needs surgery at Coast General Hospital. Family has spent all savings on initial treatment.",
        "story": "Joseph is sole breadwinner for family of 5. His KES 800/day income stopped after accident. Doctors say surgery (KES 450,000) is needed to save the leg and restore mobility.",
        "updates": [
            {"date": "April 12, 2024", "text": "Joseph admitted to Coast General. Surgery scheduled for next week. Thank you donors."},
        ],
        "recent_donors": [
            {"name": "Bodaboda Sacco", "amount": 20000},
            {"name": "Anonymous", "amount": 1000, "anonymous": True},
        ],
    },
    {
        "title": "Kiosk Expansion - Mama Mboga Thika",
        "slug": "mama-mboga-thika",
        "category_id": "business",
        "organizer": "Fatuma Ali",
        "location": "Thika, Kenya",
        "target": 150000,
        "raised": 98000,
        "donors": 67,
        "days_left": 35,
        "verified": False,
        "featured": False,
        "image": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
        "description": "Mama Fatuma sells vegetables daily in Thika market. Wants to expand kiosk with refrigeration to stock more produce and increase daily sales from KES 2,000 to KES 5,000.",
        "story": "Fatuma has sold vegetables for 12 years, raising 4 children alone. Kiosk expansion will double income and provide better produce to community.",
        "updates": [],
        "recent_donors": [
            {"name": "Neighbor", "amount": 2000},
        ],
    },
    {
        "title": "Burial Expenses for Mama Grace - Kitale",
        "slug": "mama-grace-burial",
        "category_id": "memorial",
        "organizer": "Grace Family",
        "location": "Kitale, Kenya",
        "target": 120000,
        "raised": 95000,
        "donors": 123,
        "days_left": 4,
        "verified": True,
        "featured": False,
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        "description": "Grace Wanjala passed away suddenly. Family needs funds for transport, coffin and burial ceremony in Kitale.",
        "story": "Grace, 58, mother of 6, passed after short illness. Husband retired, children struggling to raise KES 120,000 needed.",
        "updates": [],
        "recent_donors": [
            {"name": "Church group", "amount": 10000},
        ],
    },
    {
        "title": "Church Roof Repair - Zion Chapel Meru",
        "slug": "zion-chapel-roof",
        "category_id": "church",
        "organizer": "Zion Chapel Committee",
        "location": "Meru, Kenya",
        "target": 350000,
        "raised": 187000,
        "donors": 245,
        "days_left": 28,
        "verified": True,
        "featured": False,
        "image": "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop",
        "description": "Leaking roof during rains disrupts services for 450 member congregation. Need iron sheets and labour to repair before next rainy season.",
        "story": "Zion Chapel has served Meru community for 30 years. Recent heavy rains damaged roof, making Sunday services uncomfortable.",
        "updates": [
            {"date": "April 8, 2024", "text": "Labour secured. Materials ordered. Work starts next week."},
        ],
        "recent_donors": [
            {"name": "Local farmer", "amount": 5000},
        ],
    },
]


def seed():
    app = create_app()
    with app.app_context():
        print("Dropping and recreating all tables...")
        db.drop_all()
        db.create_all()

        print("Seeding categories...")
        for cat_data in CATEGORIES:
            cat = Category(id=cat_data["id"], label=cat_data["label"])
            db.session.add(cat)
        db.session.commit()

        print("Seeding campaigns...")
        for c_data in CAMPAIGNS:
            updates = c_data.pop("updates", [])
            recent_donors = c_data.pop("recent_donors", [])

            campaign = Campaign(**c_data)
            db.session.add(campaign)
            db.session.flush()  # get campaign.id

            for u in updates:
                update = CampaignUpdate(campaign_id=campaign.id, **u)
                db.session.add(update)

            for d in recent_donors:
                donation = Donation(
                    campaign_id=campaign.id,
                    donor_name=d.get("name", "Anonymous"),
                    amount=d["amount"],
                    anonymous=d.get("anonymous", False),
                    status="completed",
                    phone="0700000000",  # placeholder
                )
                db.session.add(donation)

        db.session.commit()
        print("✅ Database seeded successfully!")


if __name__ == "__main__":
    seed()
