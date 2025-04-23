/**
 * Модель пользователя
 * @typedef {Object} User
 * @property {string} id - ID пользователя
 * @property {string} username - Имя пользователя
 * @property {string} email - Email пользователя
 * @property {string} role - Роль пользователя ('user' или 'admin')
 * @property {string} [firstName] - Имя (опционально)
 * @property {string} [lastName] - Фамилия (опционально)
 * @property {string} [avatar] - URL аватара (опционально)
 */

/**
 * Проверяет, является ли пользователь администратором
 * @param {User} user - Объект пользователя
 * @returns {boolean} true, если пользователь является администратором
 */
export const isAdmin = (user) => {
  return user?.role === 'admin';
};

/**
 * Получает полное имя пользователя
 * @param {User} user - Объект пользователя
 * @returns {string} Полное имя или имя пользователя, если полное имя не задано
 */
export const getFullName = (user) => {
  if (!user) return '';

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  return user.username;
};

/**
 * Преобразует данные пользователя с сервера в объект модели
 * @param {Object} data - Данные с сервера
 * @returns {User} Объект пользователя
 */
export const mapUserFromAPI = (data) => {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role || 'user',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    avatar: data.avatar || '',
  };
}; 