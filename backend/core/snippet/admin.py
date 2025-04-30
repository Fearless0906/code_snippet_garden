from django.contrib import admin
from .models import CodeSnippet, Comment

# Register your models here.
admin.site.register(CodeSnippet)
admin.site.register(Comment)
