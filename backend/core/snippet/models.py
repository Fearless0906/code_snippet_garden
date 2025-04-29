from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CodeSnippet(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    language = models.CharField(max_length=50)
    summary = models.TextField()
    snippet = models.TextField()
    tags = models.JSONField(default=list)  # Stores tags as a JSON array
    difficulty_level = models.CharField(
        max_length=12,
        choices=DIFFICULTY_CHOICES,
        default='beginner'
    )
    is_public = models.BooleanField(default=True)
    saved = models.BooleanField(default=False)  # Replace saved_at with saved

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']


class SavedSnippet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_snippets')
    snippet = models.ForeignKey(CodeSnippet, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'snippet')
        ordering = ['-saved_at']

