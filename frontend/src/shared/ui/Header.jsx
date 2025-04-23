import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model';
import { Menu, X, ShoppingCart, LogOut, LogIn, UserPlus, ShieldCheck, Heart } from 'lucide-react';
import clsx from 'clsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }) =>
    clsx('px-4 py-2 rounded-md hover:bg-gray-100 transition-all', {
      'text-primary font-semibold bg-white shadow': isActive,
    });

  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Логотип */}
        <NavLink to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <img src="./assets/logo.svg" alt="Boquet Shop Logo" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-wide">Boquet Shop</span>
        </NavLink>

        {/* Меню (бургер) */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Навигация */}
        <nav
          className={clsx(
            'absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent px-4 md:px-0 py-4 md:py-0 md:flex md:items-center gap-6 transition-all',
            isMenuOpen ? 'block' : 'hidden md:block'
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <NavLink to="/catalog" className={linkClass} onClick={closeMenu}>
              Каталог
            </NavLink>
            <NavLink to="/constructor" className={linkClass} onClick={closeMenu}>
              Конструктор
            </NavLink>
            <NavLink to="/favorites" className={linkClass} onClick={closeMenu}>
              <div className="flex items-center gap-1">
                <Heart size={16} /> Избранное
              </div>
            </NavLink>
          </div>

          <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            {isAuth ? (
              <>
                <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
                  <div className="flex items-center gap-1">
                    <ShoppingCart size={16} />
                    Корзина
                  </div>
                </NavLink>

                {isAdmin && (
                  <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={16} />
                      Админ
                    </div>
                  </NavLink>
                )}

                <span className="text-sm text-gray-700 px-2 truncate max-w-[150px]">
                  {user?.username || 'Пользователь'}
                </span>

                <button onClick={handleLogout} className={linkClass}>
                  <div className="flex items-center gap-1 text-red-500">
                    <LogOut size={16} />
                    Выйти
                  </div>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  <div className="flex items-center gap-1">
                    <LogIn size={16} />
                    Войти
                  </div>
                </NavLink>
                <NavLink to="/register" className={linkClass} onClick={closeMenu}>
                  <div className="flex items-center gap-1">
                    <UserPlus size={16} />
                    Регистрация
                  </div>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
