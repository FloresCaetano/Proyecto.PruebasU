const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Credenciales predefinidas
const ADMIN_USER = {
    id: '1',
    email: 'admin@consecionaria.com',
    password: 'consesionariachida',
    nombre: 'Administrador'
};

// Genera token JWT para el usuario
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Login de usuario
function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email y contraseña son requeridos' });
    }

    if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
        return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    const token = generateToken(ADMIN_USER);
    res.json({
        msg: 'Login exitoso',
        token,
        user: { id: ADMIN_USER.id, email: ADMIN_USER.email, nombre: ADMIN_USER.nombre }
    });
}

// Obtener perfil de usuario autenticado
function getProfile(req, res) {
    res.json({
        id: req.userId,
        email: req.userEmail,
        nombre: ADMIN_USER.nombre
    });
}

module.exports = { login, getProfile };
