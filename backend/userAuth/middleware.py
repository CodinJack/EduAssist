from django.http import JsonResponse
from firebase_admin import auth
from django.utils.deprecation import MiddlewareMixin

class FirebaseAuthMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate Firebase users via ID tokens.
    """
    def process_request(self, request):
        # Skip admin and registration URLs
        if request.path.startswith("/admin") or request.path.startswith("/auth/register/") or request.path.startswith("/auth/login/"):
            return None

        # Get the token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Unauthorized"}, status=401)

        id_token = auth_header.split(" ")[1]

        try:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token
        except Exception as e:
            return JsonResponse({"error": "Invalid token", "details": str(e)}, status=401)

        return None
