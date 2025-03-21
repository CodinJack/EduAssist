# middleware.py
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from your_app_name.firebase import verify_firebase_token
from django.contrib.auth import get_user_model

class FirebaseAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            if decoded_token:
                user_model = get_user_model()
                uid = decoded_token.get('uid')
                email = decoded_token.get('email')

                # Create or get the user
                user, _ = user_model.objects.get_or_create(username=uid, defaults={'email': email})
                request.user = user
            else:
                return JsonResponse({'error': 'Invalid token'}, status=401)
