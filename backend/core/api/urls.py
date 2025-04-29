from django.urls import path, include

urlpatterns = [
    path('ai/', include('ai.urls')),
    path('accounts/', include('users.urls')),
    path('snippet/', include('snippet.urls')),
]