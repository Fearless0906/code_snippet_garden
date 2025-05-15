from django.urls import path, include

urlpatterns = [
    path('ai/', include('ai.urls')),
    path('exercises/', include('excercises.urls')),
    path('accounts/', include('users.urls')),
    path('snippet/', include('snippet.urls')),
    path('quiz/', include('quiz.urls')),
]