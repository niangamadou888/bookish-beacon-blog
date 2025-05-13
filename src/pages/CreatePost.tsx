
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreatePost: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a post.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await postsAPI.createPost({
        title: data.title,
        author: data.author,
        content: data.content,
        coverImageURL: data.coverImageURL,
      }, token);
      
      toast({
        title: 'Success',
        description: 'Your post has been created successfully!',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
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
      
      <h1 className="text-3xl font-bold text-bookblue mb-6">Create New Post</h1>
      
      <PostForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreatePost;
