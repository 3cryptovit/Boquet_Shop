import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError('Пароли не совпадают');
      return;
    }

    try {
      await register(formData);
      showSuccess('Регистрация успешна! Теперь вы можете войти');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      showError('Ошибка при регистрации. Попробуйте другой email');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Регистрация</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">Имя</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Фамилия</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Зарегистрироваться
          </button>
        </form>
        <div className="auth-links">
          <p>
            Уже есть аккаунт?{' '}
            <Link to={ROUTES.LOGIN}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 