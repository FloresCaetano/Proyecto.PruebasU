const autos = [];
const MAX_YEAR = new Date().getFullYear() + 1;

function validateYear(año) {
    const yearNum = Number(año);
    return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= MAX_YEAR ? yearNum : null;
}

function isSerieUnique(serie, excludeIndex = -1) {
    return !autos.some((a, idx) => idx !== excludeIndex && a.numeroSerie === serie.toUpperCase());
}

function getAllAutos(req, res) {
    res.json(autos);
}

function getAutoById(req, res) {
    const { id } = req.params;
    const auto = autos.find(a => a.id === Number(id));
    if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(auto);
}

function addNewAuto(req, res) {
    const { marca, modelo, año, color, numeroSerie } = req.body;
    if (!marca || !modelo || !año || !color || !numeroSerie) {
        return res.status(400).json({ message: 'Marca, Modelo, Año, Color y Número de Serie son requeridos' });
    }
    const yearNum = validateYear(año);
    if (!yearNum) return res.status(400).json({ message: 'Año debe ser un número válido entre 1900 y ' + MAX_YEAR });
    if (!isSerieUnique(numeroSerie)) return res.status(400).json({ message: 'El número de serie ya existe' });

    const newAuto = {
        id: Date.now(), marca: String(marca).trim(), modelo: String(modelo).trim(),
        año: yearNum, color: String(color).trim(), numeroSerie: String(numeroSerie).trim().toUpperCase()
    };
    autos.push(newAuto);
    res.status(201).json({ message: 'Auto creado exitosamente', data: newAuto });
}

function updateAuto(req, res) {
    const { id } = req.params;
    const { marca, modelo, año, color, numeroSerie } = req.body;
    const i = autos.findIndex(a => a.id === Number(id));
    if (i === -1) return res.status(404).json({ message: 'Auto no encontrado' });

    if (año !== undefined) {
        const yearNum = validateYear(año);
        if (!yearNum) return res.status(400).json({ message: 'Año debe ser un número válido entre 1900 y ' + MAX_YEAR });
        autos[i].año = yearNum;
    }
    if (numeroSerie !== undefined) {
        if (!isSerieUnique(numeroSerie, i)) return res.status(400).json({ message: 'El número de serie ya existe' });
        autos[i].numeroSerie = String(numeroSerie).trim().toUpperCase();
    }
    if (marca !== undefined) autos[i].marca = String(marca).trim();
    if (modelo !== undefined) autos[i].modelo = String(modelo).trim();
    if (color !== undefined) autos[i].color = String(color).trim();
    res.json({ message: 'Auto actualizado exitosamente', data: autos[i] });
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
/* istanbul ignore next */
function _clearAutos() {
    autos.length = 0;
}

module.exports = { getAllAutos, getAutoById, addNewAuto, updateAuto, deleteAuto, _clearAutos };
