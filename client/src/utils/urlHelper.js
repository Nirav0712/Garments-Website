// client/src/utils/urlHelper.js
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || '/api';
};

export const getBaseBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl || apiUrl === '/api') {
    return 'http://localhost:5000'; // Development default for non-proxied assets
  }
  return apiUrl.replace(/\/api\/?$/, ''); // Strip /api from the end
};

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('blob:')) return path;
  
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl || apiUrl === '/api') {
    return path; // relies on Vite proxy for /uploads in development
  }
  
  return `${getBaseBackendUrl()}${path.startsWith('/') ? path : `/${path}`}`;
};
