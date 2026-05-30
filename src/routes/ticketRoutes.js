const express = require('express');
const {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  validateTicket,
  validateTicketUpdate,
  validateIdParam,
} = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/', listTickets);
router.get('/:id', validateIdParam, getTicket);
router.post('/', authenticateToken, validateTicket, createTicket);
router.put('/:id', authenticateToken, validateIdParam, validateTicketUpdate, updateTicket);
router.patch('/:id', authenticateToken, validateIdParam, validateTicketUpdate, updateTicket);
router.delete('/:id', authenticateToken, validateIdParam, deleteTicket);

module.exports = router;
