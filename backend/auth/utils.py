# auth/utils.py
import random
from datetime import datetime, timedelta
import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def otp_expired(otp_created_at, expiration_minutes=10):
    if not otp_created_at:
        return True
    return datetime.utcnow() > otp_created_at + timedelta(minutes=expiration_minutes)
