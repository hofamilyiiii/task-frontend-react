const express = require('express');
const path = require('path');
const cors = require('cors');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
