export const ROUTES = {
  // Публичные маршруты
  HOME: '/',
  CATALOG: '/catalog',
  BOUQUET_DETAILS: '/catalog/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',

  // Административные маршруты
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    BOUQUETS: '/admin/bouquets',
    CATEGORIES: '/admin/categories',
    FLOWERS: '/admin/flowers',
    MATERIALS: '/admin/materials',
    SETTINGS: '/admin/settings'
  },

  // Public routes
  ABOUT: '/about',
  CONTACTS: '/contacts',
  ORDERS: '/orders',
  MY_BOUQUETS: '/my-bouquets',
  CONSTRUCTOR: '/constructor',

  // Защищенные маршруты
  ORDER_DETAILS: (id) => `/orders/${id}`,
  FAVORITES: '/favorites',
}; 