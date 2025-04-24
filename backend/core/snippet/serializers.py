from rest_framework import serializers
from .models import CodeSnippet, PracticeExercise, CodeExecution

class CodeSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'language', 'summary', 'snippet', 'tags', 'difficulty_level']

class PracticeExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeExercise
        fields = [
            'id', 'snippet', 'title', 'description', 'initial_code',
            'solution_code', 'test_cases', 'hints', 'difficulty_level', 'order'
        ]

class CodeExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeExecution
        fields = ['id', 'practice_exercise', 'code', 'output', 'status', 'created_at']
