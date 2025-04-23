import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { showError } from './notifications';

export const handleUnauthorized = () => {
  useAuthStore.getState().logout();
  showError('Сессия истекла. Пожалуйста, войдите снова.');
  window.location.href = '/login';
};

export const initializeAuth = async () => {
  try {
    await useAuthStore.getState().fetchMe();
  } catch (error) {
    useAuthStore.getState().logout();
  }
}; 