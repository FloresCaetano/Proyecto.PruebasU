// {
//    id
//    marca
//    modelo
//    año
//    color
//    numeroSerie
// }
const autos = [];

// GET
function getAllAutos(req, res) {
    res.json(autos);
}

// POST
function addNewAuto(req, res) {
    const { marca, modelo, año, color, numeroSerie } = req.body;

    // Validación básica de entrada 
    if (!marca || !modelo || !año || !color || !numeroSerie) {
        return res.status(400).json({ message: 'Marca, Modelo, Año, Color y Número de Serie son requeridos' });
    }

    // Creamos un objeto auto 
    const newAuto = {
        id: Date.now(), // ID usando Date.now()
        marca,
        modelo,
        año,
        color,
        numeroSerie
    };

    // Lo añadimos al arreglo de autos
    autos.push(newAuto);

    // Respondemos con el auto creado
    res.status(201).json(newAuto);
}

// PUT
function updateAuto(req, res) {
    const { id } = req.params;
    const { marca, modelo, año, color, numeroSerie } = req.body;

    // comparar usando Number(id) 
    const i = autos.findIndex(a => a.id === Number(id));
    if (i === -1) return res.status(404).json({ message: 'Auto no encontrado' });

    if (marca !== undefined) autos[i].marca = marca;
    if (modelo !== undefined) autos[i].modelo = modelo;
    if (año !== undefined) autos[i].año = año;
    if (color !== undefined) autos[i].color = color;
    if (numeroSerie !== undefined) autos[i].numeroSerie = numeroSerie;

    res.json(autos[i]);
}

// DELETE
function deleteAuto(req, res) {
    const { id } = req.params;

    // comparar usando Number(id) 
    const index = autos.findIndex(a => a.id === Number(id));
    if (index === -1) return res.status(404).json({ message: 'Auto no encontrado' }); 
    //404: Auto no encontrado

    const deleted = autos.splice(index, 1);

    res.json(deleted[0]);
}

// Helper de pruebas: limpia el arreglo de autos 
function _clearAutos() {
    autos.length = 0;
}

module.exports = { getAllAutos, addNewAuto, updateAuto, deleteAuto, _clearAutos };
