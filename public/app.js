const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const dashboard = document.getElementById('dashboard');
const logoutButton = document.getElementById('logout-button');
const ticketForm = document.getElementById('ticket-form');
const ticketMessage = document.getElementById('ticket-message');
const ticketsList = document.getElementById('tickets-list');
const ticketTemplate = document.getElementById('ticket-template');

const tokenKey = 'helpdeskToken';

function getToken() {
  return localStorage.getItem(tokenKey);
}

function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

function removeToken() {
  localStorage.removeItem(tokenKey);
}

function showDashboard(isVisible) {
  document.getElementById('login-section').classList.toggle('hidden', isVisible);
  dashboard.classList.toggle('hidden', !isVisible);
}

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
  if (message) {
    setTimeout(() => {
      element.textContent = '';
      element.classList.remove('error');
    }, 4000);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(loginMessage, data.error || data.errors?.join(', '), true);
      return;
    }

    setToken(data.token);
    showDashboard(true);
    loadTickets();
    showMessage(loginMessage, 'Sesión iniciada con éxito');
  } catch (error) {
    showMessage(loginMessage, 'Error en el servidor', true);
  }
}

async function loadTickets() {
  ticketsList.innerHTML = ''; 
  try {
    const response = await fetch('/tickets');
    const tickets = await response.json();
    if (!Array.isArray(tickets)) {
      ticketsList.textContent = 'No se pudieron cargar los tickets';
      return;
    }

    if (tickets.length === 0) {
      ticketsList.textContent = 'No hay tickets registrados';
      return;
    }

    tickets.forEach((ticket) => {
      const element = ticketTemplate.content.cloneNode(true);
      element.querySelector('.ticket-title').textContent = ticket.descripcion;
      element.querySelector('.ticket-id').textContent = ticket.id;
      element.querySelector('.ticket-name').textContent = ticket.nombreSolicitante;
      element.querySelector('.ticket-email').textContent = ticket.correo;
      element.querySelector('.ticket-category').textContent = ticket.categoria;
      element.querySelector('.ticket-impact').textContent = ticket.impacto;
      element.querySelector('.ticket-urgency').textContent = ticket.urgencia;
      element.querySelector('.ticket-time').textContent = ticket.tiempoEstimado;
      element.querySelector('.ticket-status').textContent = ticket.estado;
      element.querySelector('.ticket-priority').textContent = ticket.prioridad;
      element.querySelector('.ticket-created').textContent = new Date(ticket.fechaCreacion).toLocaleString();

      const viewButton = element.querySelector('.view-button');
      const updateButton = element.querySelector('.update-button');
      const deleteButton = element.querySelector('.delete-button');

      viewButton.addEventListener('click', () => {
        alert(`Ticket ${ticket.id}\n\nSolicitante: ${ticket.nombreSolicitante}\nCorreo: ${ticket.correo}\nCategoría: ${ticket.categoria}\nImpacto: ${ticket.impacto}\nUrgencia: ${ticket.urgencia}\nTiempo estimado: ${ticket.tiempoEstimado} horas\nEstado: ${ticket.estado}\nPrioridad: ${ticket.prioridad}`);
      });

      updateButton.addEventListener('click', () => handleUpdateTicket(ticket));
      deleteButton.addEventListener('click', () => handleDeleteTicket(ticket.id));

      ticketsList.appendChild(element);
    });
  } catch (error) {
    ticketsList.textContent = 'Error al cargar los tickets';
  }
}

async function handleCreateTicket(event) {
  event.preventDefault();
  const ticketPayload = {
    nombreSolicitante: document.getElementById('nombreSolicitante').value,
    correo: document.getElementById('correo').value,
    categoria: document.getElementById('categoria').value,
    impacto: document.getElementById('impacto').value,
    urgencia: document.getElementById('urgencia').value,
    tiempoEstimado: document.getElementById('tiempoEstimado').value,
    descripcion: document.getElementById('descripcion').value,
  };

  const token = getToken();
  if (!token) {
    showMessage(ticketMessage, 'Debe iniciar sesión para crear tickets', true);
    return;
  }

  try {
    const response = await fetch('/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketPayload),
    });
    const data = await response.json();
    if (!response.ok) {
      showMessage(ticketMessage, data.error || data.errors?.join(', '), true);
      return;
    }
    showMessage(ticketMessage, 'Ticket creado correctamente');
    ticketForm.reset();
    loadTickets();
  } catch (error) {
    showMessage(ticketMessage, 'Error al crear el ticket', true);
  }
}

async function handleDeleteTicket(id) {
  if (!confirm('¿Eliminar este ticket?')) {
    return;
  }
  const token = getToken();
  try {
    const response = await fetch(`/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      showMessage(ticketMessage, data.error || data.errors?.join(', '), true);
      return;
    }
    showMessage(ticketMessage, data.message);
    loadTickets();
  } catch (error) {
    showMessage(ticketMessage, 'Error al eliminar el ticket', true);
  }
}

async function handleUpdateTicket(ticket) {
  const token = getToken();
  if (!token) {
    showMessage(ticketMessage, 'Debe iniciar sesión para actualizar', true);
    return;
  }

  const nextStatus = ticket.estado === 'pendiente' ? 'en proceso' : 'resuelto';
  try {
    const response = await fetch(`/tickets/${ticket.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nextStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      showMessage(ticketMessage, data.error || data.errors?.join(', '), true);
      return;
    }
    showMessage(ticketMessage, `Estado actualizado a ${data.estado}`);
    loadTickets();
  } catch (error) {
    showMessage(ticketMessage, 'Error al actualizar el ticket', true);
  }
}

function handleLogout() {
  removeToken();
  showDashboard(false);
}

loginForm.addEventListener('submit', handleLogin);
ticketForm.addEventListener('submit', handleCreateTicket);
logoutButton.addEventListener('click', handleLogout);

if (getToken()) {
  showDashboard(true);
  loadTickets();
}
