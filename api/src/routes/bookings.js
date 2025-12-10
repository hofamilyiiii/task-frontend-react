const express = require('express');
const router = express.Router();
const { rooms, bookings, getNextBookingId } = require('../data');

// POST /api/bookings - Create a booking
router.post('/', (req, res) => {
  const { roomId, customerName, customerEmail, checkIn, checkOut } = req.body;

  // Validate required fields
  const errors = [];
  if (!roomId) errors.push('roomId is required');
  if (!customerName) errors.push('customerName is required');
  if (!customerEmail) errors.push('customerEmail is required');
  if (!checkIn) errors.push('checkIn is required');
  if (!checkOut) errors.push('checkOut is required');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid input', details: errors });
  }

  // Validate room exists
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(400).json({ error: 'Room not found' });
  }

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({ error: 'checkOut must be after checkIn' });
  }

  // Create booking
  const newBooking = {
    id: getNextBookingId(),
    roomId,
    customerName,
    customerEmail,
    checkIn,
    checkOut,
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);

  res.status(201).json(newBooking);
});

module.exports = router;
