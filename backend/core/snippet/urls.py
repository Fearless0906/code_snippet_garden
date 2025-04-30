from django.urls import path
from . import views

urlpatterns = [
    path('snippet-list/', views.CodeSnippetList.as_view(), name='snippet-list'),
    path('snippet-details/<int:pk>/', views.CodeSnippetDetail.as_view(), name='snippet-detail'),
    path('snippet-saved-list/', views.SavedCodeSnippetListView.as_view(), name='snippet-saved-list'),
    path('snippets/<int:snippet_id>/comments/', 
         views.CommentListCreate.as_view(), 
         name='snippet-comments'),
    path('snippets/<int:snippet_id>/comments/<int:comment_id>/like/',
         views.CommentLikeView.as_view(),
         name='comment-like'),
]
