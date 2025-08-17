import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Google users are automatically verified. This handles email/pass users.
  if (!currentUser.emailVerified) {
    return <Navigate to="/login" state={{ message: "Please verify your email to access this page." }} replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;