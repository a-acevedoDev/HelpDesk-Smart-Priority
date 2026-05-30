const ticketData = require('../data/ticketData');

const allowedCategories = ['hardware', 'software', 'red', 'cuenta', 'otro'];
const allowedImpacto = ['bajo', 'medio', 'alto'];
const allowedUrgencia = ['baja', 'media', 'alta'];
const allowedEstados = ['pendiente', 'en proceso', 'resuelto'];

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function calculatePriority(ticket) {
  const impactoScore = impactoValue(ticket.impacto);
  const urgenciaScore = urgenciaValue(ticket.urgencia);
  const bonusCategoria = ['red', 'cuenta'].includes(ticket.categoria) ? 1 : 0;
  const bonusTiempo = Number(ticket.tiempoEstimado) > 4 ? 1 : 0;

  const total = impactoScore + urgenciaScore + bonusCategoria + bonusTiempo;

  if (total <= 3) return 'Baja';
  if (total <= 5) return 'Media';
  if (total === 6) return 'Alta';
  return 'Crítica';
}

function impactoValue(value) {
  if (!allowedImpacto.includes(value)) {
    throw createError(400, 'Valor de impacto inválido');
  }
  return { bajo: 1, medio: 2, alto: 3 }[value];
}

function urgenciaValue(value) {
  if (!allowedUrgencia.includes(value)) {
    throw createError(400, 'Valor de urgencia inválido');
  }
  return { baja: 1, media: 2, alta: 3 }[value];
}

function normalizeTicket(ticket) {
  return {
    id: String(Date.now() + Math.floor(Math.random() * 900)),
    nombreSolicitante: String(ticket.nombreSolicitante).trim(),
    correo: String(ticket.correo).trim(),
    categoria: String(ticket.categoria).trim().toLowerCase(),
    descripcion: String(ticket.descripcion).trim(),
    impacto: String(ticket.impacto).trim().toLowerCase(),
    urgencia: String(ticket.urgencia).trim().toLowerCase(),
    tiempoEstimado: Number(ticket.tiempoEstimado),
    estado: ticket.estado ? String(ticket.estado).trim().toLowerCase() : 'pendiente',
    fechaCreacion: new Date().toISOString(),
  };
}

async function getAllTickets() {
  return await ticketData.getTickets();
}

async function getTicketById(id) {
  const tickets = await ticketData.getTickets();
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) {
    throw createError(404, 'Ticket no encontrado');
  }
  return ticket;
}

async function createTicket(ticketPayload) {
  const ticket = normalizeTicket(ticketPayload);
  ticket.prioridad = calculatePriority(ticket);

  const tickets = await ticketData.getTickets();
  tickets.push(ticket);
  await ticketData.saveTickets(tickets);
  return ticket;
}

async function updateTicket(id, updatePayload) {
  const tickets = await ticketData.getTickets();
  const index = tickets.findIndex((item) => item.id === id);

  if (index === -1) {
    throw createError(404, 'Ticket no encontrado');
  }

  const current = tickets[index];
  const updated = { ...current, ...sanitizeUpdate(current, updatePayload) };
  updated.prioridad = calculatePriority(updated);
  tickets[index] = updated;
  await ticketData.saveTickets(tickets);

  return updated;
}

function sanitizeUpdate(current, changes) {
  const result = { ...current };

  if (changes.nombreSolicitante !== undefined) result.nombreSolicitante = String(changes.nombreSolicitante).trim();
  if (changes.correo !== undefined) result.correo = String(changes.correo).trim();
  if (changes.categoria !== undefined) result.categoria = String(changes.categoria).trim().toLowerCase();
  if (changes.descripcion !== undefined) result.descripcion = String(changes.descripcion).trim();
  if (changes.impacto !== undefined) result.impacto = String(changes.impacto).trim().toLowerCase();
  if (changes.urgencia !== undefined) result.urgencia = String(changes.urgencia).trim().toLowerCase();
  if (changes.tiempoEstimado !== undefined) result.tiempoEstimado = Number(changes.tiempoEstimado);
  if (changes.estado !== undefined) result.estado = String(changes.estado).trim().toLowerCase();

  return result;
}

async function deleteTicket(id) {
  const tickets = await ticketData.getTickets();
  const index = tickets.findIndex((item) => item.id === id);
  if (index === -1) {
    throw createError(404, 'Ticket no encontrado');
  }
  tickets.splice(index, 1);
  await ticketData.saveTickets(tickets);
}

module.exports = {
  allowedCategories,
  allowedImpacto,
  allowedUrgencia,
  allowedEstados,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  calculatePriority,
};
