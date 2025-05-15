from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CodeSnippet, Comment, ErrorSolution, UserSolution, SaveSolution
from .serializers import CodeSnippetSerializer, CommentSerializer, ErrorSolutionSerializer, UserSolutionSerializer, SaveSolutionSerializer

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
        

class ErrorSolutionListView(generics.ListCreateAPIView):
    queryset = ErrorSolution.objects.all()
    serializer_class = ErrorSolutionSerializer


class ErrorSolutionDetailViewUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = ErrorSolution.objects.all()
    serializer_class = ErrorSolutionSerializer

    def get(self, request, pk):
        try:
            error_solution = self.get_object()
            serializer = self.get_serializer(error_solution)
            return Response(serializer.data)
        except ErrorSolution.DoesNotExist:
            return Response(
                {"error": "Error solution not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class UserSolutionView(generics.ListCreateAPIView):
    serializer_class = UserSolutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSolution.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RunUserSolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        error_id = request.data.get('error')
        code = request.data.get('code')
        
        if not error_id or not code:
            return Response(
                {"error": "Both error_id and code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create a new user solution
            solution = UserSolution.objects.create(
                error_id=error_id,
                user=request.user,
                code=code,
                success=True  # You might want to add validation logic here
            )
            
            serializer = UserSolutionSerializer(solution)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserSolutionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSolutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSolution.objects.filter(user=self.request.user)

class SaveSolutionView(generics.ListCreateAPIView):
    serializer_class = SaveSolutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SaveSolution.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SaveSolutionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SaveSolutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SaveSolution.objects.filter(user=self.request.user)




