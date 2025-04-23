import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { ROUTES } from '../constants/routes';

export const RequireAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}; 