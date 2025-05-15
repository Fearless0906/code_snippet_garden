from django.urls import path
from .views import (
    QuizListCreateView,
    QuizDetailView,
    QuizSubmitView,
    QuestionListCreateView,
    QuizResultListView
)

app_name = 'quiz'

urlpatterns = [
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list-create'),
    path('quizzes/<uuid:id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<uuid:quiz_id>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('quizzes/<uuid:quiz_id>/questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('quizzes/<uuid:quiz_id>/results/', QuizResultListView.as_view(), name='quiz-results'),
]
