from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CodeSnippet, Comment
from .serializers import CodeSnippetSerializer, SavedSnippetSerializer, CommentSerializer

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

class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        snippet_id = self.kwargs.get('snippet_id')
        return Comment.objects.filter(snippet_id=snippet_id)

    def perform_create(self, serializer):
        snippet_id = self.kwargs.get('snippet_id')
        snippet = CodeSnippet.objects.get(id=snippet_id)
        serializer.save(
            user=self.request.user,
            snippet=snippet
        )

class CommentLikeView(APIView):
    def post(self, request, snippet_id, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, snippet_id=snippet_id)
            user = request.user

            if user in comment.likes.all():
                comment.likes.remove(user)
            else:
                comment.likes.add(user)

            serializer = CommentSerializer(comment, context={'request': request})
            return Response(serializer.data)
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )




