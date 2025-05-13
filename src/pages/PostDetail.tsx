
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
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

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const data = await postsAPI.getPostById(id);
        setPost(data.post);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the blog post. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const handleDelete = async () => {
    try {
      if (!id || !token) return;
      await postsAPI.deletePost(id, token);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold text-bookblue mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container py-8 max-w-4xl">
      {/* Back button */}
      <Button 
        onClick={() => navigate('/')} 
        variant="outline" 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Posts</span>
      </Button>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-bookblue mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </header>

      {/* Admin Controls */}
      {isAuthenticated && (
        <div className="flex gap-3 mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/edit-post/${post._id}`)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this blog post. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Cover Image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={post.coverImageURL || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'}
          alt={post.title}
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      {/* Post Content */}
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
      />
    </article>
  );
};

export default PostDetail;
