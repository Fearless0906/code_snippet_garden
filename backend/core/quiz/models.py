from django.db import models
import uuid

class Quiz(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question = models.TextField()
    options = models.JSONField()  # Store options as a JSON object
    correct_answer = models.IntegerField(
        choices=[
            (0, 'A'),
            (1, 'B'),
            (2, 'C'),
            (3, 'D')
        ]
    )
    explanation = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=10, choices=Quiz.DIFFICULTY_CHOICES)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.question[:50]}..."

class QuizResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, related_name='results', on_delete=models.CASCADE)
    total_score = models.IntegerField()
    percentage = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quiz.title} - {self.percentage}%"
