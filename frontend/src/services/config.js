// Configuración de API para desarrollo y producción

// URL del backend - usa variable de entorno o fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api' 
    : '/api'
);

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
