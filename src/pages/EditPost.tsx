
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
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
          description: 'Failed to load the blog post for editing.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id || !token) return;
    
    setIsSubmitting(true);
    try {
      await postsAPI.updatePost(id, {
        title: data.title,
        author: data.author,
        content: data.content,
        coverImageURL: data.coverImageURL,
      }, token);
      
      toast({
        title: 'Success',
        description: 'Your post has been updated successfully!',
      });
      
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <Button 
        onClick={() => navigate('/dashboard')} 
        variant="outline" 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>
      
      <h1 className="text-3xl font-bold text-bookblue mb-6">Edit Post</h1>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      ) : post ? (
        <PostForm 
          post={post}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Post not found</p>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditPost;
