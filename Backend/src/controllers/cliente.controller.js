const clientes = [];

function getAllClientes(req, res) {
    res.json(clientes);
}

function addNewCliente(req, res) {
    const { nombre, email, telefono, direccion, ciudad } = req.body;
    
    // Validación de campos requeridos
    if (!nombre || !email || !telefono || !direccion || !ciudad) {
        return res.status(400).json({ message: 'Nombre, Email, Teléfono, Dirección y Ciudad son requeridos' });
    }
    
    // Validación de campos vacíos (solo espacios)
    if (nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' || 
        direccion.trim() === '' || ciudad.trim() === '') {
        return res.status(400).json({ message: 'Los campos no pueden estar vacíos o contener solo espacios' });
    }
    
    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El email no tiene un formato válido' });
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
    res.status(201).json(newCliente);
}

function updateCliente(req, res) {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, ciudad } = req.body;
    const i = clientes.findIndex(c => c.id == id);
    if (i === -1) return res.status(404).json({ message: 'Cliente no encontrado' });
    if (nombre !== undefined) clientes[i].nombre = nombre;
    if (email !== undefined) clientes[i].email = email;
    if (telefono !== undefined) clientes[i].telefono = telefono;
    if (direccion !== undefined) clientes[i].direccion = direccion;
    if (ciudad !== undefined) clientes[i].ciudad = ciudad;
    res.json(clientes[i]);
}

function deleteCliente(req, res) {
    const { id } = req.params;
    const index = clientes.findIndex(c => c.id == id);
    if (index === -1) return res.status(404).json({ message: 'Cliente no encontrado' });
    const deleted = clientes.splice(index, 1);
    res.json(deleted[0]);
}

module.exports = { getAllClientes, addNewCliente, updateCliente, deleteCliente };
