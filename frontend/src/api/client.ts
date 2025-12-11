import { Room, Booking, AvailabilityResponse, CreateBookingRequest } from '../types';
import { RoomSchema, BookingSchema, AvailabilityResponseSchema } from '../schemas';
import { z } from 'zod';

export const BASE = 'http://localhost:3000/';
export const API_BASE = 'http://localhost:3000/api';

export async function fetchRooms(): Promise<Room[]> {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  const data = await res.json();
  return z.array(RoomSchema).parse(data);
}

export async function fetchRoom(id: number): Promise<Room> {
  const res = await fetch(`${API_BASE}/rooms/${id}`);
  if (!res.ok) throw new Error('Room not found');
  const data = await res.json();
  return RoomSchema.parse(data);
}

export async function checkAvailability(
  roomId: number,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ checkIn, checkOut });
  const res = await fetch(`${API_BASE}/rooms/${roomId}/availability?${params}`);
  if (!res.ok) throw new Error('Failed to check availability');
  const data = await res.json();
  return AvailabilityResponseSchema.parse(data);
}

export async function createBooking(
  booking: CreateBookingRequest
): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (res.status === 409) {
    throw new Error('Room not available for selected dates');
  }
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create booking');
  }
  const data = await res.json();
  return BookingSchema.parse(data);
}
