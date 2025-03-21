from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from firebase_admin import auth, firestore
import requests
from rest_framework.decorators import api_view, permission_classes
from .permissions import FirebaseAuthentication
from rest_framework.response import Response
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

@csrf_exempt
def register_user(request):
    """
    Endpoint to register a new Firebase user.
    """

    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        # Create user in Firebase Authentication
        user = auth.create_user(email=email, password=password)

        # Store the user in Firestore
        db = firestore.client()
        db.collection('users').document(user.uid).set({
            'email': email,
            'created_at': firestore.SERVER_TIMESTAMP
        })

        return JsonResponse({'message': 'User registered successfully', 'uid': user.uid})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def login_user(request):
    """
    Endpoint to log in a Firebase user.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        # Firebase Sign-in REST API URL
        firebase_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"

        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        response = requests.post(firebase_url, data=json.dumps(payload))
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                "idToken": result['idToken'],          # Firebase ID token
                "refreshToken": result['refreshToken'],  # Refresh token
                "expiresIn": result['expiresIn']
            })
        else:
            return JsonResponse(response.json(), status=401)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([FirebaseAuthentication])
def get_user(request):
    """
    Get the current authenticated Firebase user.
    """
    user = request.user  # Extract user from Firebase token
    return Response({
        "uid": user['uid'],
        "email": user.get('email')
    })
