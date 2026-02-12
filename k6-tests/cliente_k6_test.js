import http from 'k6/http';
import { check, sleep } from 'k6';

export function testClienteLifecycle(baseUrl, params) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);

    // Datos del nuevo cliente (coinciden con el modelo)
    const newClient = {
        nombre: `Cliente Test ${timestamp}`,
        email: `test.client.${timestamp}.${randomSuffix}@example.com`,
        telefono: `099${Math.floor(Math.random() * 10000000)}`,
        direccion: `Calle Falsa ${randomSuffix}`,
        ciudad: 'Quito'
    };

    // 1. Crear Cliente (POST)
    const createRes = http.post(`${baseUrl}/api/clientes`, JSON.stringify(newClient), params);

    const checkId = check(createRes, {
        'create client status is 201': (r) => r.status === 201,
        'create client has id': (r) => r.json('cliente.id') !== undefined || r.json('cliente._id') !== undefined,
    });

    if (!checkId || createRes.status !== 201) {
        console.error(`Create Client Failed. Status: ${createRes.status}. Body: ${createRes.body}`);
        return;
    }

    const createdId = createRes.json('cliente.id') || createRes.json('cliente._id');
    sleep(1);

    // 2. Obtener todos los clientes (GET)
    const getAllRes = http.get(`${baseUrl}/api/clientes`, params);
    check(getAllRes, {
        'get all clients status is 200': (r) => r.status === 200,
        'new client in list': (r) => {
            const body = r.json();
            // El backend puede devolver { clientes: [...] } o [...] directamente
            let list = body.clientes || body;
            return Array.isArray(list) && list.some(c => (c.id === createdId || c._id === createdId));
        }
    });
    sleep(1);

    // 3. Obtener cliente por ID (GET)
    const getByIdRes = http.get(`${baseUrl}/api/clientes/${createdId}`, params);
    check(getByIdRes, {
        'get client by id status is 200': (r) => r.status === 200,
        'client id matches': (r) => {
            const body = r.json();
            return (body.id === createdId || body._id === createdId);
        }
    });
    sleep(1);

    // 4. Actualizar cliente (PUT)
    const updatePayload = JSON.stringify({
        nombre: `Cliente Updated ${timestamp}`,
        ciudad: 'Guayaquil'
    });

    const updateRes = http.put(`${baseUrl}/api/clientes/${createdId}`, updatePayload, params);
    check(updateRes, {
        'update client status is 200': (r) => r.status === 200,
        'client updated name matches': (r) => r.json('nombre') === `Cliente Updated ${timestamp}`,
        'client updated city matches': (r) => r.json('ciudad') === 'Guayaquil',
    });
    sleep(1);

    // 5. Eliminar cliente (DELETE)
    const deleteRes = http.del(`${baseUrl}/api/clientes/${createdId}`, null, params);
    check(deleteRes, {
        'delete client status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 6. Verificar eliminación (GET debería ser 404)
    const verifyDeleteRes = http.get(`${baseUrl}/api/clientes/${createdId}`, params);
    check(verifyDeleteRes, {
        'get deleted client status is 404': (r) => r.status === 404,
    });
}
