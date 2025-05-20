
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session } = useAppContext();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
