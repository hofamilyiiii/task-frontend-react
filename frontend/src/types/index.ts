export interface Room {
  id: number;
  name: string;
  category: 'Single' | 'Double' | 'Suite';
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
}

export interface Booking {
  id: number;
  roomId: number;
  customerName: string;
  customerEmail: string;
  checkIn: string;  // ISO date string
  checkOut: string; // ISO date string
  createdAt: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflicts?: { checkIn: string; checkOut: string }[];
}

export interface CreateBookingRequest {
  roomId: number;
  customerName: string;
  customerEmail: string;
  checkIn: string;
  checkOut: string;
}
