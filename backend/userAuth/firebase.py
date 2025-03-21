import firebase_admin
from firebase_admin import credentials, auth

FIREBASE_CERT_PATH = "firebase.json"

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CERT_PATH)
    firebase_admin.initialize_app(cred)
