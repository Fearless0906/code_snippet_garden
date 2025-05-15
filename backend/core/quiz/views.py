from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Quiz, Question, QuizResult
from .serializers import QuizSerializer, QuestionSerializer, QuizResultSerializer

class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def create(self, request, *args, **kwargs):
        questions_data = request.data.pop('questions', [])
        serializer = self.get_serializer(data=request.data, context={'questions': questions_data})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'id'

class QuizSubmitView(generics.CreateAPIView):
    serializer_class = QuizResultSerializer

    def create(self, request, *args, **kwargs):
        quiz_id = kwargs.get('quiz_id')
        quiz = Quiz.objects.get(id=quiz_id)
        answers = request.data.get('answers', [])
        
        total_questions = quiz.questions.count()
        correct_answers = sum(
            1 for q, a in zip(quiz.questions.all(), answers)
            if q.correct_answer == a
        )
        
        percentage = (correct_answers / total_questions * 100) if total_questions else 0
        
        result = QuizResult.objects.create(
            quiz=quiz,
            total_score=correct_answers,
            percentage=percentage
        )
        
        serializer = self.get_serializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        return Question.objects.filter(quiz_id=quiz_id)

    def perform_create(self, serializer):
        quiz_id = self.kwargs.get('quiz_id')
        quiz = get_object_or_404(Quiz, id=quiz_id)
        serializer.save(quiz=quiz)

class QuizResultListView(generics.ListAPIView):
    serializer_class = QuizResultSerializer
    
    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        return QuizResult.objects.filter(quiz_id=quiz_id)
