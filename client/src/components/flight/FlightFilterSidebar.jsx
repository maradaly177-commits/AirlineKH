import { useState } from "react";
import { Funnel, ArrowsClockwise } from "@phosphor-icons/react";

// Brand Logo Badges for Sidebar Filters
const VietnamAirlinesLogo = () => (
  <div className="w-5 h-5 rounded-md bg-[#00557B] flex items-center justify-center shrink-0 p-0.5">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 6C20 6 22 13 25 15C28 17 34 18 34 18C34 18 28 20 25 23C22 26 20 34 20 34C20 34 18 26 15 23C12 20 6 18 6 18C6 18 12 17 15 15C18 13 20 6 20 6Z" fill="#F4B41A"/>
    </svg>
  </div>
);

const SkyLinkLogo = () => (
  <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold">
    ✈
  </div>
);

const BambooLogo = () => (
  <div className="w-5 h-5 rounded-md bg-[#006633] flex items-center justify-center shrink-0 p-0.5">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M12 28C14 20 20 14 28 10C24 18 18 24 12 28Z" fill="#FFFFFF"/>
    </svg>
  </div>
);

const VietjetLogo = () => (
  <div className="w-5 h-5 rounded-md bg-[#ED1B24] flex items-center justify-center shrink-0 p-0.5">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M8 12L20 28L32 12" stroke="#FFF200" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  </div>
);

export default function FlightFilterSidebar({ filters, onFilterChange, allFlights = [] }) {
  const [maxPrice, setMaxPrice] = useState(10000000);

  const countAirlineFlights = (code) => {
    if (!Array.isArray(allFlights) || allFlights.length === 0) return null;
    const c = allFlights.filter(f => {
      const fn = (f.flight_number || "").toUpperCase();
      if (code === 'VN') return fn.startsWith('VN') || fn.includes('VIETNAM');
      if (code === 'VJ') return fn.startsWith('VJ') || fn.includes('VIETJET');
      if (code === 'QH') return fn.startsWith('QH') || fn.startsWith('FB') || fn.includes('BAMBOO');
      if (code === 'SKY') return fn.startsWith('SK') || fn.startsWith('SL') || (!fn.startsWith('VN') && !fn.startsWith('VJ') && !fn.startsWith('QH') && !fn.startsWith('FB'));
      return false;
    }).length;
    return `${c} chuyến`;
  };

  const timeSlots = [
    { id: 'morning', label: 'Sáng (06:00 - 11:59)', count: '12 chuyến' },
    { id: 'afternoon', label: 'Chiều (12:00 - 17:59)', count: '10 chuyến' },
    { id: 'evening', label: 'Tối (18:00 - 23:59)', count: '8 chuyến' },
  ];

  const airlines = [
    { id: 'VN', name: 'Vietnam Airlines', count: countAirlineFlights('VN') || '8 chuyến', logo: <VietnamAirlinesLogo /> },
    { id: 'SKY', name: 'SkyLink Airlines', count: countAirlineFlights('SKY') || '6 chuyến', logo: <SkyLinkLogo /> },
    { id: 'QH', name: 'Bamboo Airways', count: countAirlineFlights('QH') || '4 chuyến', logo: <BambooLogo /> },
    { id: 'VJ', name: 'VietJet Air', count: countAirlineFlights('VJ') || '2 chuyến', logo: <VietjetLogo /> },
  ];

  const amenities = [
    { id: 'direct', label: 'Bay thẳng', count: '5 chuyến' },
    { id: 'baggage', label: 'Có hành lý ký gửi', count: '14 chuyến' },
    { id: 'flexible', label: 'Hoàn/hủy linh hoạt', count: '7 chuyến' },
  ];

  return (
    <aside className="w-full md:w-72 shrink-0 sticky top-24 z-10">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto scrollbar-hide">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold tracking-tight flex items-center gap-2 text-slate-900">
            <Funnel size={18} className="text-blue-600" weight="bold" />
            Lọc kết quả
          </h2>
          <button 
            type="button"
            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            onClick={() => {
              setMaxPrice(10000000);
              onFilterChange({ clearAll: true });
            }}
          >
            Đặt lại
          </button>
        </div>

        {/* 1. Khoảng giá */}
        <div className="space-y-2 pb-3.5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Khoảng giá</h3>
            <span className="text-xs font-bold text-blue-600">0đ - {new Intl.NumberFormat('vi-VN').format(maxPrice)}đ</span>
          </div>
          <input
            type="range"
            min="500000"
            max="10000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              onFilterChange({ maxPrice: Number(e.target.value) });
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* 2. Giờ cất cánh */}
        <div className="space-y-2 pb-3.5 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Giờ cất cánh</h3>
          <div className="flex flex-col space-y-1.5 w-full">
            {timeSlots.map((slot) => (
              <label key={slot.id} className="flex items-center justify-between w-full cursor-pointer group select-none py-0.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-slate-50 cursor-pointer accent-blue-600 shrink-0"
                    checked={filters.times?.includes(slot.id) || false}
                    onChange={(e) => {
                      const newTimes = e.target.checked 
                        ? [...(filters.times || []), slot.id]
                        : (filters.times || []).filter(t => t !== slot.id);
                      onFilterChange({ times: newTimes });
                    }}
                  />
                  <span className="text-xs text-slate-700 group-hover:text-blue-600 font-semibold transition-colors truncate">
                    {slot.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                  {slot.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Hãng hàng không */}
        <div className="space-y-2 pb-3.5 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Hãng hàng không</h3>
          <div className="flex flex-col space-y-1.5 w-full">
            {airlines.map((al) => (
              <label key={al.id} className="flex items-center justify-between w-full cursor-pointer group select-none py-0.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-slate-50 cursor-pointer accent-blue-600 shrink-0"
                    checked={filters.airlines?.includes(al.id) || false}
                    onChange={(e) => {
                      const newAirlines = e.target.checked 
                        ? [...(filters.airlines || []), al.id]
                        : (filters.airlines || []).filter(a => a !== al.id);
                      onFilterChange({ airlines: newAirlines });
                    }}
                  />
                  {al.logo}
                  <span className="text-xs text-slate-700 group-hover:text-blue-600 font-semibold transition-colors truncate">
                    {al.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                  {al.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Tiện ích */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Tiện ích</h3>
          <div className="flex flex-col space-y-1.5 w-full">
            {amenities.map((am) => (
              <label key={am.id} className="flex items-center justify-between w-full cursor-pointer group select-none py-0.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-slate-50 cursor-pointer accent-blue-600 shrink-0"
                    checked={filters.amenities?.includes(am.id) || false}
                    onChange={(e) => {
                      const newAmenities = e.target.checked 
                        ? [...(filters.amenities || []), am.id]
                        : (filters.amenities || []).filter(a => a !== am.id);
                      onFilterChange({ amenities: newAmenities });
                    }}
                  />
                  <span className="text-xs text-slate-700 group-hover:text-blue-600 font-semibold transition-colors truncate">
                    {am.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                  {am.count}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}

