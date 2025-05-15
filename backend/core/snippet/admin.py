from django.contrib import admin
from .models import CodeSnippet, Comment, ErrorSolution, UserSolution, SaveSolution

# Register your models here.
admin.site.register(CodeSnippet)
admin.site.register(Comment)
admin.site.register(ErrorSolution)
admin.site.register(UserSolution)
admin.site.register(SaveSolution)
