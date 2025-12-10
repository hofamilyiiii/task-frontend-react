import { Room, Booking, AvailabilityResponse, CreateBookingRequest } from '../types';

export const BASE = 'http://localhost:3000/';
export const API_BASE = 'http://localhost:3000/api';

export async function fetchRooms(): Promise<Room[]> {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function fetchRoom(id: number): Promise<Room> {
  const res = await fetch(`${API_BASE}/rooms/${id}`);
  if (!res.ok) throw new Error('Room not found');
  return res.json();
}

export async function checkAvailability(
  roomId: number,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ checkIn, checkOut });
  const res = await fetch(`${API_BASE}/rooms/${roomId}/availability?${params}`);
  if (!res.ok) throw new Error('Failed to check availability');
  return res.json();
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
  return res.json();
}
