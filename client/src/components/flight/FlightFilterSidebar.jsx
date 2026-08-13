import { Faders } from "@phosphor-icons/react";

/**
 * FlightFilterSidebar Component (Premium Light Theme)
 * Handles the UI for filtering flights. Dispatches changes via onFilterChange.
 */
export default function FlightFilterSidebar({ filters, onFilterChange }) {
  const timeSlots = [
    { id: 'morning', label: 'Sáng (00:00 - 11:59)' },
    { id: 'afternoon', label: 'Chiều (12:00 - 17:59)' },
    { id: 'evening', label: 'Tối (18:00 - 23:59)' },
  ];

  return (
    <aside className="w-full md:w-72 flex-shrink-0 sticky top-28">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-zinc-200/50 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
          <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2 text-zinc-800">
            <Faders size={18} /> Lọc kết quả
          </h2>
          <button 
            className="text-xs text-zinc-400 font-semibold hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => onFilterChange({ clearAll: true })}
          >
            Xóa lọc
          </button>
        </div>

        {/* Filter Section: Sort By */}
        <div className="mb-8 border-b border-zinc-100 pb-8">
          <h3 className="text-sm font-bold text-zinc-900 mb-4">Sắp xếp theo</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input 
                type="radio" 
                name="sort" 
                value="price_asc"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-zinc-300 bg-white rounded-full cursor-pointer accent-blue-600"
                checked={filters.sort === 'price_asc'}
                onChange={(e) => onFilterChange({ sort: e.target.value })}
              />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium">
                Giá thấp nhất
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input 
                type="radio" 
                name="sort" 
                value="time_asc"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-zinc-300 bg-white rounded-full cursor-pointer accent-blue-600"
                checked={filters.sort === 'time_asc'}
                onChange={(e) => onFilterChange({ sort: e.target.value })}
              />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium">
                Cất cánh sớm nhất
              </span>
            </label>
          </div>
        </div>

        {/* Filter Section: Time */}
        <div>
          <h3 className="text-sm font-bold text-zinc-900 mb-4">Giờ cất cánh</h3>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <label key={slot.id} className="flex items-center gap-3 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 bg-white cursor-pointer accent-blue-600"
                  checked={filters.times?.includes(slot.id) || false}
                  onChange={(e) => {
                    const newTimes = e.target.checked 
                      ? [...(filters.times || []), slot.id]
                      : (filters.times || []).filter(t => t !== slot.id);
                    onFilterChange({ times: newTimes });
                  }}
                />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium">
                  {slot.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
