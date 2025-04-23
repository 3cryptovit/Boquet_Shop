import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      await login(formData);
      showSuccess('Вы успешно вошли в систему');
      navigate(ROUTES.HOME);
    } catch (error) {
      showError('Ошибка входа. Проверьте email и пароль');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Вход в систему</h1>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
        <div className="auth-links">
          <p>
            Нет аккаунта?{' '}
            <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 