const rooms = [
  { id: 1, name: "Ocean View Suite", category: "Suite", pricePerNight: 450, capacity: 2, imageUrl: "/images/suite-1.svg" },
  { id: 2, name: "Garden Room", category: "Double", pricePerNight: 200, capacity: 2, imageUrl: "/images/double-1.svg" },
  { id: 3, name: "City Single", category: "Single", pricePerNight: 120, capacity: 1, imageUrl: "/images/single-1.svg" },
  { id: 4, name: "Family Suite", category: "Suite", pricePerNight: 550, capacity: 4, imageUrl: "/images/suite-2.svg" },
  { id: 5, name: "Budget Double", category: "Double", pricePerNight: 150, capacity: 2, imageUrl: "/images/double-2.svg" },
  { id: 6, name: "Penthouse", category: "Suite", pricePerNight: 800, capacity: 2, imageUrl: "/images/suite-3.svg" },
];

// Some existing bookings (dates relative to "now" being early March 2026)
const bookings = [
  { id: 1, roomId: 1, customerName: "Alice Smith", customerEmail: "alice@example.com", checkIn: "2026-03-10", checkOut: "2026-03-15", createdAt: "2026-02-20T10:00:00Z" },
  { id: 2, roomId: 2, customerName: "Bob Jones", customerEmail: "bob@example.com", checkIn: "2026-03-05", checkOut: "2026-03-08", createdAt: "2026-02-18T14:30:00Z" },
  { id: 3, roomId: 3, customerName: "Carol White", customerEmail: "carol@example.com", checkIn: "2026-03-12", checkOut: "2026-03-14", createdAt: "2026-02-22T09:15:00Z" },
];

let nextBookingId = 4;

module.exports = {
  rooms,
  bookings,
  getNextBookingId: () => nextBookingId++,
};
