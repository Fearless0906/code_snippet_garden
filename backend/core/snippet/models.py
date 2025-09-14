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
    snippet = models.JSONField(default=list)
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
    discussion_id = models.CharField(max_length=200, blank=True, null=True)
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

class ErrorSolution(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    title = models.CharField(max_length=200)
    code = models.TextField()
    solution = models.TextField()
    explanation = models.TextField()
    tags = models.JSONField(default=list)
    difficulty = models.CharField(
        max_length=6,
        choices=DIFFICULTY_CHOICES,
        default='medium'
    )
    votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-votes', '-created_at']

    def __str__(self):
        return self.title
    
class UserSolution(models.Model):
    error = models.ForeignKey(ErrorSolution, on_delete=models.CASCADE, related_name="user_solutions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_solutions")  # Add user reference
    code = models.TextField()
    success = models.BooleanField(default=False)  # Add success field
    output = models.TextField(blank=True)  # Add output field
    error_message = models.TextField(null=True, blank=True)  # Add error field
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Add updated timestamp

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "User Solution"
        verbose_name_plural = "User Solutions"

    def __str__(self):
        return f"Solution for {self.error.title} by {self.user.username}"

class SaveSolution(models.Model):
    error_solution = models.ForeignKey(ErrorSolution, on_delete=models.CASCADE, related_name="saved_solutions")
    solution = models.TextField()
    is_correct = models.BooleanField(default=False)
    runtime = models.FloatField(default=0)  # in milliseconds
    memory_usage = models.IntegerField(default=0)  # in bytes
    output = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_solutions")

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Saved Solution"
        verbose_name_plural = "Saved Solutions"

    def __str__(self):
        return f"Solution for {self.error_solution.title} by {self.user.username}"

