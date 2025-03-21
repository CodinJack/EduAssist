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
from django.urls import path, include
from quiz.views import create_quiz, get_all_quizzes, get_quiz, submit_quiz
urlpatterns = [
    path("auth/", include('userAuth.urls')),
    path("api/quizzes/create_quiz", create_quiz, name="create_quiz"),
    path("api/quizzes/get_all_quizzes", get_all_quizzes, name="get_all_quizzes"),
    path("api/quizzes/get_quiz/<str:quiz_id>", get_quiz, name="get_quiz"),
    path("api/quizzes/submit_test/<str:quiz_id>", submit_quiz, name="submit_quiz")
]
