import { z } from 'zod';

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.enum(['Single', 'Double', 'Suite']),
  pricePerNight: z.number(),
  capacity: z.number(),
  imageUrl: z.string(),
});

export const BookingSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  customerName: z.string(),
  customerEmail: z.email(),
  // ISO date string
  checkIn: z.string(), 
  checkOut: z.string(),
  createdAt: z.string(),
});

export const AvailabilityResponseSchema = z.object({
  available: z.boolean(),
  conflicts: z.array(z.object({
    checkIn: z.string(),
    checkOut: z.string(),
  })).optional(),
});

export const CreateBookingRequestSchema = z.object({
  roomId: z.number(),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.email("Invalid email address"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required") ,
});

export const DateRangeSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
}).refine((data) => {
  if (!data.checkIn || !data.checkOut) return true;
  return data.checkOut > data.checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});
