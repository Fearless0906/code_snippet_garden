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


class Comment(models.Model):
    snippet = models.ForeignKey(CodeSnippet, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    # discussion_id = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    likes = models.ManyToManyField(User, related_name='liked_comments', blank=True)
    
    @property
    def like_count(self):
        return self.likes.count()

    @property
    def is_reply(self):
        return self.parent is not None

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.snippet.title}'

