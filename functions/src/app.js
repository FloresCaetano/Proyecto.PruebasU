const express = require('express');
const autoRoutes = require('./routes/auto.routes');
const vendorRoutes = require('./routes/vendor.route');
const clienteRoutes = require('./routes/cliente.routes');
const concesionariaRoutes = require('./routes/concesionaria.routes');
const authRoutes = require('./routes/auth.routes');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

// middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // Responder OPTIONS inmediatamente
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());

// Agregada ruta raíz para estado / pruebas
app.get('/', (req, res) => {
    res.json({ message: 'API Concesionarias - Backend activo' });
});

// Rutas de autenticación (sin protección)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Rutas Base de cada modelo (con y sin prefijo /api para compatibilidad)
// Protegidas con autenticación
app.use('/api/autos', authMiddleware, autoRoutes);
app.use('/autos', authMiddleware, autoRoutes);
app.use('/api/vendedores', authMiddleware, vendorRoutes);
app.use('/vendedores', authMiddleware, vendorRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);
app.use('/clientes', authMiddleware, clienteRoutes);
app.use('/api/concesionarias', authMiddleware, concesionariaRoutes);
app.use('/concesionarias', authMiddleware, concesionariaRoutes);

// manejo simple de 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado' });
});

// iniciar servidor si se ejecuta con `node app.js`
/* eslint-disable no-undef, no-console */
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Servidor backend escuchando en http://localhost:${port}`);
    });
}
/* eslint-enable no-undef, no-console */

module.exports = app;