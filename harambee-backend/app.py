import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import config
from extensions import db, migrate, ma
from routes import campaigns_bp, donations_bp, categories_bp, auth_bp, admin_bp
from services.mpesa import mpesa_service
from models import User, Campaign, Category, CampaignUpdate, Donation


def create_app(config_name: str = None) -> Flask:
    if config_name is None:
        # Default to production if not set
        config_name = os.environ.get("FLASK_ENV", "production")

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config["default"]))

    try:
        db.init_app(app)
        migrate.init_app(app, db)
        # Try to create tables if they don't exist
        with app.app_context():
            try:
                db.create_all()
                print("Database tables created successfully")
                
                # Seed categories
                categories = [
                    {"id": "medical", "label": "Medical"},
                    {"id": "education", "label": "Education"},
                    {"id": "emergency", "label": "Emergency"},
                    {"id": "memorial", "label": "Memorial"},
                    {"id": "community", "label": "Community"},
                    {"id": "wedding", "label": "Wedding"},
                    {"id": "business", "label": "Business"},
                    {"id": "church", "label": "Church"},
                ]
                for cat_data in categories:
                    from models.campaign import Category
                    if not Category.query.get(cat_data["id"]):
                        cat = Category(id=cat_data["id"], label=cat_data["label"])
                        db.session.add(cat)
                
                # Create admin user if no admin exists
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
                print("Database seeded successfully!")
            except Exception as e:
                print(f"Table creation warning: {e}")
    except Exception as e:
        app.logger.warning(f"Database initialization skipped: {e}")
    
    ma.init_app(app)
    
    mpesa_service.init_app(app)

    # Allow all CORS for now - can be restricted later
    # Get CORS_ORIGINS from environment, default to allow all
    cors_origins = os.environ.get("CORS_ORIGINS", "*")
    
    # Log the CORS origins for debugging
    print(f"CORS origins: {cors_origins}")
    
    CORS(app, origins=cors_origins, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization", "Accept", "Origin"], expose_headers=["Content-Length", "X-Requested-With"])


    app.register_blueprint(auth_bp)
    app.register_blueprint(campaigns_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(admin_bp)


    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "mchanga-api"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": str(e)}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": str(e)}), 405

    @app.errorhandler(500)
    def internal_error(e):
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

