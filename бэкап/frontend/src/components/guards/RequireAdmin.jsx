import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../shared/constants/routes';

export const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
}; 