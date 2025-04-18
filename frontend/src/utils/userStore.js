import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  initializeFromStorage: () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    if (token && username) {
      set({
        user: username,
        isAuthenticated: true,
        isAdmin: userRole === 'admin'
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false
      });
    }
  },

  setUser: (userData) => {
    if (userData) {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('userRole', userData.role);
      set({
        user: userData.username,
        isAuthenticated: true,
        isAdmin: userData.role === 'admin'
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false
      });
    }
  },

  clearUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  }
})); 