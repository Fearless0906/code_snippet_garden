import { useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useComments } from "../../hooks/useComments";
import SpinnerLoader from "../Loader/SpinnerLoader";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  snippetId: string;
  title?: string;
  discussionId?: string;
}

export const CommentSection = ({ snippetId }: CommentSectionProps) => {
  const { comments, loading, addComment, handleLike, handleReply } =
    useComments(snippetId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const success = await addComment(newComment.trim());
    if (success) {
      setNewComment("");
    }
    setIsSubmitting(false);
  };

  const onLikeClick = async (commentId: string) => {
    await handleLike(commentId);
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await handleReply(parentId, replyText.trim());
    if (success) {
      setReplyText("");
      setReplyingTo(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="flex items-center text-2xl font-bold tracking-tight">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments
        <Badge variant="secondary" className="ml-2">
          {comments.length}
        </Badge>
      </h2>

      <div className="space-y-4 w-full">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <div className="bg-primary text-white flex items-center justify-center w-full h-full text-sm font-medium">
              U
            </div>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              className="resize-none mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleAddComment} size="sm">
              {loading ? <SpinnerLoader className="inline" /> : "Post comment"}
            </Button>
          </div>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="pb-4 border-b w-full">
            <CommentItem
              comment={comment}
              onLike={onLikeClick}
              onReply={handleReply}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
