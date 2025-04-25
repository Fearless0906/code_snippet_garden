from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CodeSnippet
from .serializers import CodeSnippetSerializer

class CodeSnippetList(generics.ListCreateAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer

class CodeSnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer


