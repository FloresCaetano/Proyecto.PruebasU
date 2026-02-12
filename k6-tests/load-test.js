import { sleep, group } from 'k6';
import { testVendorLifecycle } from './vendor_k6_test.js';
import { testClienteLifecycle } from './cliente_k6_test.js';
import { login } from './auth_k6.js';
import { testAutos } from './autos_k6.js';
import { testConcesionarias } from './concesionarias_k6.js';
import { config } from './config.js';

// Usar configuración centralizada
const BASE_URL = config.baseUrl;

export const options = config.loadTestOptions;

export default function () {
    const token = login(BASE_URL, config.auth.adminEmail, config.auth.adminPassword);

    if (!token) {
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    group('API Endpoints', function () {
        // 2. Obtener Autos
        testAutos(BASE_URL, { headers: authHeaders });
        sleep(1);

        // 3. Ciclo de vida Vendedores (CRUD)
        group('Vendedores Lifecycle', function () {
            testVendorLifecycle(BASE_URL, { headers: authHeaders });
        });
        sleep(1);

        // 4. Ciclo de vida Clientes (CRUD)
        group('Clientes Lifecycle', function () {
            testClienteLifecycle(BASE_URL, { headers: authHeaders });
        });
        sleep(1);

        // 5. Obtener Concesionarias
        testConcesionarias(BASE_URL, { headers: authHeaders });
        sleep(1);
    });
}
