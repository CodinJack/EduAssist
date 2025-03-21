import os
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Absolute path to your credentials
FIREBASE_CERT_PATH = os.path.join("firebase-adminsdk.json")
cred = credentials.Certificate(FIREBASE_CERT_PATH)
firebase_admin.initialize_app(cred)

