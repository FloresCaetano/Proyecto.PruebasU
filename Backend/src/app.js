const express = require('express');
let corsPkg;
const autoRoutes = require('./routes/auto.routes');
const vendorRoutes = require('./routes/vendor.route');
const clienteRoutes = require('./routes/cliente.routes');

const app = express();

// middlewares
// Si corsPkg existe, usamos la librería; si no, aplicamos un middleware que añade cabeceras CORS básicas.
if (corsPkg) {
    app.use(corsPkg());
} else {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        // Responder OPTIONS inmediatamente
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        next();
    });
}

app.use(express.json());

// Rutas Base de cada modelo
app.use('/api/autos', autoRoutes);

app.use('/api/vendedores', vendorRoutes) ;

app.use('/api/clientes', clienteRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// manejo simple de 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado' });
});

// iniciar servidor si se ejecuta con `node app.js`
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Servidor backend escuchando en http://localhost:${port}`);
    });
}

module.exports = app;