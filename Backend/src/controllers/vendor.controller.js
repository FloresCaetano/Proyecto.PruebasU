const vendedores = [];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{7,15}$/;

// POST: Crear vendedor
function createVendor(req, res) {
    const { name, email, telefono, comision, especialidad } = req.body;
    if (!name || !email || !telefono || comision === undefined)
        return res.status(400).json({ message: 'Nombre, Email, Teléfono y Comisión son requeridos' });

    if (!emailRegex.test(email))
        return res.status(400).json({ message: 'El email no es válido' });

    if (!phoneRegex.test(telefono))
        return res.status(400).json({ message: 'El teléfono debe contener solo números y tener entre 7 y 15 dígitos' });

    if (isNaN(comision) || comision < 0 || comision > 100)
        return res.status(400).json({ message: 'La comisión debe ser un número entre 0 y 100' });

    if (vendedores.some(v => v.email === email))
        return res.status(409).json({ message: 'El email ya está registrado' });

    const newVendedor = { id: Date.now(), name, email, telefono, comision, especialidad: especialidad || 'General' };
    vendedores.push(newVendedor);
    return res.status(201).json(newVendedor);
}

// GET: obtener todos los vendedores
function getAllVendors(req, res) {
    res.json(vendedores);
}

// GET: obtener un vendedor por ID
function getVendorById(req, res) {
    const id = Number(req.params.id);
    const vendedor = vendedores.find(v => v.id === id);

    if (!vendedor)
        return res.status(404).json({ message: 'Vendedor no encontrado' });

    res.json(vendedor);
}

// PUT: actualizar vendedor
function updateVendor(req, res) {
    const id = parseInt(req.params.id);
    const { name, email, telefono, comision, especialidad } = req.body;

    const index = vendedores.findIndex(v => v.id === id);
    if (index === -1) 
        return res.status(404).json({ message: 'Vendedor no encontrado' });

    const vendedor = vendedores[index];

    if (email !== undefined && !emailRegex.test(email)) 
        return res.status(400).json({ message: 'El email no es válido' });

    if (telefono !== undefined && !phoneRegex.test(telefono))
        return res.status(400).json({message: 'El teléfono debe contener solo números y tener entre 7 y 15 dígitos',});

    if (comision !== undefined && (isNaN(comision) || comision < 0 || comision > 100))
        return res.status(400).json({message: 'La comisión debe ser un número entre 0 y 100',});

    if (email !== undefined && vendedores.some(v => v.email === email && v.id !== id)) 
        return res.status(409).json({ message: 'El email ya está registrado por otro vendedor' });

    vendedores[index] = {...vendedor, name: name ?? vendedor.name, email: email ?? vendedor.email, telefono: telefono ?? vendedor.telefono, comision: comision ?? vendedor.comision, 
        especialidad: especialidad ?? vendedor.especialidad,
    };

    res.json(vendedores[index]);
}

// DELETE: eliminar vendedor
function deleteVendor(req, res) {
    const id = parseInt(req.params.id);
    const index = vendedores.findIndex(v => v.id === id);

    if (index === -1) 
        return res.status(404).json({ message: 'Vendedor no encontrado' });
    

    vendedores.splice(index, 1);
    res.status(200).json({ message: 'Vendedor eliminado exitosamente' });
}

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
};
