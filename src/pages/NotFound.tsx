
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-bookcream-dark">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Book className="h-16 w-16 text-bookblue" />
        </div>
        <h1 className="text-4xl font-bold text-bookblue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find the page you're looking for. The book you're searching for might be on another shelf.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-bookblue hover:bg-bookblue-light flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
