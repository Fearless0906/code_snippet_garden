from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CodeSnippet, PracticeExercise
from .serializers import CodeSnippetSerializer, PracticeExerciseSerializer

class CodeSnippetList(generics.ListCreateAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

class CodeSnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

class PracticeExerciseList(generics.ListCreateAPIView):
    serializer_class = PracticeExerciseSerializer

    def get_queryset(self):
        snippet_id = self.kwargs.get('snippet_id')
        return PracticeExercise.objects.filter(snippet_id=snippet_id)

    def perform_create(self, serializer):
        snippet_id = self.kwargs.get('snippet_id')
        snippet = CodeSnippet.objects.get(id=snippet_id)
        serializer.save(snippet=snippet)

class PracticeExerciseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PracticeExercise.objects.all()
    serializer_class = PracticeExerciseSerializer

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        exercise = self.get_instance()
        code = request.data.get('code', '')
        
        # Create execution record
        execution = CodeExecution.objects.create(
            practice_exercise=exercise,
            code=code
        )

        try:
            # Here you would implement actual code execution
            # For demo purposes, we'll just echo the code
            output = f"Code execution simulation:\n{code}"
            status = 'success'
        except Exception as e:
            output = str(e)
            status = 'error'

        execution.output = output
        execution.status = status
        execution.save()

        return Response({
            'id': execution.id,
            'output': output,
            'status': status
        })

# Create your views here.
