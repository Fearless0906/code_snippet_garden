from django.urls import path
from . import views

urlpatterns = [
    path('exercises/', views.ExerciseList.as_view(), name='exercise-list'),
    path('exercises/<str:pk>/', views.ExerciseDetail.as_view(), name='exercise-detail'),
]
