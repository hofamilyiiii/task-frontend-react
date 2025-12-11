import { Link } from 'react-router-dom';
import { Room } from '../../../types';
import { BASE } from '../../../api/client';

interface RoomCardProps {
  room: Room;
  isAvailable: boolean;
  hasSearched: boolean;
  checkingAvailability: boolean;
  checkIn?: string;
  checkOut?: string;
}

export const RoomCard = ({
  room,
  isAvailable,
  hasSearched,
  checkingAvailability,
  checkIn,
  checkOut,
}: RoomCardProps) => {
  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.set('checkIn', checkIn);
  if (checkOut) queryParams.set('checkOut', checkOut);
  const queryString = queryParams.toString();

  return (
    <Link
      to={`/room/${room.id}${queryString ? `?${queryString}` : ''}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block relative"
    >
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded shadow-sm">
          {room.category}
        </span>
        {hasSearched && !checkingAvailability && (
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded shadow-sm ${
              isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        )}
        {hasSearched && checkingAvailability && (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded shadow-sm">
            Checking...
          </span>
        )}
      </div>

      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={
            room.imageUrl.startsWith('http')
              ? room.imageUrl
              : `${BASE}${room.imageUrl}`
          }
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
        </div>
        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="font-medium mr-2">Capacity:</span>
            {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">
            ${room.pricePerNight}{' '}
            <span className="text-sm text-gray-500 font-normal">/ night</span>
          </span>
          <span className="text-blue-600 hover:text-blue-900 font-medium">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

