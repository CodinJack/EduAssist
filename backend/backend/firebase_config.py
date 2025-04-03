import firebase_admin
from firebase_admin import credentials, firestore

SERVICE_ACCOUNT_KEY_PATH = "firebase_config.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    # firebase_admin.initialize_app(cred)

db = firestore.client()
