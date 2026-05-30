const path = require('path');
const { readJsonFile } = require('../data/jsonFileStore');

const usersPath = path.join(__dirname, '../data/users.json');
const activeTokens = new Map();
const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hora

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function generateToken() {
  return `${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

async function authenticate(credentials) {
  if (!credentials || !credentials.username || !credentials.password) {
    throw createError(400, 'Usuario y contraseña son requeridos');
  }

  const users = await readJsonFile(usersPath);
  const user = users.find(
    (item) => item.username === credentials.username && item.password === credentials.password
  );

  if (!user) {
    throw createError(401, 'Credenciales inválidas');
  }

  const token = generateToken();
  activeTokens.set(token, {
    username: user.username,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

  return token;
}

function verifyToken(token) {
  const session = activeTokens.get(token);
  if (!session) {
    throw createError(401, 'Token inválido o no autorizado');
  }

  if (session.expiresAt < Date.now()) {
    activeTokens.delete(token);
    throw createError(401, 'Token expirado');
  }

  return { username: session.username };
}

module.exports = {
  authenticate,
  verifyToken,
};
