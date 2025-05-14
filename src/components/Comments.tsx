import React, { useState } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdate: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ postId, comments, onCommentsUpdate }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user, token } = useAuth();
  const { toast } = useToast();
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      if (!token) throw new Error('You must be logged in to comment');
      
      const result = await postsAPI.addComment(postId, newComment, token);
      onCommentsUpdate(result.comments);
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      if (!token) throw new Error('You must be logged in to delete a comment');
      
      const result = await postsAPI.deleteComment(postId, commentId, token);
      onCommentsUpdate(result.comments);
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-6">Comments ({comments.length})</h3>
      
      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-3 min-h-24"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-md mb-8">
          <p>Please <a href="/login" className="text-primary font-medium hover:underline">log in</a> to add a comment.</p>
        </div>
      )}
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-muted-foreground ml-2">{formatDate(comment.createdAt)}</span>
                </div>
                
                {isAuthenticated && user && user._id === comment.userId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
      )}
    </div>
  );
};

export default Comments; 