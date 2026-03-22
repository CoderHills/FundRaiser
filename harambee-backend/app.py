import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import config
from extensions import db, migrate, ma
from routes import campaigns_bp, donations_bp, categories_bp, auth_bp, admin_bp
from services.mpesa import mpesa_service


def create_app(config_name: str = None) -> Flask:
    if config_name is None:
        # Default to production if not set
        config_name = os.environ.get("FLASK_ENV", "production")

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config["default"]))

    try:
        db.init_app(app)
        migrate.init_app(app, db)
    except Exception as e:
        app.logger.warning(f"Database initialization skipped: {e}")
    
    ma.init_app(app)
    
    mpesa_service.init_app(app)

    # Handle CORS_ORIGINS as a list
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if isinstance(cors_origins, str):
        cors_origins = [o.strip() for o in cors_origins.split(",")]
    
    CORS(app, origins=cors_origins, supports_credentials=True)


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

