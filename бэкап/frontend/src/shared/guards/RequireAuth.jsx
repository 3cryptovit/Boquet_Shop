import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { ROUTES } from '../constants/routes';

export const RequireAuth = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}; 