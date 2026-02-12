// Configuración centralizada para todos los tests k6
export const config = {
    // URL base - se puede sobrescribir con variable de entorno
    baseUrl: __ENV.BASE_URL || __ENV.RAILWAY_URL || 'https://proyecto-pruebasu-production.up.railway.app',
    
    // URLs de fallback para diferentes entornos
    urls: {
        local: 'http://localhost:3000',
        railway: 'https://proyecto-pruebasu-production.up.railway.app',
        // Agrega tu URL de Railway aquí cuando la tengas
        production: __ENV.RAILWAY_URL || 'https://tu-proyecto.up.railway.app'
    },
    
    // Credenciales por defecto
    auth: {
        adminEmail: 'admin@consecionaria.com',
        adminPassword: 'consesionariachida'
    },
    
    // Configuraciones de carga por defecto
    loadTestOptions: {
        stages: [
            { duration: '30s', target: 5 },
            { duration: '1m', target: 5 },
            { duration: '10s', target: 0 },
        ],
        thresholds: {
            http_req_duration: ['p(95)<1000'], // Más tiempo para requests en Railway
            http_req_failed: ['rate<0.05'], // Permitir más fallos en entorno cloud
        },
    },
    
    // Configuración para tests de stress
    stressTestOptions: {
        stages: [
            { duration: '2m', target: 10 },
            { duration: '5m', target: 10 },
            { duration: '2m', target: 20 },
            { duration: '5m', target: 20 },
            { duration: '2m', target: 0 },
        ],
        thresholds: {
            http_req_duration: ['p(95)<2000'],
            http_req_failed: ['rate<0.1'],
        },
    }
};

// Log de la configuración actual
console.log(`🚀 K6 Tests running against: ${config.baseUrl}`);

export default config;