import { useEffect, useState } from 'react';
import { Room } from '../../types';
import { fetchRooms, checkAvailability } from '../../api/client';
import { DateRangeSchema } from '../../schemas';
import { RoomFilters } from './components/RoomFilters';
import { RoomList } from './components/RoomList';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availabilities, setAvailabilities] = useState<Record<number, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err) {
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      setAvailabilities({});
      setValidationError(null);
      setHasSearched(false);
      return;
    }

    if (rooms.length === 0) {
      return;
    }

    const validationResult = DateRangeSchema.safeParse({ checkIn, checkOut });
    if (!validationResult.success) {
      setValidationError(validationResult.error.issues[0].message);
      setAvailabilities({});
      setHasSearched(false);
      return;
    }
    setValidationError(null);
    setHasSearched(true);

    setCheckingAvailability(true);
    const newAvailabilities: Record<number, boolean> = {};

    try {
      await Promise.all(
        rooms.map(async (room) => {
          try {
            const result = await checkAvailability(room.id, checkIn, checkOut);
            newAvailabilities[room.id] = result.available;
          } catch (err) {
            console.error(`Failed to check availability for room ${room.id}`, err);
          }
        })
      );
      setAvailabilities(newAvailabilities);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!rooms || rooms.length <= 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">No rooms available</div>
      </div>
    );
  }

  return (
    <>
      <RoomFilters
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        handleSearch={handleSearch}
        checkingAvailability={checkingAvailability}
        validationError={validationError}
      />

      <RoomList
        rooms={rooms}
        availabilities={availabilities}
        hasSearched={hasSearched}
        checkingAvailability={checkingAvailability}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </>
  );
};
