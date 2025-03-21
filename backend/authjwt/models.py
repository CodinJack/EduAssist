# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    firebase_uid = models.CharField(max_length=128, unique=True, blank=True, null=True)  # Link to Firebase
    quizzes_taken = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    weak_topics = models.JSONField(default=list)  # Store weak topics as JSON

    def __str__(self):
        return self.email if self.email else self.username
