"""
seed.py — Populate the database with initial data
Run with: flask --app app.py shell < seed.py
Or simply: python seed.py (after setting FLASK_APP env var)
"""

from app import create_app
from extensions import db
from models.campaign import Category, Campaign

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
        print("✅ Database seeded successfully!")


if __name__ == "__main__":
    seed()
