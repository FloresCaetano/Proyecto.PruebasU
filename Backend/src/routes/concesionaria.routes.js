const express = require('express');
const { 
    getAllConcesionarias,
    getConcesionariaById, 
    addNewConcesionaria, 
    updateConcesionaria, 
    deleteConcesionaria 
} = require('../controllers/concesionaria.controller');

const router = express.Router();

// Ruta GET para obtener todas las concesionarias
router.get('/', getAllConcesionarias);

// Ruta GET para obtener una concesionaria por ID
router.get('/:id', getConcesionariaById);

// Ruta POST para crear una nueva concesionaria
router.post('/', addNewConcesionaria);

// Ruta PUT para modificar una concesionaria mediante su id
router.put('/:id', updateConcesionaria);

// Ruta DELETE para eliminar una concesionaria mediante su id
router.delete('/:id', deleteConcesionaria);

module.exports = router;
