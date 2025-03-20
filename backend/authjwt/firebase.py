# firebase.py
import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK only once
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_admin.json")
    firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return None
