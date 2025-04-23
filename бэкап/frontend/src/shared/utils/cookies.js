export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: '/',
    secure: true,
    sameSite: 'strict',
    ...options
  };

  let cookieString = `${name}=${value}`;

  Object.entries(defaultOptions).forEach(([key, value]) => {
    if (value === true) {
      cookieString += `; ${key}`;
    } else if (value) {
      cookieString += `; ${key}=${value}`;
    }
  });

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}; 