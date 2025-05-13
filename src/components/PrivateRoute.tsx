
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    toast({
      title: 'Access Denied',
      description: 'You must be logged in to view this page.',
      variant: 'destructive',
    });
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
