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

    # Handle CORS_ORIGINS - allow all in development, specific origins in production
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if isinstance(cors_origins, str):
        cors_origins = [o.strip() for o in cors_origins.split(",")]
    
    # If no specific origins configured, allow all for debugging
    if not cors_origins or cors_origins == [""]:
        cors_origins = "*"
    
    # Log the CORS origins for debugging
    print(f"CORS origins: {cors_origins}")
    
    CORS(app, origins=cors_origins, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])


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

