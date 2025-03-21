"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from quiz.views import create_quiz, get_all_quizzes, get_quiz, submit_quiz
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger schema configuration
schema_view = get_schema_view(
    openapi.Info(
        title="EduAssist API",
        default_version='v1',
        description="API documentation for the EduAssist Django backend",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("auth/", include('userAuth.urls')),
    path("api/quizzes/create_quiz", create_quiz, name="create_quiz"),
    path("api/quizzes/get_all_quizzes", get_all_quizzes, name="get_all_quizzes"),
    path("api/quizzes/get_quiz/<str:quiz_id>", get_quiz, name="get_quiz"),
    path("api/quizzes/submit_test/<str:quiz_id>", submit_quiz, name="submit_quiz"),
]
