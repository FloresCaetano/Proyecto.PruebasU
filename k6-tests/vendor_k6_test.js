import http from 'k6/http';
import { check, sleep } from 'k6';

export function testVendorLifecycle(baseUrl, params) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);

    // Datos del nuevo vendedor
    const newVendor = {
        name: `Vendedor Test ${timestamp}`,
        email: `test.vendor.${timestamp}.${randomSuffix}@example.com`,
        telefono: `${1000000 + randomSuffix}`,
        comision: 10,
        codigoEmpleado: `EMP-${timestamp}-${randomSuffix}`
    };

    // 1. Crear Vendor (POST)
    const createRes = http.post(`${baseUrl}/api/vendedores`, JSON.stringify(newVendor), params);

    check(createRes, {
        'create vendor status is 201': (r) => r.status === 201,
        'create vendor has id': (r) => r.json('id') !== undefined,
    });

    if (createRes.status !== 201) {
        console.error(`Failed to create vendor: ${createRes.status} ${createRes.body}`);
        return;
    }

    const createdId = createRes.json('id');
    sleep(1);

    // 2. Obtener todos los vendors (GET)
    const getAllRes = http.get(`${baseUrl}/api/vendedores`, params);
    check(getAllRes, {
        'get all vendors status is 200': (r) => r.status === 200,
        'new vendor in list': (r) => {
            const body = r.json();
            return Array.isArray(body) && body.some(v => v.id === createdId);
        }
    });
    sleep(1);

    // 3. Obtener vendor por ID (GET)
    const getByIdRes = http.get(`${baseUrl}/api/vendedores/${createdId}`, params);
    check(getByIdRes, {
        'get vendor by id status is 200': (r) => r.status === 200,
        'vendor id matches': (r) => r.json('id') === createdId,
    });
    sleep(1);

    // 4. Actualizar vendor (PUT)
    const updatePayload = JSON.stringify({
        comision: 15,
        name: `Vendedor Updated ${timestamp}`
    });

    const updateRes = http.put(`${baseUrl}/api/vendedores/${createdId}`, updatePayload, params);
    check(updateRes, {
        'update vendor status is 200': (r) => r.status === 200,
        'vendor updated name matches': (r) => r.json('name') === `Vendedor Updated ${timestamp}`,
        'vendor updated comision matches': (r) => r.json('comision') === 15,
    });
    sleep(1);

    // 5. Eliminar vendor (DELETE)
    const deleteRes = http.del(`${baseUrl}/api/vendedores/${createdId}`, null, params);
    check(deleteRes, {
        'delete vendor status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 6. Verificar eliminación (GET debería ser 404)
    const verifyDeleteRes = http.get(`${baseUrl}/api/vendedores/${createdId}`, params);
    check(verifyDeleteRes, {
        'get deleted vendor status is 404': (r) => r.status === 404,
    });
}
