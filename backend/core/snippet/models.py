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

class PracticeExercise(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    snippet = models.ForeignKey(
        'CodeSnippet',
        on_delete=models.CASCADE,
        related_name='practice_exercises'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    initial_code = models.TextField(help_text="Starting code template for the exercise")
    solution_code = models.TextField(help_text="Solution code for the exercise")
    test_cases = models.JSONField(
        default=list,
        help_text="List of test cases to validate the solution"
    )
    hints = models.JSONField(
        default=list,
        help_text="List of hints for the exercise"
    )
    difficulty_level = models.CharField(
        max_length=12,
        choices=DIFFICULTY_CHOICES,
        default='beginner'
    )
    order = models.PositiveIntegerField(
        default=1,
        help_text="Order of the exercise in the snippet's exercise list"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['snippet', 'order']
        unique_together = ['snippet', 'order']

    def __str__(self):
        return f"{self.snippet.title} - Exercise {self.order}: {self.title}"

class CodeExecution(models.Model):
    practice_exercise = models.ForeignKey(
        PracticeExercise,
        on_delete=models.CASCADE,
        related_name='executions'
    )
    code = models.TextField()
    output = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('success', 'Success'),
            ('error', 'Error'),
            ('running', 'Running')
        ],
        default='running'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']