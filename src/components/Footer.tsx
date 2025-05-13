
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-bookblue">
              <Book className="h-5 w-5" />
              <span>BookBlog</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-bookblue">
              Home
            </Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-bookblue">
              Login
            </Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-bookblue">
              Register
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BookBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
