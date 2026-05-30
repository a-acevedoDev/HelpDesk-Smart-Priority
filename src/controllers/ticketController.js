const ticketService = require('../services/ticketService');

async function listTickets(req, res, next) {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}

async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function createTicket(req, res, next) {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function deleteTicket(req, res, next) {
  try {
    await ticketService.deleteTicket(req.params.id);
    res.status(200).json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
