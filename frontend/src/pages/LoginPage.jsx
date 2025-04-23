import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginForm';
import { useAuthStore } from '../features/auth/model';

const LoginPage = () => {
  const { isAuth } = useAuthStore();
  const navigate = useNavigate();

  // Перенаправление, если пользователь уже авторизован
  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
