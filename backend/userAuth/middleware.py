from django.http import JsonResponse
from firebase_admin import auth
from django.utils.deprecation import MiddlewareMixin
import json

class FirebaseAuthMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate Firebase users via ID tokens.
    """
    def process_request(self, request):
        if request.path.startswith("/admin"):
            return None

        # Get the token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            request.user = {'userID': '-1','email': 'invalid@mail.com'}
            return None

        id_token = auth_header.split(" ")[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.firebaseUser = decoded_token
            print(request.firebaseUser)
        except Exception as e:
            return JsonResponse({"error": "Invalid token", "details": str(e)}, status=401)

        return None
