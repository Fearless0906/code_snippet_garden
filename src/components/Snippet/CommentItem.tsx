import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Comment } from "../../data/comments";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<boolean>;
  level?: number;
}

export const CommentItem = ({
  comment,
  onLike,
  onReply,
  level = 0,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onReply(comment.id, replyText.trim());
    if (success) {
      setReplyText("");
      setIsReplying(false);
    }
    setIsSubmitting(false);
  };

  // Add maximum nesting level
  const MAX_NESTING_LEVEL = 10;

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <Avatar
          className={`${level === 0 ? "h-8 w-8" : "h-6 w-6"} flex-shrink-0`}
        >
          <div className="bg-secondary text-secondary-foreground flex items-center justify-center w-full h-full text-sm font-medium">
            {comment.first_name[0]}
          </div>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">
              {`${comment.first_name} ${comment.last_name}`}
            </span>
            <span className="text-xs text-muted-foreground">
              {comment.date}
            </span>
          </div>
          <p className="text-sm text-foreground">{comment.text}</p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${
                comment.is_liked
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              } hover:text-primary flex items-center gap-1`}
              onClick={() => onLike(comment.id)}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>{comment.is_liked ? "Liked" : "Like"}</span>
              {comment.like_count > 0 && (
                <span className="ml-1">({comment.like_count})</span>
              )}
            </Button>
            {/* Only show reply button if not at max nesting level */}
            {level < MAX_NESTING_LEVEL && (
              <Button
                className="text-xs text-muted-foreground hover:text-foreground"
                variant="ghost"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </Button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3 pl-4 border-l-2 w-full">
              <div className="flex gap-3 w-full">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <div className="bg-primary text-white flex items-center justify-center w-full h-full text-xs font-medium">
                    U
                  </div>
                </Avatar>
                <div className="flex-1 w-full">
                  <Textarea
                    placeholder={`Reply to ${comment.first_name}...`}
                    className="resize-none mb-2 text-sm w-full"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleReplySubmit}
                      disabled={isSubmitting || !replyText.trim()}
                    >
                      {isSubmitting ? "Replying..." : "Reply"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show replies with proper nesting */}
          {comment.replies && comment.replies.length > 0 && (
            <div className={`mt-3 ${level > 0 ? "pl-2" : "pl-4"} space-y-4`}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
