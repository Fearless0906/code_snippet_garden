from rest_framework import serializers
from .models import CodeSnippet, SavedSnippet

class CodeSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'language', 'summary', 'snippet', 'tags', 'difficulty_level', 'is_public', 'saved']


class SavedSnippetSerializer(serializers.ModelSerializer):
    snippet = CodeSnippetSerializer(read_only=True)

    class Meta:
        model = SavedSnippet
        fields = ['id', 'snippet', 'saved_at']