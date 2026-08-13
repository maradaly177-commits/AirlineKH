import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AirplaneTilt, Armchair, ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

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
          const res = await fetch(`http://127.0.0.1:8000/api/flights/${flight.id}/seats?trip_type=${searchParams.trip_type || 'one_way'}`, { headers });
          const data = await res.json();
          if (res.ok && data.status === "success") {
            newSeatsData[flight.id] = data.data;
          }
        }
        setSeatsData(newSeatsData);
      } catch (err) {
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
        // Deselect
        return {
          ...prev,
          [bookingStage]: currentSelection.filter(s => s.id !== seat.id)
        };
      } else {
        // Select if not full
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

    // Tiến hành gọi API lưu Draft Booking
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

      const res = await fetch("http://127.0.0.1:8000/api/bookings/lock-seat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Lưu lại selected_seats và chuyển sang chọn dịch vụ
        localStorage.setItem("selected_seats", JSON.stringify(selectedSeats));
        navigate("/services");
      } else {
        alert("Lỗi giữ ghế: " + (data.message || "Ghế có thể đã bị người khác chọn."));
        // Load lại trang để lấy status mới nhất
        window.location.reload();
      }
    } catch (err) {
      alert("Không thể kết nối tới server.");
    } finally {
      setProcessing(false);
    }
  };

  // Xác định màu sắc ghế dựa theo số hàng (dựa trên mẫu của Vietjet)
  const getSeatColorClass = (rowNum, isSelected, isLocked) => {
    if (isLocked) return "bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50";
    if (isSelected) return "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/30 -translate-y-1 ring-2 ring-blue-500 ring-offset-2";
    
    const r = Number(rowNum);
    let colorBg = "bg-sky-500 border-sky-600 text-white"; // Tiết kiệm (-5%)
    let hoverEff = "hover:bg-sky-400 cursor-pointer";

    if (r <= 5) {
      colorBg = "bg-red-500 border-red-600 text-white"; // Thương gia (+20%)
      hoverEff = "hover:bg-red-400 cursor-pointer";
    } else if (r <= 14) {
      colorBg = "bg-green-500 border-green-600 text-white"; // Tiêu chuẩn
      hoverEff = "hover:bg-green-400 cursor-pointer";
    }

    return `${colorBg} ${hoverEff}`;
  };

  const renderSeatIcon = (seat) => {
    const isSelected = selectedSeats[bookingStage].some(s => s.id === seat.id);
    const isLocked = seat.is_locked;
    
    const match = seat.seat_number.match(/(\d+)([A-Z])/);
    const rowNum = match ? match[1] : 0;

    const colorClass = getSeatColorClass(rowNum, isSelected, isLocked);

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={isLocked}
        className={`relative w-8 h-10 rounded-t-md rounded-b-sm border flex flex-col items-center justify-start pt-1 transition-all duration-200 ${colorClass}`}
        title={`Ghế ${seat.seat_number} - ${seat.seat_class}`}
      >
        {/* Tựa đầu */}
        <div className={`w-5 h-1.5 rounded-full ${isSelected ? 'bg-zinc-700' : 'bg-white/30'}`}></div>

        {/* Dấu X nếu bị khóa */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-zinc-400 rotate-45 absolute"></div>
            <div className="w-full h-0.5 bg-zinc-400 -rotate-45 absolute"></div>
          </div>
        )}
      </button>
    );
  };

  // Render sơ đồ ngang
  const renderSeatGrid = () => {
    if (currentSeats.length === 0) return null;
    
    // Gom nhóm theo Cột dọc (A,B,C,D,E,F) thay vì Hàng ngang
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
    
    // Sort các ghế trong mỗi cột theo đúng số hàng
    Object.keys(cols).forEach(letter => {
      cols[letter].sort((a, b) => a.rowNum - b.rowNum);
    });

    return (
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm overflow-hidden flex flex-col items-center">
        
        {/* Vùng scroll ngang */}
        <div className="w-full overflow-x-auto pb-12 pt-6 custom-scrollbar">
          <div className="min-w-max flex items-center justify-center relative mx-auto px-24 py-12">
            
            {/* THÂN MÁY BAY CHÍNH */}
            <div className="bg-[#f0f3f5] border-y-4 border-zinc-300 flex items-center relative py-6 px-4"
                 style={{ borderRadius: '120px 120px 120px 120px', minWidth: '800px' }}>
              
              {/* Cánh trái (trên) */}
              <div className="absolute -top-16 left-1/3 w-48 h-16 bg-zinc-200" style={{ transform: 'skewX(-45deg)', borderRadius: '10px 10px 0 0', zIndex: -1 }}></div>
              {/* Cánh phải (dưới) */}
              <div className="absolute -bottom-16 left-1/3 w-48 h-16 bg-zinc-200" style={{ transform: 'skewX(45deg)', borderRadius: '0 0 10px 10px', zIndex: -1 }}></div>

              {/* Mũi máy bay (Trái) */}
              <div className="absolute -left-20 top-0 bottom-0 w-24 bg-zinc-700 rounded-l-full flex items-center justify-center text-white text-xs font-bold tracking-widest" style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 80%)' }}>
                 COCKPIT
              </div>
              
              {/* Đuôi máy bay (Phải) */}
              <div className="absolute -right-24 top-0 bottom-0 w-24 bg-zinc-700 rounded-r-full flex items-center justify-center text-white text-xs font-bold" style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }}>
                 WC
              </div>

              {/* Các hàng ghế (Render D, E, F ở trên) */}
              <div className="flex flex-col relative w-full">
                {/* Khu D E F */}
                <div className="flex flex-col gap-1.5 mb-2 relative">
                  {/* Chữ D E F */}
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-1 text-zinc-500 font-bold text-[10px]">
                    <span>F</span><span>E</span><span>D</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['F'].find(s => s.rowNum === r);
                      return <div key={`F-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['E'].find(s => s.rowNum === r);
                      return <div key={`E-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['D'].find(s => s.rowNum === r);
                      return <div key={`D-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                </div>

                {/* Lối đi (Aisle) & Số hàng dọc theo lối đi */}
                <div className="h-8 flex gap-2 items-center text-zinc-400 font-bold text-[10px] w-full">
                  {sortedRowNums.map(r => (
                    <div key={`aisle-${r}`} className="w-8 text-center flex-shrink-0">{String(r).padStart(2, '0')}</div>
                  ))}
                </div>

                {/* Khu A B C */}
                <div className="flex flex-col gap-1.5 mt-2 relative">
                  {/* Chữ A B C */}
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-1 text-zinc-500 font-bold text-[10px]">
                    <span>C</span><span>B</span><span>A</span>
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['C'].find(s => s.rowNum === r);
                      return <div key={`C-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['B'].find(s => s.rowNum === r);
                      return <div key={`B-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    {sortedRowNums.map(r => {
                      const seat = cols['A'].find(s => s.rowNum === r);
                      return <div key={`A-${r}`} className="w-8">{seat ? renderSeatIcon(seat) : null}</div>;
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Chú thích màu sắc (Legend) */}
        <div className="mt-4 border-t border-zinc-100 pt-6 w-full flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div> Thương gia (+20%)
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Tiêu chuẩn
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <div className="w-4 h-4 bg-sky-500 rounded-sm"></div> Tiết kiệm (-5%)
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-24 pt-24 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="mb-8 -ml-3">
          <BackButton to="/flights" label="Quay lại chọn chuyến bay" />
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Bước 01.5
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            {flights.length > 1 ? (bookingStage === 'outbound' ? 'Chọn ghế chuyến đi' : 'Chọn ghế chuyến về') : 'Chọn chỗ ngồi'}
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Lựa chọn chỗ ngồi lý tưởng cho chuyến bay của bạn. Ghế đã được người khác chọn sẽ chuyển màu xám.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Sơ đồ ghế */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4 bg-white rounded-[3rem] border border-zinc-200">
                <CircleNotch size={40} className="animate-spin" />
                <p className="font-medium text-sm">Đang tải sơ đồ ghế...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] font-medium text-center border border-red-100">
                {error}
              </div>
            ) : (
              renderSeatGrid()
            )}
            
            {/* Chú thích */}
            <div className="mt-8 flex justify-center gap-8">
               <div className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                 <div className="w-6 h-8 border-2 border-zinc-300 bg-white rounded-t-md rounded-b-sm flex flex-col items-center pt-1"><div className="w-3 h-1 bg-zinc-200 rounded-full"></div></div> Trống
               </div>
               <div className="flex items-center gap-3 text-sm font-semibold text-blue-600">
                 <div className="w-6 h-8 border-2 border-blue-700 bg-blue-600 rounded-t-md rounded-b-sm shadow-sm flex flex-col items-center pt-1"><div className="w-3 h-1 bg-blue-500 rounded-full"></div></div> Đang chọn
               </div>
               <div className="flex items-center gap-3 text-sm font-semibold text-zinc-400">
                 <div className="w-6 h-8 border-2 border-zinc-300 bg-zinc-200 rounded-t-md rounded-b-sm relative flex items-center justify-center">
                    <div className="w-full h-0.5 bg-zinc-400 rotate-45 absolute"></div>
                    <div className="w-full h-0.5 bg-zinc-400 -rotate-45 absolute"></div>
                 </div> Đã đặt
               </div>
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] sticky top-8 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-6 text-zinc-900">Chi tiết chỗ ngồi</h3>
              
              {flights.map((f, idx) => {
                const stageKey = idx === 0 ? 'outbound' : 'return';
                const seats = selectedSeats[stageKey];
                const isActive = bookingStage === stageKey;
                
                return (
                  <div key={idx} className={`mb-6 pb-6 ${idx === 0 && flights.length > 1 ? 'border-b border-zinc-100' : ''} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">
                      CHUYẾN {idx === 0 ? "ĐI" : "VỀ"}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold tracking-tighter text-zinc-900">{f.departure_airport?.code}</span>
                      <AirplaneTilt size={16} weight="fill" className="text-zinc-300 mx-2" />
                      <span className="text-xl font-bold tracking-tighter text-zinc-900">{f.arrival_airport?.code}</span>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex justify-between items-center">
                      <p className="text-zinc-500 font-medium mb-1">Đã chọn ({selectedSeats[stageKey].length}/{totalPassengers})</p>
                      <div className="font-bold text-lg min-h-[28px]">
                        {selectedSeats[stageKey].length > 0 
                          ? selectedSeats[stageKey].map(s => s.seat_number).join(", ") 
                          : "Chưa chọn ghế"}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button 
                onClick={handleNext}
                disabled={selectedSeats[bookingStage].length !== totalPassengers || processing}
                className="w-full mt-6 bg-zinc-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {processing ? <CircleNotch className="animate-spin" size={20} /> : "Tiếp tục"}
                {!processing && <ArrowRight size={20} weight="bold" />}
              </button>
              
              <p className="mt-4 text-[11px] text-zinc-400 font-medium text-center uppercase tracking-widest">
                Sau khi tiếp tục, ghế sẽ bị khóa trong 5 phút.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
