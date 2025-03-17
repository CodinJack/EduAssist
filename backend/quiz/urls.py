from django.urls import path
from .views import get_questions

urlpatterns = [
    path('questions/', get_questions),
]
