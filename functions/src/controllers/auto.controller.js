// Estructura de Auto:
// {
//    id
//    marca
//    modelo
//    año
//    color
//    numeroSerie
// }
const autos = [];

// GET - Obtener todos los autos
function getAllAutos(req, res) {
    res.json(autos);
}

// GET - Obtener auto por ID
function getAutoById(req, res) {
    const { id } = req.params;
    const auto = autos.find(a => a.id === Number(id));
    if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(auto);
}

// POST - Crear nuevo auto
function addNewAuto(req, res) {
    const { marca, modelo, año, color, numeroSerie } = req.body;

    // Validación: campos obligatorios
    if (!marca || !modelo || !año || !color || !numeroSerie) {
        return res.status(400).json({ message: 'Marca, Modelo, Año, Color y Número de Serie son requeridos' });
    }

    // Validación: año debe ser un número válido
    const yearNum = Number(año);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
        return res.status(400).json({ message: 'Año debe ser un número válido entre 1900 y ' + (new Date().getFullYear() + 1) });
    }

    // Validación: número de serie único
    if (autos.some(a => a.numeroSerie.toUpperCase() === String(numeroSerie).toUpperCase())) {
        return res.status(400).json({ message: 'El número de serie ya existe' });
    }

    // Crear nuevo auto
    const newAuto = {
        id: Date.now(),
        marca: String(marca).trim(),
        modelo: String(modelo).trim(),
        año: yearNum,
        color: String(color).trim(),
        numeroSerie: String(numeroSerie).trim().toUpperCase()
    };

    autos.push(newAuto);
    res.status(201).json({ 
        message: 'Auto creado exitosamente', 
        data: newAuto 
    });
}

// PUT - Actualizar auto existente
function updateAuto(req, res) {
    const { id } = req.params;
    const { marca, modelo, año, color, numeroSerie } = req.body;

    // Buscar auto por ID
    const i = autos.findIndex(a => a.id === Number(id));
    if (i === -1) return res.status(404).json({ message: 'Auto no encontrado' });

    // Validaciones si se proveen nuevos valores
    if (año !== undefined) {
        const yearNum = Number(año);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            return res.status(400).json({ message: 'Año debe ser un número válido entre 1900 y ' + (new Date().getFullYear() + 1) });
        }
        autos[i].año = yearNum;
    }

    // Validar número de serie único (si se actualiza)
    if (numeroSerie !== undefined) {
        const nuevoSerie = String(numeroSerie).trim().toUpperCase();
        if (autos.some((a, idx) => idx !== i && a.numeroSerie === nuevoSerie)) {
            return res.status(400).json({ message: 'El número de serie ya existe' });
        }
        autos[i].numeroSerie = nuevoSerie;
    }

    // Actualizar campos opcionales
    if (marca !== undefined) autos[i].marca = String(marca).trim();
    if (modelo !== undefined) autos[i].modelo = String(modelo).trim();
    if (color !== undefined) autos[i].color = String(color).trim();

    res.json({ 
        message: 'Auto actualizado exitosamente', 
        data: autos[i] 
    });
}

// DELETE - Eliminar auto
function deleteAuto(req, res) {
    const { id } = req.params;

    // Buscar y eliminar auto
    const index = autos.findIndex(a => a.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Auto no encontrado' });

    const deleted = autos.splice(index, 1);

    res.json({ 
        message: 'Auto eliminado exitosamente', 
        data: deleted[0] 
    });
}

// Helper de pruebas: limpia el arreglo de autos 
function _clearAutos() {
    autos.length = 0;
}

module.exports = { getAllAutos, getAutoById, addNewAuto, updateAuto, deleteAuto, _clearAutos };
