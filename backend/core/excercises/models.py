from django.db import models

class Exercise(models.Model):
    id = models.AutoField(primary_key=True)
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    time_estimate = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    completed = models.BooleanField(default=False)
    content = models.TextField(blank=True, null=True)
    code = models.TextField(blank=True, null=True)  # Store code as text
    time_spent = models.IntegerField(blank=True, null=True)  # Store time in milliseconds

    def __str__(self):
        return self.title
