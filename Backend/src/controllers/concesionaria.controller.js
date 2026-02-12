const { Concesionaria } = require('../models');

// GET - Obtener todas las concesionarias
async function getAllConcesionarias(req, res) {
    try {
        const concesionarias = await Concesionaria.find();
        res.json(concesionarias);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// POST - Crear una nueva concesionaria
async function addNewConcesionaria(req, res) {
    try {
        const { nombre, direccion, telefono, ciudad, gerente } = req.body;

        // Validar si el nombre ya existe
        const nombreExiste = await Concesionaria.findOne({ 
            nombre: { $regex: new RegExp(`^${nombre}$`, 'i') }
        });
        
        if (nombreExiste) {
            return res.status(400).json({ message: 'Ya existe una concesionaria con ese nombre' });
        }

        const newConcesionaria = new Concesionaria({
            nombre,
            direccion,
            telefono,
            ciudad,
            gerente
        });

        const savedConcesionaria = await newConcesionaria.save();
        res.status(201).json(savedConcesionaria);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// PUT - Actualizar una concesionaria existente
async function updateConcesionaria(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Si se está actualizando el nombre, validar que no exista
        if (updateData.nombre) {
            const nombreExiste = await Concesionaria.findOne({ 
                nombre: { $regex: new RegExp(`^${updateData.nombre}$`, 'i') },
                _id: { $ne: id }
            });
            
            if (nombreExiste) {
                return res.status(400).json({ message: 'Ya existe una concesionaria con ese nombre' });
            }
        }

        const updatedConcesionaria = await Concesionaria.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedConcesionaria) return res.status(404).json({ message: 'Concesionaria no encontrada' });

        res.json(updatedConcesionaria);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// DELETE - Eliminar una concesionaria
async function deleteConcesionaria(req, res) {
    try {
        const { id } = req.params;
        const deletedConcesionaria = await Concesionaria.findByIdAndDelete(id);

        if (!deletedConcesionaria) return res.status(404).json({ message: 'Concesionaria no encontrada' });

        res.json(deletedConcesionaria);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Helper de pruebas
/* istanbul ignore next */
async function _clearConcesionarias() {
    try {
        await Concesionaria.deleteMany({});
    } catch (error) {
        console.error('Error clearing concesionarias:', error);
    }
}

module.exports = { 
    getAllConcesionarias, 
    addNewConcesionaria, 
    updateConcesionaria, 
    deleteConcesionaria,
    _clearConcesionarias 
};
