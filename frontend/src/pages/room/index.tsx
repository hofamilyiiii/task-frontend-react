import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRoom } from '../../api/client';
import { Room } from '../../types';
import { RoomDetails } from './components/RoomDetails';
import { BookingForm } from './components/BookingForm';

type RoomPageParams = {
  id: string;
};

export const RoomPage = () => {
  const { id } = useParams<RoomPageParams>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const roomId = parseInt(id, 10);
      fetchRoom(roomId)
        .then(setRoom)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading room...</div>
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

  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">Room not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/rooms" className="text-blue-600 hover:text-blue-900">
            &larr; Back to Rooms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{room.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RoomDetails room={room} />
        </div>

        <div>
          <BookingForm room={room} />
        </div>
      </div>
    </>
  );
};
