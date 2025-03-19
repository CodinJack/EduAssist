import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase credentials
cred = credentials.Certificate("firebase_config.json")
# firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()
