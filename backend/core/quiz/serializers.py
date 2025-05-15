from rest_framework import serializers
from .models import Quiz, Question, QuizResult

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'options', 'correct_answer', 'explanation', 'difficulty', 'category']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'category', 'questions', 'created_at']

    def create(self, validated_data):
        questions_data = self.context.get('questions', [])
        quiz = Quiz.objects.create(**validated_data)
        
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        
        return quiz

class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['id', 'quiz', 'total_score', 'percentage', 'created_at']
