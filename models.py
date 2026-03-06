from flask_sqlalchemy import SQLAlchemy
import secrets

db = SQLAlchemy()

def generate_token():
    return secrets.token_urlsafe(8)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=True)
    audio_path = db.Column(db.String(256), nullable=True)

    anonymity_level = db.Column(db.String(32), default='full_anonymous')

    contact_name = db.Column(db.String(128), nullable=True)
    contact_email = db.Column(db.String(128), nullable=True)
    contact_phone = db.Column(db.String(32), nullable=True)

    # Coğrafi konum bilgileri
    city = db.Column(db.String(64), nullable=True)
    district = db.Column(db.String(64), nullable=True)

    risk_level = db.Column(db.String(32), default='low')
    tracking_token = db.Column(db.String(32), unique=True, nullable=False, default=generate_token)

    status = db.Column(db.String(64), default='İnceleniyor')
    admin_notes = db.Column(db.Text, nullable=True)
    assigned_to = db.Column(db.String(128), nullable=True)
    priority = db.Column(db.String(32), default='normal')

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())