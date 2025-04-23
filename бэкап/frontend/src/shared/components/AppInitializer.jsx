import { useEffect } from 'react';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const AppInitializer = ({ children }) => {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe().catch(() => {
        // Если запрос не удался, очищаем токен
        localStorage.removeItem('token');
      });
    }
  }, [fetchMe]);

  return children;
}; 