from django.urls import path
from . import views

urlpatterns = [
    path('snippet-list/', views.CodeSnippetList.as_view(), name='snippet-list'),
    path('snippet-details/<int:pk>/', views.CodeSnippetDetail.as_view(), name='snippet-detail'),
    path('snippets/<int:snippet_id>/exercises/', views.PracticeExerciseList.as_view(), name='practice-exercise-list'),
    path('exercises/<int:pk>/', views.PracticeExerciseDetail.as_view(), name='practice-exercise-detail'),
    path('exercises/<int:pk>/execute/', views.PracticeExerciseDetail.as_view(), name='exercise-execute'),
]
