import { BASE } from '../../../api/client';
import { Room } from '../../../types';

interface RoomDetailsProps {
  room: Room;
}

export const RoomDetails = ({ room }: RoomDetailsProps) => {
  return (
    <div className="bg-white shadow rounded-3xl overflow-hidden">
      <img
        src={`${BASE}${room.imageUrl}`}
        alt={room.name}
        className="w-full h-96 object-cover"
      />
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
              {room.category}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {room.name}
            </h2>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${room.pricePerNight}
            <span className="text-base text-gray-500 font-normal">/night</span>
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Details</h3>
          <dl className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Capacity</dt>
              <dd className="text-sm text-gray-900">
                {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

