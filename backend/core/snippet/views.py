from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CodeSnippet
from .serializers import CodeSnippetSerializer, SavedSnippetSerializer

class CodeSnippetList(generics.ListCreateAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

class CodeSnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

class SavedCodeSnippetListView(generics.ListAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

    def get_queryset(self):
        return CodeSnippet.objects.filter(saved=True)
    



