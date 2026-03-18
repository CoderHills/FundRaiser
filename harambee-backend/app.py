import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import config
from extensions import db, migrate, ma
from routes import campaigns_bp, donations_bp, categories_bp


def create_app(config_name: str = None) -> Flask:
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config["default"]))

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(campaigns_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(categories_bp)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "mchanga-api"})

    # ── 404 / 405 handlers ────────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": str(e)}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": str(e)}), 405

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
