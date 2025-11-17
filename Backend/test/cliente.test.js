const request = require('supertest');
const app = require('../src/app.js');

describe('API de Clientes', () => {
  // GET
  test('GET /api/clientes debería devolver lista vacía inicialmente', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // POST
  test('POST /api/clientes debería crear un nuevo cliente', async () => {
    const nuevoCliente = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '0998765432',
      direccion: 'Av. Principal 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').send(nuevoCliente);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Juan Pérez');
    expect(res.body.email).toBe('juan.perez@email.com');
  });

  // POST: datos inválidos
  test('POST /api/clientes debería rechazar datos inválidos', async () => {
    const res = await request(app).post('/api/clientes').send({ nombre: 'María' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Nombre, Email, Teléfono, Dirección y Ciudad son requeridos');
  });

  // PUT
  test('PUT /api/clientes/:id debería actualizar un cliente existente', async () => {
    const cliente = {
      nombre: 'Ana López',
      email: 'ana.lopez@email.com',
      telefono: '0987654321',
      direccion: 'Calle Secundaria 456',
      ciudad: 'Guayaquil'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`)
      .send({ telefono: '0999999999' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.telefono).toBe('0999999999');
  });

  // DELETE
  test('DELETE /api/clientes/:id debería eliminar un cliente', async () => {
    const cliente = {
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '0976543210',
      direccion: 'Av. Tercera 789',
      ciudad: 'Cuenca'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const eliminado = await request(app).delete(`/api/clientes/${id}`);
    expect(eliminado.statusCode).toBe(200);
    expect(eliminado.body.nombre).toBe('Carlos Rodríguez');

    const res = await request(app).get('/api/clientes');
    expect(res.body.find(c => c.id === id)).toBeUndefined();
  });

  // VALIDACIÓN DE FORMATO: Email inválido
  test('POST /api/clientes debería rechazar email con formato inválido', async () => {
    const clienteEmailInvalido = {
      nombre: 'Pedro Gómez',
      email: 'correo@invalido',
      telefono: '0912345678',
      direccion: 'Calle Falsa 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').send(clienteEmailInvalido);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El email no tiene un formato válido');
  });

  // EDGE CASE: Actualizar cliente que no existe
  test('PUT /api/clientes/:id debería retornar 404 si el cliente no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app)
      .put(`/api/clientes/${idInexistente}`)
      .send({ telefono: '0999999999' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Cliente no encontrado');
  });

  // EDGE CASE: Eliminar cliente que no existe
  test('DELETE /api/clientes/:id debería retornar 404 si el cliente no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app).delete(`/api/clientes/${idInexistente}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Cliente no encontrado');
  });

  // INTEGRIDAD DE DATOS: Actualización parcial
  test('PUT /api/clientes/:id debería permitir actualización parcial de campos', async () => {
    const cliente = {
      nombre: 'Sofía Martínez',
      email: 'sofia.martinez@email.com',
      telefono: '0923456789',
      direccion: 'Av. Central 321',
      ciudad: 'Loja'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`)
      .send({ ciudad: 'Ambato' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.ciudad).toBe('Ambato');
    expect(actualizado.body.nombre).toBe('Sofía Martínez');
    expect(actualizado.body.email).toBe('sofia.martinez@email.com');
  });

  // VALIDACIÓN: Campos con solo espacios
  test('POST /api/clientes debería rechazar campos vacíos o con solo espacios', async () => {
    const clienteInvalido = {
      nombre: '   ',
      email: 'test@email.com',
      telefono: '0912345678',
      direccion: 'Calle 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').send(clienteInvalido);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Los campos no pueden estar vacíos o contener solo espacios');
  });

  // COBERTURA: Actualizar email específicamente
  test('PUT /api/clientes/:id debería actualizar el email del cliente', async () => {
    const cliente = {
      nombre: 'Roberto García',
      email: 'roberto.garcia@email.com',
      telefono: '0912345678',
      direccion: 'Calle Norte 111',
      ciudad: 'Machala'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`)
      .send({ email: 'nuevo.email@email.com' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.email).toBe('nuevo.email@email.com');
    expect(actualizado.body.nombre).toBe('Roberto García');
  });

  // COBERTURA: Actualizar múltiples campos incluyendo ciudad
  test('PUT /api/clientes/:id debería actualizar múltiples campos incluyendo ciudad', async () => {
    const cliente = {
      nombre: 'Patricia Morales',
      email: 'patricia.morales@email.com',
      telefono: '0998877665',
      direccion: 'Av. Sur 222',
      ciudad: 'Esmeraldas'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`)
      .send({ 
        email: 'patricia.new@email.com',
        ciudad: 'Santo Domingo'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.email).toBe('patricia.new@email.com');
    expect(actualizado.body.ciudad).toBe('Santo Domingo');
    expect(actualizado.body.nombre).toBe('Patricia Morales');
  });

  // COBERTURA: Actualizar todos los campos individualmente
  test('PUT /api/clientes/:id debería actualizar nombre, dirección y ciudad', async () => {
    const cliente = {
      nombre: 'Luis Hernández',
      email: 'luis@email.com',
      telefono: '0987654321',
      direccion: 'Calle Vieja 100',
      ciudad: 'Ibarra'
    };

    const creado = await request(app).post('/api/clientes').send(cliente);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`)
      .send({ 
        nombre: 'Luis Fernando Hernández',
        direccion: 'Calle Nueva 200'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.nombre).toBe('Luis Fernando Hernández');
    expect(actualizado.body.direccion).toBe('Calle Nueva 200');
  });
});
