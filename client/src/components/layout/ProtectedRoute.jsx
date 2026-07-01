import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore.js';

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        {/* Sleek Spinner */}
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-sm font-medium animate-pulse">
          Verifying your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
