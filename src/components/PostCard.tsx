
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Create a preview from the content
  const previewText = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card className="blog-card h-full">
      <Link to={`/post/${post._id}`} className="flex flex-col h-full">
        <div className="h-48 relative overflow-hidden">
          <img
            src={post.coverImageURL || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold line-clamp-2 text-bookblue">{post.title}</h3>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground mb-2">By {post.author} · {formattedDate}</p>
          <p className="text-foreground line-clamp-3">{previewText}</p>
        </CardContent>
        
        <CardFooter className="pt-0">
          <span className="text-sm font-medium text-bookgold hover:underline">Read more</span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PostCard;
