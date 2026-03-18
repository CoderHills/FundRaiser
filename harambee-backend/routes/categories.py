from flask import Blueprint, jsonify
from models.campaign import Category
from schemas import categories_schema

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


@categories_bp.route("/", methods=["GET"])
def list_categories():
    """GET /api/categories/ — returns all categories"""
    categories = Category.query.order_by(Category.label).all()
    return jsonify(categories_schema.dump(categories))
