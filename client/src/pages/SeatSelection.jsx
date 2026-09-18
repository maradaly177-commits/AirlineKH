import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarBlank,
  Clock,
  ShieldCheck,
  Robot,
  ArrowsOut,
  Info,
  Check
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Brand Logo Badges matching image
const VietnamAirlinesLogo = () => (
  <div className="w-8 h-8 rounded-lg bg-[#00557B] flex items-center justify-center shrink-0 p-0.5 shadow-xs">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 6C20 6 22 13 25 15C28 17 34 18 34 18C34 18 28 20 25 23C22 26 20 34 20 34C20 34 18 26 15 23C12 20 6 18 6 18C6 18 12 17 15 15C18 13 20 6 20 6Z" fill="#F4B41A"/>
    </svg>
  </div>
);

const SkyLinkLogo = () => (
  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white text-xs font-black shadow-xs">
    ✈
  </div>
);

export default function SeatSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [flights, setFlights] = useState([]);
  const [seatsData, setSeatsData] = useState({}); // { flight_id: [seats] }
  
  const [bookingStage, setBookingStage] = useState('outbound');
  const [selectedSeats, setSelectedSeats] = useState({
    outbound: [],
    return: []
  });

  const searchParams = JSON.parse(localStorage.getItem("search_params")) || { passengers: { adults: 1, children: 0 } };
  const totalPassengers = (searchParams.passengers?.adults || 1) + (searchParams.passengers?.children || 0);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const savedFlights = JSON.parse(localStorage.getItem("selected_flights")) || [];
    if (savedFlights.length === 0) {
      navigate("/flights");
      return;
    }
    setFlights(savedFlights);

    const fetchAllSeats = async () => {
      try {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const newSeatsData = {};
        for (const flight of savedFlights) {
          const res = await fetch(`/api/flights/${flight.id}/seats?trip_type=${searchParams.trip_type || 'one_way'}`, { headers });
          const data = await res.json();
          if (res.ok && data.status === "success") {
            newSeatsData[flight.id] = data.data;
          }
        }
        setSeatsData(newSeatsData);
      } catch (err) {
        console.error("Failed to load seats:", err);
        setError("Lỗi tải sơ đồ ghế. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSeats();
  }, [navigate]);

  if (flights.length === 0) return null;

  const currentFlight = bookingStage === 'outbound' ? flights[0] : flights[1];
  const currentSeats = seatsData[currentFlight?.id] || [];

  const handleSeatClick = (seat) => {
    if (seat.is_locked) return;
    
    setSelectedSeats(prev => {
      const currentSelection = prev[bookingStage];
      const isAlreadySelected = currentSelection.some(s => s.id === seat.id);

      if (isAlreadySelected) {
        return {
          ...prev,
          [bookingStage]: currentSelection.filter(s => s.id !== seat.id)
        };
      } else {
        if (currentSelection.length >= totalPassengers) {
          alert(`Bạn chỉ được chọn tối đa ${totalPassengers} ghế cho ${totalPassengers} hành khách.`);
          return prev;
        }
        return {
          ...prev,
          [bookingStage]: [...currentSelection, seat]
        };
      }
    });
  };

  const handleNext = async () => {
    if (flights.length > 1 && bookingStage === 'outbound') {
      setBookingStage('return');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    setProcessing(true);
    try {
      if (selectedSeats[bookingStage].length !== totalPassengers) {
        alert(`Vui lòng chọn đủ ${totalPassengers} ghế cho hành khách!`);
        return;
      }

      const payload = {
        flight_id: flights[0].id,
        outbound_seat_ids: selectedSeats.outbound.map(s => s.id),
      };

      if (flights.length > 1 && selectedSeats.return.length > 0) {
        payload.return_flight_id = flights[1].id;
        payload.return_seat_ids = selectedSeats.return.map(s => s.id);
      }

      const res = await fetch("/api/bookings/lock-seat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.status === "success") {
        localStorage.setItem("selected_seats", JSON.stringify(selectedSeats));
        navigate("/services");
      } else {
        alert("Lỗi giữ ghế: " + (data.message || "Ghế có thể đã bị người khác chọn."));
        window.location.reload();
      }
    } catch (err) {
      console.error("Lock seat error:", err);
      alert("Không thể kết nối tới server.");
    } finally {
      setProcessing(false);
    }
  };

  // Safe time formatting
  const formatTime = (dateStr) => {
    if (!dateStr) return "10:59";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "10:59";
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "09/26/2026";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "09/26/2026";
    return d.toLocaleDateString("vi-VN", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  // Xác định kiểu màu sắc ghế theo hàng (Thương gia, Tiêu chuẩn, Tiết kiệm)
  const getSeatColorStyle = (rowNum, isSelected, isLocked) => {
    if (isLocked) {
      return "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60";
    }
    if (isSelected) {
      return "bg-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-400 ring-offset-1";
    }
    
    const r = Number(rowNum);
    if (r <= 4) {
      // Thương gia (+20%) - Hồng Đỏ
      return "bg-[#ff4d6d] hover:bg-[#ff758f] border-[#e63946] text-white cursor-pointer";
    }
    if (r <= 13) {
      // Tiêu chuẩn - Xanh ngọc Emerald
      return "bg-[#10b981] hover:bg-[#34d399] border-[#059669] text-white cursor-pointer";
    }
    // Tiết kiệm (-5%) - Xanh Lam
    return "bg-[#0077b6] hover:bg-[#0096c7] border-[#023e8a] text-white cursor-pointer";
  };

  const renderSeatIcon = (seat) => {
    const isSelected = selectedSeats[bookingStage].some(s => s.id === seat.id);
    const isLocked = seat.is_locked;
    
    const match = seat.seat_number.match(/(\d+)([A-Z])/);
    const rowNum = match ? match[1] : 0;
    const colorStyle = getSeatColorStyle(rowNum, isSelected, isLocked);

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={isLocked}
        className={`relative w-7 h-8 md:w-8 md:h-9 rounded-t-lg rounded-b-xs border flex flex-col items-center justify-center transition-all duration-200 ${colorStyle}`}
        title={`Ghế ${seat.seat_number} - ${seat.seat_class || 'Tiêu chuẩn'}`}
      >
        {isLocked ? (
          <span className="text-[10px] font-bold text-slate-400">✕</span>
        ) : (
          <span className="text-[9px] font-bold tracking-tighter">{seat.seat_number}</span>
        )}
      </button>
    );
  };

  // Render Cockpit Airplane Fuselage Grid matching reference image
  const renderSeatGrid = () => {
    if (currentSeats.length === 0) return null;
    
    const cols = { A: [], B: [], C: [], D: [], E: [], F: [] };
    const rowNums = new Set();

    currentSeats.forEach(seat => {
      const match = seat.seat_number.match(/(\d+)([A-Z])/);
      if (match) {
        const rowNum = match[1];
        const letter = match[2];
        rowNums.add(Number(rowNum));
        if (cols[letter]) {
          cols[letter].push({ ...seat, rowNum: Number(rowNum) });
        }
      }
    });

    const sortedRowNums = Array.from(rowNums).sort((a, b) => a - b);
    
    Object.keys(cols).forEach(letter => {
      cols[letter].sort((a, b) => a.rowNum - b.rowNum);
    });

    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col items-center">
        
        {/* Scroll container for Aircraft Fuselage */}
        <div className="w-full overflow-x-auto pb-6 pt-4 custom-scrollbar">
          <div className="min-w-max flex items-center justify-center relative mx-auto px-16 py-8">
            
            {/* AIRCRAFT FUSELAGE CONTAINER */}
            <div 
              className="bg-[#f2f7fd] border-2 border-slate-300/80 flex items-center relative py-6 px-10 shadow-inner"
              style={{ borderRadius: '140px 140px 140px 140px', minWidth: '820px' }}
            >
              
              {/* Airplane Cockpit Nose (Left Side) */}
              <div 
                className="absolute -left-20 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-100 to-[#f2f7fd] rounded-l-full border-l-2 border-slate-300 flex items-center justify-center text-slate-400 font-extrabold text-[10px] tracking-widest"
                style={{ clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)' }}
              >
                 <div className="text-center">
                   <span className="block text-slate-300 text-lg">✈</span>
                   <span>COCKPIT</span>
                 </div>
              </div>
              
              {/* Airplane Tail (Right Side) */}
              <div 
                className="absolute -right-20 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-100 to-[#f2f7fd] rounded-r-full border-r-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold text-[10px]"
                style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
              >
                 WC
              </div>

              {/* Seats Grid Column Layout */}
              <div className="flex flex-col relative w-full">
                
                {/* Row Numbers Header (01 02 03 ...) */}
                <div className="flex gap-2 items-center text-slate-400 font-extrabold text-[10px] w-full mb-3 pl-6">
                  {sortedRowNums.map(r => (
                    <div key={`head-${r}`} className="w-7 md:w-8 text-center flex-shrink-0">
                      {String(r).padStart(2, '0')}
                    </div>
                  ))}
                </div>

                {/* Top Row Set: A, B, C */}
                <div className="flex flex-col gap-1.5 mb-3 relative">
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-1 text-slate-400 font-bold text-[11px]">
                    <span>A</span><span>B</span><span>C</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['A'].find(s => s.rowNum === r);
                      return <div key={`A-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['B'].find(s => s.rowNum === r);
                      return <div key={`B-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['C'].find(s => s.rowNum === r);
                      return <div key={`C-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                </div>

                {/* Aisle Divider */}
                <div className="h-4 bg-blue-100/50 my-1 rounded-full border border-blue-200/30 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">Lối đi</span>
                </div>

                {/* Bottom Row Set: D, E, F */}
                <div className="flex flex-col gap-1.5 mt-3 relative">
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-1 text-slate-400 font-bold text-[11px]">
                    <span>D</span><span>E</span><span>F</span>
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['D'].find(s => s.rowNum === r);
                      return <div key={`D-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['E'].find(s => s.rowNum === r);
                      return <div key={`E-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['F'].find(s => s.rowNum === r);
                      return <div key={`F-${r}`} className="w-7 md:w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Legend Bar matching image */}
        <div className="mt-4 pt-4 border-t border-slate-100 w-full flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-[#ff4d6d] inline-block shadow-2xs" />
            <span>🟥 Thương gia (+20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-[#10b981] inline-block shadow-2xs" />
            <span>🟩 Tiêu chuẩn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-[#0077b6] inline-block shadow-2xs" />
            <span>🟦 Tiết kiệm (-5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-slate-200 border border-slate-300 text-[9px] flex items-center justify-center text-slate-400">✕</span>
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-white border border-blue-400 inline-block shadow-2xs" />
            <span>Ghế trống</span>
          </div>
        </div>

      </div>
    );
  };

  const selectedList = selectedSeats[bookingStage] || [];
  const depCode = currentFlight?.departure_airport?.code || currentFlight?.departure_airport_id || "DAD";
  const arrCode = currentFlight?.arrival_airport?.code || currentFlight?.arrival_airport_id || "PQC";
  const depCity = currentFlight?.departure_airport?.city || "Đà Nẵng";
  const arrCity = currentFlight?.arrival_airport?.city || "Phú Quốc";
  const flightNo = currentFlight?.flight_number || "VN7211";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans relative">
      <Navbar />

      {/* 1. HERO HEADER BANNER matching user reference image */}
      <div className="relative pt-24 pb-16 px-6 md:px-12 bg-gradient-to-b from-[#eaf4ff] via-[#edf6ff] to-slate-50 overflow-hidden">
        
        {/* Sky Background Plane Illustration */}
        <div className="absolute top-6 right-8 md:right-24 w-80 md:w-[460px] opacity-90 pointer-events-none z-0">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230804/pngtree-a-plane-flying-in-the-blue-sky-image_12999284.jpg"
            alt="Sky plane illustration"
            className="w-full h-auto object-contain mix-blend-multiply opacity-30 rounded-3xl"
          />
        </div>

        {/* Script handwriting slogan top right */}
        <div className="absolute top-14 right-12 hidden lg:block text-right pointer-events-none z-10">
          <span className="font-serif italic text-2xl text-blue-800/60 font-bold tracking-wide block">
            Your Journey Our Priority ✈
          </span>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Back button */}
          <button
            onClick={() => navigate("/flights")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-100 shadow-xs mb-4 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Quay lại chọn chuyến bay</span>
          </button>

          {/* Stepper Pill Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase shadow-2xs">
              Bước 01.5
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Check size={12} weight="bold" className="text-emerald-500" />
                Chuyến bay
              </span>
              <span>•</span>
              <span className="text-blue-600 font-extrabold flex items-center gap-1">
                ● Chọn ghế
              </span>
              <span>•</span>
              <span>Thanh toán</span>
              <span>•</span>
              <span>Hoàn tất</span>
            </div>
          </div>

          {/* Page Title & Subtitle */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Chọn chỗ ngồi
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl">
            Lựa chọn chỗ ngồi lý tưởng cho chuyến bay của bạn. Ghế đã được người khác chọn sẽ chuyển màu xám.
          </p>

        </div>
      </div>

      {/* 2. MAIN CONTENT GRID (Left Seat Map + Right Summary) */}
      <main className="max-w-6xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column (Flight Info + Airplane Seat Map) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Flight Summary Meta Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Airline */}
            <div className="flex items-center gap-3">
              {flightNo.includes("VN") ? <VietnamAirlinesLogo /> : <SkyLinkLogo />}
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  {currentFlight?.airline_name || (flightNo.includes("VN") ? "Vietnam Airlines" : "SkyLink Airlines")}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{flightNo}</span>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-black text-slate-900 block">{depCode}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{depCity}</span>
              </div>
              <span className="text-blue-600 font-bold text-xs">✈</span>
              <div>
                <span className="text-sm font-black text-slate-900 block">{arrCode}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{arrCity}</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarBlank size={16} className="text-blue-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Ngày bay</span>
                <span className="text-xs font-black text-slate-900">{formatDate(currentFlight?.departure_time || searchParams.date)}</span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Thời gian</span>
                <span className="text-xs font-black text-slate-900">{formatTime(currentFlight?.departure_time)} - {formatTime(currentFlight?.arrival_time)}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Thời gian bay</span>
                <span className="text-xs font-black text-slate-900">1g 00p</span>
              </div>
            </div>

          </div>

          {/* Seat Map Aircraft View */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-3xl border border-slate-200">
              <span className="animate-spin text-2xl text-blue-600">⌛</span>
              <p className="font-bold text-xs">Đang tải sơ đồ ghế...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-3xl font-bold text-xs text-center border border-red-200">
              {error}
            </div>
          ) : (
            renderSeatGrid()
          )}

          {/* Bottom Info Strip matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="bg-blue-50/80 border border-blue-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-blue-800 font-semibold w-full sm:w-auto">
              <Info size={16} className="text-blue-600 shrink-0" weight="bold" />
              <span>Bạn có thể thay đổi chỗ ngồi sau khi hoàn tất đặt vé.</span>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-4 py-2.5 rounded-2xl shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <ArrowsOut size={14} weight="bold" />
              <span>Xem chi tiết ghế ˅</span>
            </button>
          </div>

        </div>

        {/* Right Column (Chi tiết chỗ ngồi Sticky Summary) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm sticky top-24 space-y-5">
            
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Chi tiết chỗ ngồi</h2>
              <span className="text-xs font-bold text-blue-600 block mt-0.5">Chuyến đi</span>
            </div>

            {/* Route Header */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <div>
                <span className="text-base font-black text-slate-900 block">{depCode}</span>
                <span className="text-[10px] text-slate-400 font-bold">{depCity}</span>
              </div>
              <span className="text-blue-600 font-bold text-xs">✈</span>
              <div className="text-right">
                <span className="text-base font-black text-slate-900 block">{arrCode}</span>
                <span className="text-[10px] text-slate-400 font-bold">{arrCity}</span>
              </div>
            </div>

            {/* Seat Selection Cards */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Selected Count */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Ghế đã chọn</span>
                <span className="text-base font-black text-blue-600">
                  {selectedList.length}/{totalPassengers}
                </span>
              </div>

              {/* Selected Seat Code */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Mã ghế</span>
                <span className="text-xs font-black text-slate-900 truncate block">
                  {selectedList.length > 0 
                    ? selectedList.map(s => s.seat_number).join(", ")
                    : "Chưa chọn ghế"}
                </span>
              </div>

            </div>

            {/* SkyAI Recommendation Box matching reference image */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-extrabold shadow-2xs mt-0.5">
                <Robot size={14} weight="bold" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-blue-900 block mb-0.5">SkyAI gợi ý</span>
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Ghế ở giữa thường ổn định nhất và ít bị ảnh hưởng bởi rung lắc.
                </p>
              </div>
            </div>

            {/* Next Action Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedList.length !== totalPassengers || processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{processing ? "Đang xử lý..." : "Tiếp tục"}</span>
              <span className="text-base">➔</span>
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-1">
              <ShieldCheck size={14} className="text-emerald-500" weight="bold" />
              <span>Thanh toán an toàn • Bảo mật thông tin</span>
            </div>

          </div>
        </div>

      </main>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
