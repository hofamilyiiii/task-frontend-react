# Hotel Booking UI - Technical Exercise

Build a room booking interface using the provided API.

## Setup

### 1. Start the API server

```bash
cd api
npm install
npm start
```

Or with Docker:
```bash
cd api
docker build -t booking-api .
docker run -p 3000:3000 booking-api
```

API runs at http://localhost:3000

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Your Task

Build a room booking interface. Time: ~60-90 minutes.

### Core Features (implement what you can)

- Display rooms from the API
- Allow selecting check-in and check-out dates
- Show which rooms are available for selected dates
- Allow booking an available room

### Nice to Have

- Loading states while fetching
- Error handling (user-friendly messages)
- Form validation (dates, required fields)
- Visual feedback for availability status

## What's Provided

- **API client** - `src/api/client.ts` has all fetch functions ready
- **TypeScript types** - `src/types/index.ts` defines Room, Booking, etc.
- **TailwindCSS** - Configured and ready to use
- **App shell** - Basic layout in `App.tsx`

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/rooms | Get all rooms |
| GET | /api/rooms?isAvailable=true&checkIn=...&checkOut=... | Get available rooms for date range |
| GET | /api/rooms/{id} | Get room by ID |
| GET | /api/rooms/{id}/availability?checkIn=...&checkOut=... | Check room availability |
| POST | /api/bookings | Create a booking |

### POST /api/bookings Body

```json
{
  "roomId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "checkIn": "2026-03-01",
  "checkOut": "2026-03-05"
}
```

### Response Codes

- `200` - Success
- `201` - Booking created
- `400` - Invalid input
- `404` - Room not found
- `409` - Room not available (conflict)
