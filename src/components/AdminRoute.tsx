import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ADMIN_EMAIL = 'nafisabdullah424@gmail.com';

const AdminRoute: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (currentUser.email !== ADMIN_EMAIL) {
    // Logged in but not an admin, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  // Logged in and is admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
