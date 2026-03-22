import os
import hashlib
import hmac
import base64
from extensions import db
from datetime import datetime, timezone

def generate_password_hash(password):
    """Generate a password hash using pbkdf2_sha256"""
    salt = base64.b64encode(os.urandom(16)).decode('utf-8')
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    pwdhash = base64.b64encode(pwdhash).decode('utf-8')
    return f"pbkdf2_sha256${salt}${pwdhash}$100000"

def check_password_hash(password_hash, password):
    """Check a password against a pbkdf2_sha256 hash"""
    try:
        method, salt, pwdhash, iterations = password_hash.split('$')
        if method != 'pbkdf2_sha256':
            return False
        pwdhash_check = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), int(iterations))
        pwdhash_check = base64.b64encode(pwdhash_check).decode('utf-8')
        return hmac.compare_digest(pwdhash, pwdhash_check)
    except Exception:
        return False

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"
