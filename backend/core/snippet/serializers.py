from rest_framework import serializers
from .models import CodeSnippet, SavedSnippet, Comment

class CodeSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippet
        fields = ['id', 'title', 'language', 'summary', 'snippet', 'tags', 'difficulty_level', 'is_public', 'saved']


class SavedSnippetSerializer(serializers.ModelSerializer):
    snippet = CodeSnippetSerializer(read_only=True)

    class Meta:
        model = SavedSnippet
        fields = ['id', 'snippet', 'saved_at']

class CommentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'first_name',
            'last_name',
            'text',
            'date',
            'title',
            'discussion_id',
            'parent',
            'replies',
            'like_count',
            'is_liked'
        ]

    def get_date(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")

    def get_like_count(self, obj):
        return obj.like_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.likes.all()
        return False

    def get_replies(self, obj):
        if obj.is_reply:
            return []
        return CommentSerializer(obj.replies.all(), many=True, context=self.context).data