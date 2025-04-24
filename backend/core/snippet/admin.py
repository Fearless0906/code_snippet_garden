from django.contrib import admin
from .models import CodeSnippet, PracticeExercise, CodeExecution

# Register your models here.
admin.site.register(CodeSnippet)
admin.site.register(PracticeExercise)
admin.site.register(CodeExecution)
