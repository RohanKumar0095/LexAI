import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  
  // Show non-intrusive loading indicator while initial session / token verification completes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08070D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#AAA3BB] font-medium">Loading LexAI...</span>
        </div>
      </div>
    );
  }

  // If session check has completed and user is neither authenticated nor in Guest Mode, redirect to /login
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
export default AuthGuard;
