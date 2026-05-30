const { authenticate } = require('../services/authService');

async function login(req, res, next) {
  try {
    const token = await authenticate(req.body);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
