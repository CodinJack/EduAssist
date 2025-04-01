from django.http import JsonResponse
from firebase_admin import auth
from django.utils.deprecation import MiddlewareMixin

class FirebaseAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        print("🔥 Incoming request:", request.path)  # Debugging log

        if request.path.startswith("/admin"):
            return None  # Skip Firebase auth for admin

        auth_header = request.headers.get("Authorization")
        print("📜 Request Headers.get(Authorization):", auth_header)  # Debugging

        if not auth_header or not auth_header.startswith("Bearer "):
            print("❌ No valid auth header found!")
            request.firebaseUser = None
            return JsonResponse({"error": "Missing or invalid Authorization header"}, status=401)

        id_token = auth_header.split(" ")[1]
        print("🛠️ Verifying token:", id_token[:30], "...")  # Print first 30 chars

        try:
            decoded_token = auth.verify_id_token(id_token)  # ✅ Verify Firebase token
            request.firebaseUser = decoded_token
            print("✅ Token verified! User ID:", decoded_token.get('user_id'))
        except Exception as e:
            print("❌ Invalid Firebase token:", e)
            request.firebaseUser = None
            return JsonResponse({"error": "Invalid token", "details": str(e)}, status=401)

        return None
