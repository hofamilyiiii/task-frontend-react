import { format, addDays } from 'date-fns';

interface RoomFiltersProps {
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  handleSearch: () => void;
  checkingAvailability: boolean;
  validationError: string | null;
}

export const RoomFilters = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  handleSearch,
  checkingAvailability,
  validationError,
}: RoomFiltersProps) => {
  const today = new Date();

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Available Rooms</h1>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-600 mb-1">
                Check-in
              </label>
              <input
                type="date"
                id="checkIn"
                value={checkIn}
                min={format(today, 'yyyy-MM-dd')}
                onChange={(e) => setCheckIn(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm p-2 border ${
                  validationError
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-600 mb-1">
                Check-out
              </label>
              <input
                type="date"
                id="checkOut"
                value={checkOut}
                min={format(
                  addDays(checkIn ? new Date(checkIn) : today, 1),
                  'yyyy-MM-dd'
                )}
                onChange={(e) => setCheckOut(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm p-2 border ${
                  validationError
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
            <div className="flex self-end">
              <button
                onClick={handleSearch}
                disabled={checkingAvailability}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-900 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {checkingAvailability ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

