from rest_framework import serializers
from .models import CodeSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'language', 'summary', 'snippet', 'tags', 'difficulty_level']

