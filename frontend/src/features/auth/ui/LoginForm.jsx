import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../model';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Введите корректный email';
    }

    if (!password) {
      errors.password = 'Пароль обязателен';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    clearError();

    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Вход в аккаунт</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите ваш email"
          error={formErrors.email}
          required
        />

        <Input
          label="Пароль"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          error={formErrors.password}
          required
        />

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        <p>
          Еще нет аккаунта?{' '}
          <a href="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
