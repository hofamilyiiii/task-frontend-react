import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { CreateBookingRequestSchema } from '../../../schemas';
import { createBooking, checkAvailability } from '../../../api/client';
import { Room } from '../../../types';

const BookingFormSchema = CreateBookingRequestSchema.omit({ roomId: true }).refine(
  (data) => {
    if (!data.checkIn || !data.checkOut) return true;
    return data.checkOut > data.checkIn;
  },
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
  }
);

type BookingFormValues = z.infer<typeof BookingFormSchema>;

interface BookingFormProps {
  room: Room;
}

export const BookingForm = ({ room }: BookingFormProps) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [searchParams] = useSearchParams();

  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setBookingError(null);
    setBookingSuccess(false);

    try {
      await createBooking({
        roomId: room.id,
        ...data,
      });
      setBookingSuccess(true);
      reset();
    } catch (err) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError('An unexpected error occurred');
      }
    }
  };

  const today = new Date();
  const checkInDate = watch('checkIn');
  const checkOutDate = watch('checkOut');

  useEffect(() => {
    setIsAvailable(null);
    if (!checkInDate || !checkOutDate) {
      return;
    }

    if (checkOutDate <= checkInDate) {
      return;
    }

    const check = async () => {
      setCheckingAvailability(true);
      try {
        const result = await checkAvailability(room.id, checkInDate, checkOutDate);
        setIsAvailable(result.available);
      } catch (err) {
        console.error('Failed to check availability', err);
      } finally {
        setCheckingAvailability(false);
      }
    };

    check();
  }, [checkInDate, checkOutDate, room.id]);

  const minCheckOutDate = checkInDate
    ? format(addDays(new Date(checkInDate), 1), 'yyyy-MM-dd')
    : format(addDays(today, 1), 'yyyy-MM-dd');

  return (
    <div className="bg-white shadow rounded-3xl p-8 h-fit">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Book this Room</h3>

      {bookingSuccess ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
          Booking created successfully!
          <button
            onClick={() => setBookingSuccess(false)}
            className="block mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Book another date
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {bookingError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {bookingError}
            </div>
          )}

          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="customerName"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                errors.customerName ? 'border-red-500' : ''
              }`}
              placeholder="John Doe"
              {...register('customerName')}
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customerEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="customerEmail"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                errors.customerEmail ? 'border-red-500' : ''
              }`}
              placeholder="john@example.com"
              {...register('customerEmail')}
            />
            {errors.customerEmail && (
              <p className="mt-1 text-xs text-red-500">
                {errors.customerEmail.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkIn"
                className="block text-sm font-medium text-gray-700"
              >
                Check In
              </label>
              <input
                type="date"
                id="checkIn"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                  errors.checkIn ? 'border-red-500' : ''
                }`}
                {...register('checkIn')}
                min={format(today, 'yyyy-MM-dd')}
              />
              {errors.checkIn && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.checkIn.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkOut"
                className="block text-sm font-medium text-gray-700"
              >
                Check Out
              </label>
              <input
                type="date"
                id="checkOut"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                  errors.checkOut ? 'border-red-500' : ''
                }`}
                {...register('checkOut')}
                min={minCheckOutDate}
              />
              {errors.checkOut && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.checkOut.message}
                </p>
              )}
            </div>
          </div>

          {/* Availability Status */}
          {checkInDate && checkOutDate && (
            <div className="mt-2">
              {checkingAvailability ? (
                <div className="text-sm text-gray-500">Checking availability...</div>
              ) : isAvailable === true ? (
                <div className="text-sm text-green-600 font-medium">
                  Room is available for these dates
                </div>
              ) : isAvailable === false ? (
                <div className="text-sm text-red-600 font-medium">
                  Room is not available for these dates
                </div>
              ) : null}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || checkingAvailability || isAvailable === false}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      )}
    </div>
  );
};

