from django.urls import path
from . import views

urlpatterns = [
    path('snippet-list/', views.CodeSnippetList.as_view(), name='snippet-list'),
    path('snippet-details/<int:pk>/', views.CodeSnippetDetail.as_view(), name='snippet-detail'),
]
