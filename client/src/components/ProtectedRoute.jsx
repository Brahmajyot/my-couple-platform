import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

/**
 * Protects a route, redirecting unauthenticated users to the home page.
 * @param {object} props - Component props containing children (the protected content).
 */
export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

 
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-xl text-primary-pink">
        Verifying Session Security...
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}