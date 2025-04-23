export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },

  // Пользователи
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    DELETE: '/users/delete'
  },

  // Букеты
  BOUQUETS: {
    BASE: '/bouquets',
    BY_ID: (id) => `/bouquets/${id}`,
    CREATE: '/bouquets/create',
    UPDATE: (id) => `/bouquets/${id}`,
    DELETE: (id) => `/bouquets/${id}`,
    SEARCH: '/bouquets/search'
  },

  // Категории
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    CREATE: '/categories/create',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`
  },

  // Цветы
  FLOWERS: {
    BASE: '/flowers',
    BY_ID: (id) => `/flowers/${id}`,
    CREATE: '/flowers/create',
    UPDATE: (id) => `/flowers/${id}`,
    DELETE: (id) => `/flowers/${id}`
  },

  // Материалы
  MATERIALS: {
    BASE: '/materials',
    BY_ID: (id) => `/materials/${id}`,
    CREATE: '/materials/create',
    UPDATE: (id) => `/materials/${id}`,
    DELETE: (id) => `/materials/${id}`
  },

  // Корзина
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    UPDATE: '/cart/update',
    CLEAR: '/cart/clear'
  },

  // Заказы
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    CREATE: '/orders/create',
    UPDATE: (id) => `/orders/${id}`,
    DELETE: (id) => `/orders/${id}`,
    USER_ORDERS: '/orders/user'
  }
}; 