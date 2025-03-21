from rest_framework import permissions
from firebase_admin import auth

class FirebaseAuthentication(permissions.BasePermission):
    """
    Custom permission to authenticate Firebase users.
    """

    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False

        id_token = auth_header.split(' ')[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Store decoded Firebase user
            return True
        except Exception:
            return False
