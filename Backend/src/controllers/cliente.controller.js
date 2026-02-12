const { Cliente } = require('../models');

async function getAllClientes(req, res) {
    try {
        const clientes = await Cliente.find();
        res.json({ message: 'Clientes obtenidos exitosamente', clientes });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function getClienteById(req, res) {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findById(id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.json({ message: 'Cliente obtenido exitosamente', cliente });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function addNewCliente(req, res) {
    try {
        const { nombre, email, telefono, direccion, ciudad } = req.body;

        const newCliente = new Cliente({
            nombre,
            email,
            telefono,
            direccion,
            ciudad
        });

        const savedCliente = await newCliente.save();
        res.status(201).json({ message: 'Cliente agregado exitosamente', cliente: savedCliente });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function updateCliente(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCliente = await Cliente.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        res.json({ message: 'Cliente actualizado exitosamente', cliente: updatedCliente });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function deleteCliente(req, res) {
    try {
        const { id } = req.params;
        const deletedCliente = await Cliente.findByIdAndDelete(id);

        if (!deletedCliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        res.json({ message: 'Cliente eliminado exitosamente', cliente: deletedCliente });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Helper de pruebas
/* istanbul ignore next */
async function _clearClientes() {
    try {
        await Cliente.deleteMany({});
    } catch (error) {
        console.error('Error clearing clientes:', error);
    }
}

module.exports = { getAllClientes, addNewCliente, updateCliente, deleteCliente, getClienteById, _clearClientes };
