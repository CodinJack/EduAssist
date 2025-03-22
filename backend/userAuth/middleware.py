from django.http import JsonResponse
from firebase_admin import auth
from django.utils.deprecation import MiddlewareMixin

class FirebaseAuthMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate Firebase users via ID tokens.
    """
    def process_request(self, request):
        print("🔥 Incoming request:", request.path)  # Debugging log
        
        if request.path.startswith("/admin"):
            return None  # Skip Firebase auth for admin

        # Get the token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            print("❌ No auth header found!")
            request.firebaseUser = None  # Set it to None instead of fake values
            return None

        id_token = auth_header.split(" ")[1]
        print("🛠️ Verifying token:", id_token[:10], "...")  # Print first 10 chars for debug

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.firebaseUser = decoded_token  # Correctly attach user to request
            print("✅ Token verified! User ID:", decoded_token.get('user_id'))
        except Exception as e:
            print("❌ Invalid Firebase token:", e)
            request.firebaseUser = None
            return JsonResponse({"error": "Invalid token", "details": str(e)}, status=401)

        return None
