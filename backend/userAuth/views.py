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


@api_view(['POST'])
def register_user(request):
    """
    Create a user in Firebase Authentication and store in Firestore with transaction rollback.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=400)

    db = firestore.client()
    transaction = db.transaction()

    try:
        user = auth.create_user(email=email, password=password)

        @firestore.transactional
        def store_user(transaction, uid, email):
            user_ref = db.collection('users').document(uid)
            transaction.set(user_ref, {
                'userID': uid,
                'email': email,
                'weak_topics': [],
                'number_of_tests_attempted': 0,
                'total_marks': 0,
                'created_at': firestore.SERVER_TIMESTAMP
            })

        store_user(transaction, user.uid, email)

        return Response({
            "uid": user.uid,
            "email": user.email,
            "message": "User created successfully."
        })

    except Exception as e:
        try:
            auth.delete_user(user.uid)
            return Response({"error": str(e), "rollback": "User deleted from Firebase Auth"}, status=400)
        except Exception as rollback_error:
            return Response({
                "error": str(e),
                "rollback_error": str(rollback_error),
                "message": "Failed to delete Firebase Auth user during rollback."
            }, status=500)

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
        print(response.status_code, response.text)  # Debugging

        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                "idToken": result['idToken'],
                "refreshToken": result['refreshToken'],
                "expiresIn": result['expiresIn']
            })
        else:
            return JsonResponse(response.json(), status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
def get_user(request):
    """
    Get the current authenticated Firebase user.
    """
    print("🛠️ Checking Firebase authentication...")

    if not hasattr(request, "firebaseUser") or request.firebaseUser is None:
        print("❌ Unauthorized request: No Firebase user found")
        return Response({"error": "Unauthorized - Firebase token is missing or invalid"}, status=401)

    uid = request.firebaseUser.get('user_id')  # Use .get() to avoid crashes
    email = request.firebaseUser.get('email')
    
    if not uid:
        print("❌ Unauthorized: Missing user ID in token")
        return Response({"error": "Unauthorized - Invalid Firebase token"}, status=401)

    print("✅ Authenticated Firebase user:", uid, email)
    
    return Response({
        "details": get_user_by_uid(uid),  # Ensure this function handles missing users
    })


def get_user_by_uid(uid):
    """
    Get Firebase Authentication user and Firestore user document by UID.
    """
    try:
        # Fetch user from Firebase Authentication
        firebase_user = auth.get_user(uid)

        # Fetch user document from Firestore
        db = firestore.client()
        user_doc = db.collection('users').document(uid).get()

        if user_doc.exists:
            user_data = user_doc.to_dict()
        else:
            user_data = {"error": "User document not found in Firestore"}

        # Combine Firebase Auth and Firestore data
        result = {
            "auth_user": {
                "uid": firebase_user.uid,
                "email": firebase_user.email,
                "phone_number": firebase_user.phone_number,
                "disabled": firebase_user.disabled,
                "created_at": firebase_user.user_metadata.creation_timestamp,
                "last_sign_in": firebase_user.user_metadata.last_sign_in_timestamp
            },
            "firestore_user": user_data
        }
        return result

    except Exception as e:
        return {"error": str(e)}


@api_view(['GET'])
def get_all_users(request):
    """
    Retrieve all users from the Firestore 'users' collection.
    """
    try:
        db = firestore.client()
        users_ref = db.collection('users')
        users = users_ref.stream()

        users_list = []
        for user in users:
            user_data = user.to_dict()
            important_user_data = {}
            if ('total_marks' not in user_data.keys()):
                continue
            if ('number_of_tests_attempted' not in user_data.keys()):
                continue
            important_user_data['userID'] = user.id 
            important_user_data['email'] = user_data['email']
            important_user_data['total_marks'] = user_data['total_marks']
            important_user_data['number_of_tests_attempted'] = user_data['number_of_tests_attempted']
            important_user_data['average_marks'] = 0
            if (user_data['number_of_tests_attempted'] != 0):
                important_user_data['average_marks'] = user_data['total_marks']/user_data['number_of_tests_attempted']
            users_list.append(important_user_data)
        sorted_users_list = sorted(users_list, key=lambda x: x['average_marks'], reverse=True)
        return Response({"users": users_list}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_user_from_cookie(request):
    """
    Retrieve the authenticated user ID from the Firebase token stored in cookies.
    """
    try:
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            print("❌ No auth header found!")
            return Response({"error": "No authentication token provided"}, status=401)

        id_token = auth_header.split(" ")[1]
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get('user_id')

        if not uid:
            return Response({"error": "Invalid token: UID not found"}, status=401)

        return Response({"userID": uid, "message": "User authenticated successfully"}, status=200)

    except auth.ExpiredIdTokenError:
        return Response({"error": "Token has expired"}, status=401)

    except auth.InvalidIdTokenError:
        return Response({"error": "Invalid authentication token"}, status=401)

    except Exception as e:
        return Response({"error": str(e)}, status=401)


@api_view(['POST'])
def update_weak_topics(request):
    """
    Update the weak topics of a Firestore user document.
    """
    try:
        uid = request.firebaseUser['user_id']
        db = firestore.client()
        user_ref = db.collection('users').document(uid)

        # Get request data
        data = json.loads(request.body)
        new_topics = data.get('weak_topics', [])

        # Check if user document exists
        user_doc = user_ref.get()
        if not user_doc.exists:
            return JsonResponse({"error": "User not found"}, status=404)

        # Retrieve current weak topics
        current_topics = user_doc.get('weak_topics') or []

        # Combine and remove duplicates
        updated_topics = list(set(current_topics + new_topics))

        # Update Firestore document
        user_ref.update({'weak_topics': updated_topics})

        return JsonResponse({
            "message": "Weak topics updated successfully",
            "weak_topics": updated_topics
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
def update_total_marks(request):
    """
    Update the total marks of a Firestore user document.
    """
    try:
        uid = request.firebaseUser['user_id']
        db = firestore.client()
        user_ref = db.collection('users').document(uid)

        # Get request data
        data = json.loads(request.body)
        new_marks = data.get('marks', 0)

        # Check if user document exists
        user_doc = user_ref.get()
        if not user_doc.exists:
            return JsonResponse({"error": "User not found"}, status=404)

        # Retrieve current total marks
        current_marks = user_doc.get('total_marks') or 0

        # Add new marks to total
        updated_marks = current_marks + new_marks

        # Update Firestore document
        user_ref.update({'total_marks': updated_marks})
        user_ref.update({'number_of_tests_attempted': user_doc.get('number_of_tests_attempted')+1})
        return JsonResponse({
            "message": "Total marks and number of tests updated successfully",
            "total_marks": updated_marks
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
def update_bookmarked_questions(request):
    """
    Update the `bookmarked_questions` of a Firestore user document.
    Creates the field if it doesn't exist and avoids duplicates.
    """
    try:
        uid = request.firebaseUser['user_id']
        db = firestore.client()
        user_ref = db.collection('users').document(uid)

        # ✅ Get request data
        data = json.loads(request.body)
        new_question = data.get('question', {})

        if not new_question:
            return JsonResponse({"error": "No question provided"}, status=400)

        # ✅ Check if the user document exists
        user_doc = user_ref.get()
        if not user_doc.exists:
            return JsonResponse({"error": "User not found"}, status=404)

        # ✅ Fetch current data or initialize the field
        user_data = user_doc.to_dict()
        questions = user_data.get('bookmarked_questions', [])

        # ✅ Add new question while avoiding duplicates
        if new_question not in questions:
            questions.append(new_question)

        # ✅ Update Firestore document
        user_ref.update({'bookmarked_questions': questions})

        return JsonResponse({
            "message": "Bookmarked questions updated successfully",
            "questions": questions
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)