const clientes = [];

function getAllClientes(req, res) {
    res.json({ message: 'Clientes obtenidos exitosamente', clientes });
}

function getClienteById(req, res) {
    const { id } = req.params;
    const cliente = clientes.find(c => c.id == id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente obtenido exitosamente', cliente });
}

function validateClienteData(data, clienteId = null) {
    const { nombre, email, telefono, direccion, ciudad } = data;

    if (!nombre || !email || !telefono || !direccion || !ciudad) {
        return 'Nombre, Email, Teléfono, Dirección y Ciudad son requeridos';
    }

    if (nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' ||
        direccion.trim() === '' || ciudad.trim() === '') {
        return 'Los campos no pueden estar vacíos o contener solo espacios';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'El email no tiene un formato válido';
    }

    // Validar email duplicado
    const emailExiste = clientes.find(c =>
        c.email.toLowerCase() === email.toLowerCase() && c.id != clienteId
    );
    if (emailExiste) {
        return 'El email ya está registrado';
    }

    return null;
}

function addNewCliente(req, res) {
    const { nombre, email, telefono, direccion, ciudad } = req.body;

    const error = validateClienteData(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const newCliente = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        direccion,
        ciudad
    };
    clientes.push(newCliente);
    res.status(201).json({ message: 'Cliente agregado exitosamente', cliente: newCliente });
}

function updateCliente(req, res) {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, ciudad } = req.body;
    const i = clientes.findIndex(c => c.id == id);
    if (i === -1) return res.status(404).json({ message: 'Cliente no encontrado' });

    // Validar si se está actualizando el email
    if (email !== undefined) {
        const error = validateClienteData({ nombre: nombre || clientes[i].nombre, email, telefono: telefono || clientes[i].telefono, direccion: direccion || clientes[i].direccion, ciudad: ciudad || clientes[i].ciudad }, id);
        if (error) {
            return res.status(400).json({ message: error });
        }
    }

    if (nombre !== undefined) clientes[i].nombre = nombre;
    if (email !== undefined) clientes[i].email = email;
    if (telefono !== undefined) clientes[i].telefono = telefono;
    if (direccion !== undefined) clientes[i].direccion = direccion;
    if (ciudad !== undefined) clientes[i].ciudad = ciudad;
    res.json({ message: 'Cliente actualizado exitosamente', cliente: clientes[i] });
}

function deleteCliente(req, res) {
    const { id } = req.params;
    const index = clientes.findIndex(c => c.id == id);
    if (index === -1) return res.status(404).json({ message: 'Cliente no encontrado' });
    const deleted = clientes.splice(index, 1);
    res.json({ message: 'Cliente eliminado exitosamente', cliente: deleted[0] });
}

module.exports = { getAllClientes, addNewCliente, updateCliente, deleteCliente, getClienteById };
