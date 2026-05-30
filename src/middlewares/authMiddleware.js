const { verifyToken } = require('../services/authService');

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authorization.split(' ')[1];

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticateToken,
};
