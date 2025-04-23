import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTES } from '../../../../shared/constants/routes';

export const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
}; 