// Configuración de API para desarrollo y producción

// URL del backend - usa variable de entorno o fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
