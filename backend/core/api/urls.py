from django.urls import path, include

urlpatterns = [
    path('accounts/', include('users.urls')),
    path('snippet/', include('snippet.urls')),
]