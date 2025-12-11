import { Room } from '../../../types';
import { RoomCard } from './RoomCard';

interface RoomListProps {
  rooms: Room[];
  availabilities: Record<number, boolean>;
  hasSearched: boolean;
  checkingAvailability: boolean;
  checkIn: string;
  checkOut: string;
}

export const RoomList = ({
  rooms,
  availabilities,
  hasSearched,
  checkingAvailability,
  checkIn,
  checkOut,
}: RoomListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const isAvailable = availabilities[room.id];

        return (
          <RoomCard
            key={room.id}
            room={room}
            isAvailable={isAvailable}
            hasSearched={hasSearched}
            checkingAvailability={checkingAvailability}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        );
      })}
    </div>
  );
};

