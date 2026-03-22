from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models.user import User
from models.campaign import Campaign, Donation
import jwt
import datetime
from functools import wraps

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth = request.headers['Authorization'].split()
            if len(auth) == 2 and auth[0].lower() == 'bearer':
                token = auth[1]
        
        if not token:
            return jsonify({'message': 'token missing'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user or not current_user.is_admin:
                return jsonify({'message': 'admin access required'}), 403
        except:
            return jsonify({'message': 'token invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user):
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({
        'users': [{
            'id': u.id,
            'email': u.email,
            'name': u.name,
            'phone': u.phone,
            'is_admin': u.is_admin,
            'is_active': u.is_active,
            'verified': u.verified,
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in users]
    })

@admin_bp.route('/users/<int:user_id>/toggle-active', methods=['PUT'])
@admin_required
def toggle_active(current_user, user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({
        'message': 'User active status updated',
        'user': {'id': user.id, 'is_active': user.is_active}
    })

@admin_bp.route('/users/promote', methods=['POST'])
@admin_required
def promote_to_admin(current_user):
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found with this email'}), 404
    
    if user.is_admin:
        return jsonify({'error': 'User is already an admin'}), 400
    
    user.is_admin = True
    db.session.commit()
    
    return jsonify({
        'message': f'{user.name} has been promoted to admin',
        'user': {'id': user.id, 'email': user.email, 'name': user.name, 'is_admin': user.is_admin}
    })

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    # Prevent admin from deleting themselves
    if user_id == current_user.id:
        return jsonify({'error': 'You cannot delete your own account'}), 400
    
    user = User.query.get_or_404(user_id)
    
    # Delete user's campaigns and donations first
    # Get campaign IDs owned by this user
    user_campaigns = Campaign.query.filter_by(user_id=user_id).all()
    campaign_ids = [c.id for c in user_campaigns]
    
    # Delete donations for these campaigns
    if campaign_ids:
        from models.campaign import Donation
        Donation.query.filter(Donation.campaign_id.in_(campaign_ids)).delete(synchronize_session=False)
    
    # Delete campaigns
    Campaign.query.filter_by(user_id=user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'})

@admin_bp.route('/campaigns', methods=['GET'])
@admin_required
def get_campaigns(current_user):
    campaigns = Campaign.query.order_by(Campaign.created_at.desc()).all()
    return jsonify({
        'campaigns': [{
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'target': c.target,
            'raised': c.raised,
            'organizer': c.organizer,
            'status': c.status,
            'verified': c.verified,
            'featured': c.featured,
            'created_at': c.created_at.isoformat() if c.created_at else None
        } for c in campaigns]
    })

@admin_bp.route('/campaigns/<int:campaign_id>/approve', methods=['PUT'])
@admin_required
def approve_campaign(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.status = 'active'
    db.session.commit()
    return jsonify({
        'message': 'Campaign approved',
        'campaign': {'id': campaign.id, 'status': campaign.status}
    })

@admin_bp.route('/campaigns/<int:campaign_id>/reject', methods=['PUT'])
@admin_required
def reject_campaign(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.status = 'rejected'
    db.session.commit()
    return jsonify({
        'message': 'Campaign rejected',
        'campaign': {'id': campaign.id, 'status': campaign.status}
    })

@admin_bp.route('/campaigns/<int:campaign_id>/suspend', methods=['PUT'])
@admin_required
def suspend_campaign(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.status = 'suspended'
    db.session.commit()
    return jsonify({
        'message': 'Campaign suspended',
        'campaign': {'id': campaign.id, 'status': campaign.status}
    })

@admin_bp.route('/campaigns/<int:campaign_id>/complete', methods=['PUT'])
@admin_required
def complete_campaign(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.status = 'completed'
    db.session.commit()
    return jsonify({
        'message': 'Campaign marked as completed',
        'campaign': {'id': campaign.id, 'status': campaign.status}
    })

@admin_bp.route('/campaigns/<int:campaign_id>/toggle-featured', methods=['PUT'])
@admin_required
def toggle_featured(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.featured = not campaign.featured
    db.session.commit()
    return jsonify({
        'message': 'Campaign featured status updated',
        'campaign': {'id': campaign.id, 'featured': campaign.featured}
    })

@admin_bp.route('/campaigns/<int:campaign_id>', methods=['DELETE'])
@admin_required
def delete_campaign(current_user, campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    db.session.delete(campaign)
    db.session.commit()
    return jsonify({
        'message': 'Campaign deleted successfully'
    })

@admin_bp.route('/donations', methods=['GET'])
@admin_required
def get_donations(current_user):
    donations = Donation.query.order_by(Donation.created_at.desc()).all()
    return jsonify({
        'donations': [{
            'id': d.id,
            'donor_name': d.donor_name,
            'amount': d.amount,
            'message': d.message,
            'anonymous': d.anonymous,
            'status': d.status,
            'campaign_id': d.campaign_id,
            'created_at': d.created_at.isoformat() if d.created_at else None
        } for d in donations]
    })

@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def get_analytics(current_user):
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    total_campaigns = Campaign.query.count()
    active_campaigns = Campaign.query.filter_by(status='active').count()
    total_donations = Donation.query.count()
    total_donated = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
    
    return jsonify({
        'analytics': {
            'total_users': total_users,
            'active_users': active_users,
            'total_campaigns': total_campaigns,
            'active_campaigns': active_campaigns,
            'total_donations': total_donations,
            'total_donated': float(total_donated)
        }
    })
