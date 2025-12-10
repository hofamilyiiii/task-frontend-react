const express = require('express');
const router = express.Router();
const { rooms, bookings } = require('../data');

// Helper: check if date ranges overlap
function datesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

// GET /api/rooms - Returns all rooms
// GET /api/rooms?isAvailable=true&checkIn=2026-03-01&checkOut=2026-03-05 - Returns available rooms
router.get('/', (req, res) => {
  const { isAvailable, checkIn, checkOut } = req.query;

  // If not filtering by availability, return all rooms
  if (isAvailable !== 'true') {
    return res.json(rooms);
  }

  // Filtering by availability - validate dates
  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'checkIn and checkOut are required when isAvailable=true' });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({ error: 'checkOut must be after checkIn' });
  }

  // Find rooms that don't have conflicting bookings
  const bookedRoomIds = new Set(
    bookings
      .filter(b => datesOverlap(new Date(b.checkIn), new Date(b.checkOut), checkInDate, checkOutDate))
      .map(b => b.roomId)
  );

  const availableRooms = rooms.filter(r => !bookedRoomIds.has(r.id));
  res.json(availableRooms);
});

// GET /api/rooms/:id - Returns single room
router.get('/:id', (req, res) => {
  const room = rooms.find(r => r.id === parseInt(req.params.id));
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// GET /api/rooms/:id/availability?checkIn=2026-03-01&checkOut=2026-03-05
// Check if specific room is available
router.get('/:id/availability', (req, res) => {
  const roomId = parseInt(req.params.id);
  const { checkIn, checkOut } = req.query;

  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'checkIn and checkOut are required' });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({ error: 'checkOut must be after checkIn' });
  }

  // Find conflicting bookings
  const conflicts = bookings
    .filter(b => b.roomId === roomId && datesOverlap(new Date(b.checkIn), new Date(b.checkOut), checkInDate, checkOutDate))
    .map(b => ({ checkIn: b.checkIn, checkOut: b.checkOut }));

  res.json({
    available: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
  });
});

module.exports = router;
