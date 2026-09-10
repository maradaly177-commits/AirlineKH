import { PaperPlaneTilt, QrCode, User, Clock, Users, Info, Buildings, Ticket } from '@phosphor-icons/react';
import './BoardingPassDisplay.css';

/**
 * BoardingPassDisplay Component
 * 
 * Hiển thị thẻ lên máy bay (Boarding Pass) chuẩn 100% theo Mockup SkyLink Airlines
 */
export default function BoardingPassDisplay({ boardingPass }) {
  const {
    ticket_code = "LV1K95QRRR",
    passenger_name = "Nguyễn Văn A",
    pnr_code = "BQCVOE",
    flight_number = "VJ565",
    departure_time = "2026-09-10 16:24",
    seat_number = "9D",
    qr_code_url,
    check_in_time = "2026-09-09 21:37:00",
    gate = "A04",
    zone = "GROUP 1",
    cabin_class = "Economy",
    departure_airport = "SGN",
    departure_city = "TP. HỒ CHÍ MINH",
    arrival_airport = "HAN",
    arrival_city = "HÀ NỘI",
  } = boardingPass || {};

  return (
    <div className="w-full font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Main Ticket Card */}
      <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-950/20 overflow-hidden border border-white/90">
        
        {/* Ticket Header Banner (Gradient Blue/Purple with airplane watermark) */}
        <div className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#6d28d9] text-white p-6 md:p-8 relative overflow-hidden flex items-center justify-between">
          
          {/* Watermark Plane Outline */}
          <div className="absolute right-36 -bottom-10 opacity-15 pointer-events-none transform rotate-12">
            <PaperPlaneTilt size={200} weight="fill" />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <PaperPlaneTilt size={22} weight="fill" className="text-white" />
              <span className="font-extrabold text-lg md:text-xl tracking-tight">SkyLink Airlines</span>
            </div>
            <p className="text-[11px] font-mono tracking-widest text-blue-200 uppercase pt-1">BOARDING PASS</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">THẺ LÊN MÁY BAY</h2>
          </div>

          <div className="relative z-10 flex flex-col items-end">
            <span className="text-xs text-blue-200 font-mono font-bold">PNR</span>
            <span className="text-2xl md:text-3xl font-black font-mono tracking-wider text-white">{pnr_code}</span>
            <span className="mt-1 px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100">
              {cabin_class}
            </span>
          </div>

        </div>

        {/* Ticket Body Content */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Flight & Passenger Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Row 1: Passenger Name & Ticket Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={20} weight="bold" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    HỌ VÀ TÊN / PASSENGER NAME
                  </span>
                  <span className="text-lg md:text-xl font-black text-slate-900 block mt-0.5">
                    {passenger_name}
                  </span>
                </div>
              </div>

              <div className="sm:text-right pl-12 sm:pl-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  MÃ VÉ / TICKET
                </span>
                <span className="text-base font-mono font-black text-slate-800 block mt-0.5">
                  {ticket_code}
                </span>
              </div>
            </div>

            {/* Row 2: Flight Path Container (SGN -> HAN) */}
            <div className="bg-[#f0f5ff] rounded-2xl p-5 border border-blue-100 flex items-center justify-between gap-4">
              
              {/* Departure Airport */}
              <div className="flex items-center gap-3">
                <div className="text-2xl text-blue-600 font-bold hidden sm:block">✈️</div>
                <div>
                  <span className="text-2xl md:text-3xl font-black text-slate-900 block leading-none">
                    {departure_airport}
                  </span>
                  <span className="text-xs text-slate-500 font-bold mt-1 block">
                    {departure_city}
                  </span>
                </div>
              </div>

              {/* Middle Flight Path */}
              <div className="flex-1 flex flex-col items-center max-w-[200px]">
                <span className="text-xs font-mono font-bold text-blue-600 tracking-wider mb-1">
                  {flight_number}
                </span>
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="h-0.5 flex-1 bg-blue-300 rounded-full" />
                  <PaperPlaneTilt size={20} weight="fill" className="text-blue-600 rotate-90" />
                  <div className="h-0.5 flex-1 bg-blue-300 rounded-full" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">
                  Bay trực tiếp / Direct
                </span>
              </div>

              {/* Arrival Airport */}
              <div className="text-right flex items-center gap-3">
                <div>
                  <span className="text-2xl md:text-3xl font-black text-slate-900 block leading-none">
                    {arrival_airport}
                  </span>
                  <span className="text-xs text-slate-500 font-bold mt-1 block">
                    {arrival_city}
                  </span>
                </div>
                <div className="text-2xl text-blue-600 font-bold hidden sm:block">🏛️</div>
              </div>

            </div>

            {/* Row 3: 4 Info Metric Cards (Seat, Gate, Time, Zone) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              
              {/* Seat */}
              <div className="bg-[#f4f7ff] p-4 rounded-2xl border border-blue-100 text-center flex flex-col items-center justify-center">
                <Ticket size={22} className="text-blue-600 mb-1" weight="bold" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GHẾ / SEAT</span>
                <span className="text-xl md:text-2xl font-black text-blue-900 font-mono mt-0.5">{seat_number}</span>
              </div>

              {/* Gate */}
              <div className="bg-[#f4f7ff] p-4 rounded-2xl border border-blue-100 text-center flex flex-col items-center justify-center">
                <Buildings size={22} className="text-blue-600 mb-1" weight="bold" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CỔNG / GATE</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 font-mono mt-0.5">{gate}</span>
              </div>

              {/* Time */}
              <div className="bg-[#f4f7ff] p-4 rounded-2xl border border-blue-100 text-center flex flex-col items-center justify-center">
                <Clock size={22} className="text-blue-600 mb-1" weight="bold" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GIỜ BAY / TIME</span>
                <span className="text-xs md:text-sm font-bold text-slate-900 mt-1 leading-tight">{departure_time}</span>
              </div>

              {/* Zone */}
              <div className="bg-[#f4f7ff] p-4 rounded-2xl border border-blue-100 text-center flex flex-col items-center justify-center">
                <Users size={22} className="text-blue-600 mb-1" weight="bold" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NHÓM / ZONE</span>
                <span className="text-xs md:text-sm font-bold text-slate-900 mt-1">{zone}</span>
              </div>

            </div>

            {/* Row 4: Timestamp */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pt-1">
              <Clock size={15} />
              <span>Thời gian hoàn tất Check-in: {check_in_time}</span>
            </div>

          </div>

          {/* Right Column (4 cols): QR Code & Gate Notice */}
          <div className="lg:col-span-4 lg:border-l lg:border-dashed lg:border-slate-200 lg:pl-8 flex flex-col items-center space-y-5 justify-between h-full">
            
            <div className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-sm">
                {qr_code_url ? (
                  <img src={qr_code_url} alt="QR Code" className="w-44 h-44 object-contain" />
                ) : (
                  <div className="w-44 h-44 bg-slate-50 flex items-center justify-center text-slate-400">
                    <QrCode size={90} />
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider text-center">
                SCAN CODE AT BOARDING GATE
              </p>
            </div>

            <div className="w-full bg-[#f0f5ff] rounded-xl p-3.5 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed font-medium">
              <Info size={18} className="text-blue-600 shrink-0 mt-0.5" weight="bold" />
              <span>Vui lòng xuất trình thẻ lên máy bay này cùng Hộ chiếu/CCCD hợp lệ tại cửa khởi hành.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
