from django.db import models

class Question(models.Model):
    question_text = models.TextField()
    options = models.JSONField()  # Store options as a list
    correct_answer = models.CharField(max_length=255)
    tags = models.JSONField()  # Store tags as a list

    def __str__(self):
        return self.question_text
