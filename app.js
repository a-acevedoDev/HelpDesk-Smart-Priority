const express = require('express');
const path = require('path');

const authRoutes = require('./src/routes/authRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', authRoutes);
app.use('/tickets', ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HelpDesk Smart Priority ejecutándose en http://localhost:${PORT}`);
});
