const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu_jwt_secret_key_2025';

// Middleware que protege rutas usando JWT
function authMiddleware(req, res, next) {
  // Extrae el token del header Authorization
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: 'No autorizado' });

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch {
    return res.status(403).json({ msg: 'Token inválido' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
