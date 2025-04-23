import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../features/auth/ui/RegisterForm';
import { useAuthStore } from '../features/auth/model';

const RegisterPage = () => {
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
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
