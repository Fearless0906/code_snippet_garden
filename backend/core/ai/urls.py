from django.urls import path
from .views import generate_snippet_metadata, generate_code_snippet

urlpatterns = [
    path('generate-tags/', generate_snippet_metadata, name='generate-tags'),
    path('generate-code-snippet/', generate_code_snippet, name='generate-snippets'),
]
