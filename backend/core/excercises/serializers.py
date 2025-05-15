from rest_framework import serializers
from .models import Exercise

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'difficulty', 'time_estimate', 
                 'language', 'completed', 'content', 'code', 'time_spent']
