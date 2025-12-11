import { z } from 'zod';
import { 
  RoomSchema, 
  BookingSchema, 
  AvailabilityResponseSchema, 
  CreateBookingRequestSchema 
} from '../schemas';

export type Room = z.infer<typeof RoomSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
