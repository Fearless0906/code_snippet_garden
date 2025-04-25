from django.db import models

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

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']

