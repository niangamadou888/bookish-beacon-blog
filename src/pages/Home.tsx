
import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Book } from 'lucide-react';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsAPI.getAllPosts();
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog posts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  // Post skeleton loader
  const PostSkeleton = () => (
    <div className="flex flex-col h-full rounded-lg border bg-card overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-bookcream py-16 md:py-24">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-bookblue mb-4">Welcome to BookBlog</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Discover amazing books, thoughtful reviews, and literary discussions all in one place.
          </p>
          <div className="flex items-center justify-center">
            <Book className="h-10 w-10 text-bookgold" />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold text-bookblue mb-8">Latest Posts</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No posts yet</h3>
            <p className="text-gray-500 mt-2">Check back later for new content</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
