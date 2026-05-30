const {
  allowedCategories,
  allowedImpacto,
  allowedUrgencia,
  allowedEstados,
} = require('../services/ticketService');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateTicket(req, res, next) {
  const {
    nombreSolicitante,
    correo,
    categoria,
    descripcion,
    impacto,
    urgencia,
    tiempoEstimado,
  } = req.body;
  const errors = [];

  if (!nombreSolicitante) errors.push('Nombre del solicitante es obligatorio');
  if (!correo) {
    errors.push('Correo es obligatorio');
  } else if (!emailPattern.test(correo)) {
    errors.push('Formato de correo inválido');
  }
  if (!categoria) {
    errors.push('Categoría es obligatoria');
  } else if (!allowedCategories.includes(String(categoria).toLowerCase())) {
    errors.push('Categoría inválida');
  }
  if (!descripcion) errors.push('Descripción es obligatoria');
  if (!impacto) {
    errors.push('Impacto es obligatorio');
  } else if (!allowedImpacto.includes(String(impacto).toLowerCase())) {
    errors.push('Impacto inválido');
  }
  if (!urgencia) {
    errors.push('Urgencia es obligatoria');
  } else if (!allowedUrgencia.includes(String(urgencia).toLowerCase())) {
    errors.push('Urgencia inválida');
  }
  if (tiempoEstimado === undefined || tiempoEstimado === null || tiempoEstimado === '') {
    errors.push('Tiempo estimado es obligatorio');
  } else if (Number.isNaN(Number(tiempoEstimado)) || Number(tiempoEstimado) < 0) {
    errors.push('Tiempo estimado inválido');
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
}

function validateTicketUpdate(req, res, next) {
  const changes = req.body;
  const errors = [];

  if (!changes || Object.keys(changes).length === 0) {
    return res.status(400).json({ errors: ['No hay campos para actualizar'] });
  }

  if (changes.correo !== undefined && !emailPattern.test(changes.correo)) {
    errors.push('Formato de correo inválido');
  }
  if (changes.categoria !== undefined && !allowedCategories.includes(String(changes.categoria).toLowerCase())) {
    errors.push('Categoría inválida');
  }
  if (changes.impacto !== undefined && !allowedImpacto.includes(String(changes.impacto).toLowerCase())) {
    errors.push('Impacto inválido');
  }
  if (changes.urgencia !== undefined && !allowedUrgencia.includes(String(changes.urgencia).toLowerCase())) {
    errors.push('Urgencia inválida');
  }
  if (changes.estado !== undefined && !allowedEstados.includes(String(changes.estado).toLowerCase())) {
    errors.push('Estado inválido');
  }
  if (
    changes.tiempoEstimado !== undefined &&
    (Number.isNaN(Number(changes.tiempoEstimado)) || Number(changes.tiempoEstimado) < 0)
  ) {
    errors.push('Tiempo estimado inválido');
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
}

function validateIdParam(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: 'ID de ticket requerido' });
  }
  next();
}

module.exports = {
  validateTicket,
  validateTicketUpdate,
  validateIdParam,
};
