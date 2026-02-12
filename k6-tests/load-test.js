import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { testVendorLifecycle } from './vendor_k6_test.js';

// Configurar URL Base - cambiar a la de producción al desplegar
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001/concesionariapruebas/us-central1/api';
// Ajustar el puerto/path si pruebas local en functions

export const options = {
    // Definir etapas de carga
    stages: [
        { duration: '30s', target: 20 }, // Subir a 20 usuarios en 30s
        { duration: '1m', target: 20 },  // Mantener 20 usuarios por 1 minuto
        { duration: '10s', target: 0 },  // Bajar a 0 usuarios
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de las peticiones deben ser < 500ms
        http_req_failed: ['rate<0.01'],   // Menos del 1% de fallos permitidos
    },
};

export default function () {
    // 1. Login (Obtener Token)
    const loginPayload = JSON.stringify({
        email: 'admin@consecionaria.com',
        password: 'consesionariachida', // Sacado de auth.controller.js
    });

    const headers = { 'Content-Type': 'application/json' };

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, { headers: headers });

    // Verificar login
    const isLoginSuccessful = check(loginRes, {
        'status is 200': (r) => r.status === 200,
        'token present': (r) => r.json('token') !== undefined,
    });

    if (!isLoginSuccessful) {
        console.error(`Login failed: ${loginRes.status} ${loginRes.body}`);
        return; // No continuar si falla login
    }

    const token = loginRes.json('token');
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Usar Bearer token
    };

    group('API Endpoints', function () {
        // 2. Obtener Autos
        const autosRes = http.get(`${BASE_URL}/api/autos`, { headers: authHeaders });
        check(autosRes, { 'status is 200': (r) => r.status === 200 });
        sleep(1);

        // 3. Ciclo de vida Vendedores (CRUD)
        group('Vendedores Lifecycle', function () {
            testVendorLifecycle(BASE_URL, { headers: authHeaders });
        });
        sleep(1);

        // 4. Obtener Clientes
        const clientesRes = http.get(`${BASE_URL}/api/clientes`, { headers: authHeaders });
        check(clientesRes, { 'status is 200': (r) => r.status === 200 });
        sleep(1);

        // 5. Obtener Concesionarias
        const concesionariasRes = http.get(`${BASE_URL}/api/concesionarias`, { headers: authHeaders });
        check(concesionariasRes, { 'status is 200': (r) => r.status === 200 });
        sleep(1);
    });
}
