from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta

class Quiz(models.Model):
    topic = models.CharField(max_length=255)
    num_questions = models.IntegerField()
    difficulty = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.topic} - {self.num_questions} {self.difficulty} Questions"

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=255)
    attempted_option = models.CharField(max_length=1, blank=True, null=True)  #will store 'a', 'b', 'c', or 'd'
    tags = models.JSONField(default=list) 

    def __str__(self):
        return self.text

