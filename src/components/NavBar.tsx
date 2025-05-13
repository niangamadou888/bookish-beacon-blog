
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Book, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-bookblue">
            <Book className="h-6 w-6" />
            <span>BookBlog</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-bookblue font-medium">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-foreground hover:text-bookblue font-medium">
                Dashboard
              </Link>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/login')}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button
                className="bg-bookblue hover:bg-bookblue-light text-white"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6 pt-10">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-bookblue">
              <Book className="h-6 w-6" />
              <span>BookBlog</span>
            </Link>
            
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-foreground hover:text-bookblue font-medium py-2">
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-foreground hover:text-bookblue font-medium py-2">
                    Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-start"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-start"
                    onClick={() => navigate('/login')}
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button
                    className="w-full bg-bookblue hover:bg-bookblue-light text-white"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavBar;
