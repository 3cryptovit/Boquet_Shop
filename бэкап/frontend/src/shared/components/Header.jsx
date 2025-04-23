import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../utils/userStore';
import { logout } from '../utils/authService';
import '../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, initializeFromStorage } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeFromStorage();
    const handleStorageChange = () => {
      initializeFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeFromStorage]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/assets/logo.svg" alt="Логотип" className="logo-image" />
          <span>Boquet Shop</span>
        </Link>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-section main-nav">
            <Link to="/catalog" className="nav-link">Каталог</Link>
            <Link to="/constructor" className="nav-link">Конструктор</Link>
            <Link to="/favorites" className="nav-link">Избранное</Link>
          </div>

          <div className="nav-section secondary-nav">
            <Link to="/contacts" className="nav-link">Контакты</Link>
            <Link to="/about" className="nav-link">О нас</Link>
          </div>

          <div className="nav-section auth-nav">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-link cart-link">
                  <i className="fas fa-shopping-cart"></i>
                  Корзина
                </Link>
                <div className="user-section">
                  <span className="welcome-text">
                    Добро пожаловать, {user?.username || 'Пользователь'}
                  </span>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link admin-link">
                      <i className="fas fa-cog"></i>
                      Админ
                    </Link>
                  )}
                  <button onClick={handleLogout} className="nav-link logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="nav-link login-link">Войти</Link>
                <Link to="/register" className="nav-link register-link">Регистрация</Link>
              </div>
            )}
          </div>
        </nav>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
