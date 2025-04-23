import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../model';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    }

    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
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
      const { username, email, password } = formData;
      await register({ username, email, password });
      navigate('/');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Придумайте имя пользователя"
          error={formErrors.username}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите ваш email"
          error={formErrors.email}
          required
        />

        <Input
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Придумайте пароль"
          error={formErrors.password}
          required
        />

        <Input
          label="Подтверждение пароля"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Повторите пароль"
          error={formErrors.confirmPassword}
          required
        />

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        <p>
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-primary hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
