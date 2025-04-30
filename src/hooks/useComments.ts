import { useState, useEffect, useCallback } from 'react';
import { Comment, fetchComments, createComment, toggleLike, createReply } from '../data/comments';
import { toast } from 'sonner';

export const useComments = (snippetId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchComments(snippetId);
      setComments(data);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [snippetId]);

  const addComment = async (text: string) => {
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      first_name: 'You',
      last_name: '',
      text,
      date: 'Just now',
      like_count: 0,
      is_liked: false,
      replies: [],
      parent: null,
      title: undefined,
      discussion_id: undefined
    };

    setComments(prev => [optimisticComment, ...prev]);

    try {
      const newComment = await createComment(snippetId, text);
      setComments(prev => 
        prev.map(comment => 
          comment.id === optimisticComment.id ? newComment : comment
        )
      );
      return true;
    } catch (error) {
      setComments(prev => 
        prev.filter(comment => comment.id !== optimisticComment.id)
      );
      toast.error('Failed to add comment');
      return false;
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const updatedComment = await toggleLike(snippetId, commentId);
      setComments(prev => 
        prev.map(comment => {
          // Check if this is the main comment being liked
          if (comment.id === commentId) {
            return {
              ...comment,
              like_count: updatedComment.like_count,
              is_liked: updatedComment.is_liked
            };
          }
          // Check nested replies for the liked comment
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      like_count: updatedComment.like_count,
                      is_liked: updatedComment.is_liked
                    }
                  : reply
              )
            };
          }
          return comment;
        })
      );
      return true;
    } catch (error) {
      toast.error('Failed to update like');
      return false;
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    try {
      const newReply = await createReply(snippetId, parentId, text);
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          // Also check for nested replies
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === parentId 
                  ? { ...reply, replies: [...(reply.replies || []), newReply] }
                  : reply
              )
            };
          }
          return comment;
        })
      );
      return true;
    } catch (error) {
      toast.error('Failed to add reply');
      return false;
    }
  };

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    addComment,
    handleLike,
    handleReply,
    refreshComments: loadComments
  };
};
