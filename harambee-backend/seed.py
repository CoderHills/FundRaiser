"""
seed.py — Populate the database with initial data
Run with: flask --app app.py shell < seed.py
Or simply: python seed.py (after setting FLASK_APP env var)
"""
import os
from app import create_app
from extensions import db
from models.campaign import Category, Campaign
from models.user import User

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
        print("Creating tables...")
        db.create_all()

        print("Seeding categories...")
        for cat_data in CATEGORIES:
            # Check if category exists
            if not Category.query.get(cat_data["id"]):
                cat = Category(id=cat_data["id"], label=cat_data["label"])
                db.session.add(cat)
        
        # Create admin user if ADMiN_EMAIL env var is set. Otherwise, create a default admin if no admin exists.

        admin_email = os.environ.get("ADMIN_EMAIL")
        if admin_email:
            admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
            if not User.query.filter_by(email=admin_email).first():
                admin = User(
                    email=admin_email,
                    name="Admin",
                    is_admin=True,
                    is_active=True
                )
                admin.set_password(admin_password)
                db.session.add(admin)
                print(f"Created admin user: {admin_email}")
        
        # Create a default admin if no admin exists
        if not User.query.filter_by(is_admin=True).first():
            default_admin = User(
                email="admin@harambee.africa",
                name="System Admin",
                is_admin=True,
                is_active=True
            )
            default_admin.set_password("admin123")
            db.session.add(default_admin)
            print("Created default admin user: admin@harambee.africa (password: admin123)")

        db.session.commit()
        print("✅ Database seeded successfully!")


if __name__ == "__main__":
    seed()
