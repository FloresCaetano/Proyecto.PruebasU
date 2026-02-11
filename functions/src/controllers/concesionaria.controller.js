// Modelo Concesionaria con 5 atributos:
// {
//    id
//    nombre
//    direccion
//    telefono
//    ciudad
//    gerente
// }

const concesionarias = [];

// GET - Obtener todas las concesionarias
function getAllConcesionarias(req, res) {
    res.json(concesionarias);
}

function validateConcesionariaData(data, concesionariaId = null) {
    const { nombre, direccion, telefono, ciudad, gerente } = data;

    if (!nombre || !direccion || !telefono || !ciudad || !gerente) {
        return 'Nombre, Dirección, Teléfono, Ciudad y Gerente son requeridos';
    }

    if (nombre.trim() === '' || direccion.trim() === '' || telefono.trim() === '' || 
        ciudad.trim() === '' || gerente.trim() === '') {
        return 'Los campos no pueden estar vacíos o contener solo espacios';
    }

    // Validar nombre duplicado
    const nombreExiste = concesionarias.find(c => 
        c.nombre.toLowerCase() === nombre.toLowerCase() && c.id != concesionariaId
    );
    if (nombreExiste) {
        return 'Ya existe una concesionaria con ese nombre';
    }

    return null;
}

// POST - Crear una nueva concesionaria
function addNewConcesionaria(req, res) {
    const { nombre, direccion, telefono, ciudad, gerente } = req.body;

    const error = validateConcesionariaData(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const newConcesionaria = {
        id: Date.now(),
        nombre,
        direccion,
        telefono,
        ciudad,
        gerente
    };

    concesionarias.push(newConcesionaria);
    res.status(201).json({message: 'Concesionaria agregada exitosamente', newConcesionaria});
}

// PUT - Actualizar una concesionaria existente
function updateConcesionaria(req, res) {
    const { id } = req.params;
    const { nombre, direccion, telefono, ciudad, gerente } = req.body;

    const i = concesionarias.findIndex(c => c.id == id);
    if (i === -1) return res.status(404).json({ message: 'Concesionaria no encontrada' });

    // Validar si se está actualizando el nombre
    if (nombre !== undefined) {
        const error = validateConcesionariaData({ nombre, direccion: direccion || concesionarias[i].direccion, telefono: telefono || concesionarias[i].telefono, ciudad: ciudad || concesionarias[i].ciudad, gerente: gerente || concesionarias[i].gerente }, id);
        if (error) {
            return res.status(400).json({ message: error });
        }
    }

    if (nombre !== undefined) concesionarias[i].nombre = nombre;
    if (direccion !== undefined) concesionarias[i].direccion = direccion;
    if (telefono !== undefined) concesionarias[i].telefono = telefono;
    if (ciudad !== undefined) concesionarias[i].ciudad = ciudad;
    if (gerente !== undefined) concesionarias[i].gerente = gerente;

    res.json({message: 'Concesionaria actualizada exitosamente', concesionaria: concesionarias[i]});
}

// DELETE - Eliminar una concesionaria
function deleteConcesionaria(req, res) {
    const { id } = req.params;
  
    const index = concesionarias.findIndex(c => c.id == id);
    if (index === -1) return res.status(404).json({ message: 'Concesionaria no encontrada' });

    const deleted = concesionarias.splice(index, 1);

    res.json(deleted[0]);
}

module.exports = { 
    getAllConcesionarias, 
    addNewConcesionaria, 
    updateConcesionaria, 
    deleteConcesionaria 
};
