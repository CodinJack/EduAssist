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



class UserStreak(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="streak")
    streak_count = models.IntegerField(default=0)  # Stores the streak days
    last_quiz_date = models.DateField(null=True, blank=True)  # Last quiz submission date

    def update_streak(self, attended_quiz=False):
        today = now().date()

        if attended_quiz:
            if self.last_quiz_date == today:
                return  # Already submitted a quiz today
            
            if self.last_quiz_date == today - timedelta(days=1):
                self.streak_count += 1  # Streak maintained
            else:
                self.streak_count = 1  # Reset streak
            
            self.last_quiz_date = today
            self.save()