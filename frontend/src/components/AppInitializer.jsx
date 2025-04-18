import React, { useEffect } from 'react';
import useUserStore from '../store/useUserStore';
import { getAccessToken } from '../utils/authService';

const AppInitializer = ({ children }) => {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const initializeApp = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          await fetchUser();
        } catch (error) {
          console.error('Ошибка при загрузке данных пользователя:', error);
        }
      }
    };

    initializeApp();
  }, [fetchUser]);

  return <>{children}</>;
};

export default AppInitializer; 