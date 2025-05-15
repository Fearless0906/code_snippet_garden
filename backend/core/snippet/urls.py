from django.urls import path
from . import views

urlpatterns = [
    path('snippet-list/', views.CodeSnippetList.as_view(), name='snippet-list'),
    path('snippet-details/<int:pk>/', views.CodeSnippetDetail.as_view(), name='snippet-detail'),
    path('snippet-saved-list/', views.SavedCodeSnippetListView.as_view(), name='snippet-saved-list'),
    path('error-solutions/', views.ErrorSolutionListView.as_view(), name='error-solutions'),
    path('error-solutions/<int:pk>/', views.ErrorSolutionDetailViewUpdate.as_view(), name='error-solutions-detail'),

    # User Solutions endpoints
    path('user-solutions/', views.UserSolutionView.as_view(), name='user-solutions-list'),
    path('user-solutions/<int:pk>/', views.UserSolutionDetailView.as_view(), name='user-solution-detail'),
    path('user-solutions/run/', views.RunUserSolutionView.as_view(), name='run-user-solution'),
    
    # Save Solutions endpoints
    path('save-solutions/', views.SaveSolutionView.as_view(), name='save-solutions-list'),
    path('save-solutions/<int:pk>/', views.SaveSolutionDetailView.as_view(), name='save-solution-detail'),
    path('snippets/<int:snippet_id>/comments/', 
         views.CommentListCreate.as_view(), 
         name='snippet-comments'),
    path('snippets/<int:snippet_id>/comments/<int:comment_id>/like/',
         views.CommentLikeView.as_view(),
         name='comment-like'),
]
