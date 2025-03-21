# auth/urls.py
from django.urls import path
from .views import protected_view, register_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("protected/", protected_view, name="protected_view"),
    # JWT token endpoints
    path(
        "token/", TokenObtainPairView.as_view(), name="token_obtain_pair"
    ),  # Generate access & refresh token
    path(
        "token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),  # Refresh the token
    path("register/", register_user, name="register_user"),
]
