# models/user.py
from db import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    otp = db.Column(db.String(6), nullable=True)  # 6-digit OTP
    otp_created_at = db.Column(db.DateTime, nullable=True)  # OTP timestamp
