import { sleep, group, check } from 'k6';
import http from 'k6/http';
import { login } from './auth_k6.js';
import { config } from './config.js';

// Test específico para validar el deployment en Railway
const BASE_URL = config.baseUrl;

export const options = {
    stages: [
        { duration: '10s', target: 2 },
        { duration: '30s', target: 2 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // Railway puede ser más lento
        http_req_failed: ['rate<0.1'],
        checks: ['rate>0.9'],
    },
};

export default function () {
    group('Railway Deployment Health Check', function() {
        
        // 1. Verificar que el servidor esté activo
        group('🚀 Server Status', function() {
            const healthRes = http.get(`${BASE_URL}/`);
            check(healthRes, {
                'Status endpoint responds': (r) => r.status === 200,
                'Response contains message': (r) => r.json('message') !== undefined,
                'Database status available': (r) => r.json('database') !== undefined,
            });
        });

        sleep(1);

        // 2. Verificar autenticación con MongoDB
        group('🔐 Authentication with MongoDB', function() {
            const token = login(BASE_URL, config.auth.adminEmail, config.auth.adminPassword);
            check(token, {
                'Login successful': (t) => t !== null && t !== undefined,
                'Token is string': (t) => typeof t === 'string',
                'Token has content': (t) => t && t.length > 0,
            });

            if (!token) {
                console.error('❌ Authentication failed - check if admin user exists in MongoDB');
                return;
            }

            const authHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            // 3. Verificar endpoints protegidos
            group('📋 Protected Endpoints', function() {
                const endpoints = [
                    { name: 'Autos', path: '/api/autos' },
                    { name: 'Clientes', path: '/api/clientes' },
                    { name: 'Vendedores', path: '/api/vendedores' },
                    { name: 'Concesionarias', path: '/api/concesionarias' },
                ];

                endpoints.forEach(endpoint => {
                    const res = http.get(`${BASE_URL}${endpoint.path}`, { headers: authHeaders });
                    check(res, {
                        [`${endpoint.name} endpoint accessible`]: (r) => r.status === 200,
                        [`${endpoint.name} returns JSON`]: (r) => {
                            try {
                                JSON.parse(r.body);
                                return true;
                            } catch {
                                return false;
                            }
                        },
                    });
                });
            });

            sleep(1);

            // 4. Test de escritura simple (crear y eliminar un registro)
            group('💾 Database Write Test', function() {
                const testAuto = {
                    marca: 'TestMarca_K6',
                    modelo: 'TestModelo_K6', 
                    año: 2024,
                    color: 'Test',
                    numeroSerie: 'TEST_K6_' + Date.now()
                };

                // Crear registro
                const createRes = http.post(
                    `${BASE_URL}/api/autos`,
                    JSON.stringify(testAuto),
                    { headers: authHeaders }
                );

                const createCheck = check(createRes, {
                    'Auto creation successful': (r) => r.status === 201,
                    'Created auto has ID': (r) => r.json('data._id') !== undefined,
                });

                if (createCheck && createRes.json('data._id')) {
                    const autoId = createRes.json('data._id');
                    
                    sleep(0.5);

                    // Eliminar registro de prueba
                    const deleteRes = http.del(`${BASE_URL}/api/autos/${autoId}`, {
                        headers: authHeaders
                    });

                    check(deleteRes, {
                        'Auto deletion successful': (r) => r.status === 200,
                        'Cleanup completed': (r) => true,
                    });
                }
            });
        });
    });

    sleep(1);
}

export function handleSummary(data) {
    console.log('\n🎯 RAILWAY DEPLOYMENT TEST SUMMARY');
    console.log('=====================================');
    console.log(`Target URL: ${BASE_URL}`);
    console.log(`Total requests: ${data.metrics.http_reqs.count}`);
    console.log(`Failed requests: ${data.metrics.http_req_failed.count}`);
    console.log(`Average response time: ${data.metrics.http_req_duration.avg.toFixed(2)}ms`);
    console.log(`95th percentile: ${data.metrics.http_req_duration['p(95)'].toFixed(2)}ms`);
    
    if (data.metrics.checks) {
        const checksPassed = data.metrics.checks.count - data.metrics.checks.fails;
        console.log(`Checks passed: ${checksPassed}/${data.metrics.checks.count}`);
    }
    
    return {};
}