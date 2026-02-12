const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { Usuario } = require('../models');

// Genera token JWT para el usuario
function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Login de usuario
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario por email
        const user = await Usuario.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        res.json({
            msg: 'Login exitoso',
            token,
            user: { id: user._id, email: user.email, nombre: user.nombre }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
    }
}

// Obtener perfil de usuario autenticado
async function getProfile(req, res) {
    try {
        const user = await Usuario.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json({
            id: user._id,
            email: user.email,
            nombre: user.nombre
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
    }
}

// Crear usuario admin por defecto (solo para desarrollo)
async function createDefaultAdmin() {
    try {
        const adminExists = await Usuario.findOne({ email: 'admin@consecionaria.com' });
        if (!adminExists) {
            const admin = new Usuario({
                nombre: 'Administrador',
                email: 'admin@consecionaria.com',
                password: 'consesionariachida'
            });
            await admin.save();
            console.log('🔧 Usuario admin por defecto creado');
        }
    } catch (error) {
        console.error('Error creando usuario admin por defecto:', error.message);
    }
}

module.exports = { login, getProfile, createDefaultAdmin };
