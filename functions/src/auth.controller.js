const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Credenciales predefinidas
const ADMIN_USER = {
  id: '1',
  email: 'admin@consecionaria.com',
  password: 'consesionariachida',
  nombre: 'Administrador'
};

// Login de usuario
function login(req, res) {
  const { email, password } = req.body;

  // Validar campos obligatorios
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email y contraseña son requeridos' });
  }

  // Verificar credenciales
  if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
    return res.status(401).json({ msg: 'Credenciales inválidas' });
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: ADMIN_USER.id, email: ADMIN_USER.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    msg: 'Login exitoso',
    token,
    user: {
      id: ADMIN_USER.id,
      email: ADMIN_USER.email,
      nombre: ADMIN_USER.nombre
    }
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
