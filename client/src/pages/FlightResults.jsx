import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams as useReactSearchParams } from "react-router-dom";
import { AirplaneLanding, AirplaneTakeoff, MapPinLine, CalendarBlank, ArrowsLeftRight, MagnifyingGlass, Funnel } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import FlightCard from "../components/flight/FlightCard";
import FlightFilterSidebar from "../components/flight/FlightFilterSidebar";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RescheduleModal from "../components/RescheduleModal";

/**
 * FlightResults Smart Component (Container)
 * Handles API fetching, state management, and layout orchestration.
 * Design: Premium Light Theme, Sticky Parallel Sidebar, Motion 7, Density 5
 */
export default function FlightResults() {
  const [urlSearchParams, setUrlSearchParams] = useReactSearchParams();
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'price_asc',
    times: [],
  });

  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    date: "",
    returnDate: "",
    tripType: "one-way"
  });
  // eslint-disable-next-line no-unused-vars
  const [discountApplied, setDiscountApplied] = useState(null);
  const [bookingStage, setBookingStage] = useState('outbound');
  const [outboundFlight, setOutboundFlight] = useState(null);
  
  // Reschedule mode states
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedNewFlight, setSelectedNewFlight] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Load danh sách sân bay cho thanh tìm kiếm
  useEffect(() => {
    axios.get("/api/airports")
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        setAirports(list);
      })
      .catch(err => {
        console.error("Failed to load airports:", err);
        setAirports([]);
      });
  }, []);

  useEffect(() => {
    // Kiểm tra nếu đang ở mode đổi chuyến
    if (location.state?.rescheduleBooking) {
      setRescheduleMode(true);
      setRescheduleBooking(location.state.rescheduleBooking);
      
      const booking = location.state.rescheduleBooking;
      const flight = booking.flight;
      
      const params = {
        departure: flight.departure_airport?.code || "",
        arrival: flight.arrival_airport?.code || "",
        date: flight.departure_time ? new Date(flight.departure_time).toISOString().slice(0,10) : "",
        tripType: 'one-way'
      };
      setSearchParams(params);
      fetchFlights(params);
      return;
    }

    // 1. Ưu tiên đọc từ URL query params (VD: /flights?from=HAN&to=SGN&date=2026-09-10)
    const fromParam = urlSearchParams.get("from") || urlSearchParams.get("departure");
    const toParam = urlSearchParams.get("to") || urlSearchParams.get("arrival");
    const dateParam = urlSearchParams.get("date");
    const returnDateParam = urlSearchParams.get("returnDate") || urlSearchParams.get("return_date");
    const tripTypeParam = urlSearchParams.get("trip_type") || urlSearchParams.get("tripType") || "one-way";

    if (fromParam || toParam || dateParam) {
      const urlParams = {
        departure: fromParam || "",
        arrival: toParam || "",
        date: dateParam || "",
        returnDate: returnDateParam || "",
        tripType: tripTypeParam.replace('_', '-')
      };
      setSearchParams(urlParams);
      localStorage.setItem("search_params", JSON.stringify(urlParams));
      fetchFlights(urlParams);
      return;
    }

    // 2. Đọc tiêu chí tìm kiếm từ localStorage (được lưu bởi HomePage)
    const stored = localStorage.getItem("search_params");
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed) {
      setSearchParams(parsed);
      fetchFlights(parsed);
    } else {
      // Nếu chưa có tìm kiếm nào, tải danh sách mặc định
      fetchFlights(null);
    }
  }, [location, urlSearchParams]);

  const fetchFlights = async (params) => {
    setLoading(true);
    try {
      const queryParts = [];
      if (params?.departure) queryParts.push(`from=${encodeURIComponent(params.departure)}`);
      if (params?.arrival)   queryParts.push(`to=${encodeURIComponent(params.arrival)}`);
      if (params?.date)      queryParts.push(`date=${encodeURIComponent(params.date)}`);

      if (params?.tripType) {
        const backendTripType = params.tripType.replace('-', '_');
        queryParts.push(`trip_type=${encodeURIComponent(backendTripType)}`);
      }

      const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
      const response = await axios.get(`/api/flights${queryString}`);
      const flightList = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setFlights(flightList);
      setDiscountApplied(response.data?.discount_applied || null);
      setError(null);
    } catch {
      setError("Không thể tải danh sách chuyến bay. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySearch = (e) => {
    e?.preventDefault();
    if (!searchParams.departure || !searchParams.arrival) {
      alert("Vui lòng chọn cả điểm đi và điểm đến.");
      return;
    }
    if (searchParams.tripType === 'round-trip' && !searchParams.returnDate) {
      alert("Vui lòng chọn ngày về cho chuyến bay khứ hồi.");
      return;
    }
    setBookingStage('outbound');
    setOutboundFlight(null);
    localStorage.setItem("search_params", JSON.stringify(searchParams));
    
    // Cập nhật URLSearchParams
    const newParams = new URLSearchParams();
    if (searchParams.departure) newParams.set("from", searchParams.departure);
    if (searchParams.arrival) newParams.set("to", searchParams.arrival);
    if (searchParams.date) newParams.set("date", searchParams.date);
    if (searchParams.returnDate) newParams.set("returnDate", searchParams.returnDate);
    if (searchParams.tripType) newParams.set("trip_type", searchParams.tripType.replace('-', '_'));
    setUrlSearchParams(newParams);

    fetchFlights(searchParams);
  };

  const handleSwapAirports = () => {
    setSearchParams(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }));
  };

  const handleFilterChange = (newFilters) => {
    if (newFilters.clearAll) {
      setFilters({ sort: 'price_asc', times: [] });
      return;
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectFlight = (flight) => {
    // Nếu ở mode đổi chuyến
    if (rescheduleMode && rescheduleBooking) {
      setSelectedNewFlight(flight);
      // Tính phí đổi chuyến từ backend
      calculateReschedulefee(flight);
      return;
    }

    if (searchParams?.tripType === 'round-trip' && bookingStage === 'outbound') {
      // Đã chọn xong chiều đi, chuyển sang chiều về
      setOutboundFlight(flight);
      setBookingStage('return');
      
      // Load chuyến về
      const returnParams = {
        ...searchParams,
        departure: searchParams.arrival,
        arrival: searchParams.departure,
        date: searchParams.returnDate
      };
      setSearchParams(returnParams);
      fetchFlights(returnParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Đã chọn xong chiều về (hoặc là vé một chiều)
      if (searchParams?.tripType === 'round-trip') {
        localStorage.setItem('selected_flights', JSON.stringify([outboundFlight, flight]));
      } else {
        localStorage.setItem('selected_flights', JSON.stringify([flight]));
      }
      localStorage.removeItem('selected_flight'); // dọn dẹp biến cũ
      navigate('/seat-selection'); 
    }
  };

  const calculateReschedulefee = async (newFlight) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const res = await axios.post(
        `/api/bookings/${rescheduleBooking.id}/reschedule`,
        { new_flight_id: newFlight.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 'success') {
        setRescheduleData({
          oldBooking: rescheduleBooking,
          newFlight: newFlight,
          reschedule_fee: res.data.data.reschedule_fee,
          original_amount: res.data.data.original_amount,
        });
        setShowRescheduleModal(true);
      }
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRescheduleConfirm = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

      // Tính toán số tiền cần thanh toán (backend đã trả về chính xác số tiền ở trường reschedule_fee)
      const paymentAmount = rescheduleData.reschedule_fee;

      if (paymentAmount > 0) {
        // Cần thanh toán thêm
        localStorage.setItem('reschedule_payment_data', JSON.stringify({
          bookingId: rescheduleData.oldBooking.id,
          newFlightId: rescheduleData.newFlight.id,
          amount: paymentAmount,
          type: 'reschedule'
        }));
        navigate('/payment', { 
          state: { 
            amount: paymentAmount,
            bookingId: rescheduleData.oldBooking.id,
            newFlightId: rescheduleData.newFlight.id,
            type: 'reschedule'
          } 
        });
      } else {
        // Hoàn tiền hoặc không mất phí, gọi thẳng API thanh toán để nó tự xác nhận đổi vé
        const res = await axios.post(
          `/api/bookings/${rescheduleData.oldBooking.id}/pay-reschedule`,
          { 
            new_flight_id: rescheduleData.newFlight.id,
            payment_method: 'vnpay' // Mặc định vì số tiền = 0
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.status === 'success') {
          alert(`Đổi chuyến bay thành công!`);
          navigate('/my-bookings');
        }
      }
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
      setShowRescheduleModal(false);
    }
  };

  const getFilteredAndSortedFlights = () => {
    let result = Array.isArray(flights) ? [...flights] : [];

    // Lọc theo giờ bay
    if (filters.times?.length > 0) {
      result = result.filter(f => {
        const hour = new Date(f.departure_time).getHours();
        if (filters.times.includes('morning') && hour >= 0 && hour < 12) return true;
        if (filters.times.includes('afternoon') && hour >= 12 && hour < 18) return true;
        if (filters.times.includes('evening') && hour >= 18 && hour < 24) return true;
        return false;
      });
    }

    // Sắp xếp
    result.sort((a, b) => {
      if (filters.sort === 'price_asc') {
        const priceA = parseFloat(a.display_price || a.base_price);
        const priceB = parseFloat(b.display_price || b.base_price);
        return priceA - priceB;
      }
      if (filters.sort === 'time_asc') {
        return new Date(a.departure_time) - new Date(b.departure_time);
      }
      return 0;
    });

    return result;
  };

  const displayedFlights = getFilteredAndSortedFlights();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 pb-24 font-sans relative"
    >
      <Navbar />
      {/* Quầng sáng nền Ambient Glow mềm mại */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header Minimal + Quick Route Search Bar */}
      <header className="pt-24 pb-10 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* Quay lại trang chủ */}
        <div className="mb-6 -ml-3">
          <BackButton />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-50 text-blue-700 border border-blue-200/60">
              {searchParams?.tripType === 'round-trip' ? '🔄 Chuyến bay khứ hồi (Ưu đãi 10%)' : '✈ Chuyến bay một chiều'}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-blue-900 bg-clip-text text-transparent">
              {searchParams?.tripType === 'round-trip' 
                ? (bookingStage === 'outbound' ? '1. Chọn chuyến bay đi' : '2. Chọn chuyến bay về')
                : 'Tìm kiếm chuyến bay'}
            </h1>
            <p className="text-sm text-zinc-500 max-w-[65ch]">
              {searchParams?.departure && searchParams?.arrival 
                ? `Chặng bay hiện tại: ${searchParams.departure} ➔ ${searchParams.arrival} ${searchParams.date ? `• Ngày: ${searchParams.date}` : ''}`
                : 'Hiển thị các chuyến bay khả dụng. Bạn có thể chọn điểm đi và điểm đến bên dưới để lọc chính xác.'}
            </p>
          </div>

          {/* Route Badges */}
          {searchParams?.departure && searchParams?.arrival && (
            <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200/60 px-4 py-2 rounded-2xl text-blue-700 text-xs font-bold uppercase tracking-wider">
              <AirplaneTakeoff size={16} />
              <span>{searchParams.departure}</span>
              <span>➔</span>
              <AirplaneLanding size={16} />
              <span>{searchParams.arrival}</span>
            </div>
          )}
        </div>

        {/* Selected Outbound Banner (khi đang chọn chiều về) */}
        {bookingStage === 'return' && outboundFlight && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Chuyến bay đi đã chọn</div>
                <div className="text-sm font-bold text-zinc-900">
                  {outboundFlight.flight_number} • {outboundFlight.departure_airport?.code} ➔ {outboundFlight.arrival_airport?.code} ({new Date(outboundFlight.departure_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBookingStage('outbound');
                const origParams = {
                  ...searchParams,
                  departure: outboundFlight.departure_airport?.code,
                  arrival: outboundFlight.arrival_airport?.code,
                  date: searchParams.date
                };
                setSearchParams(origParams);
                fetchFlights(origParams);
              }}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              Chọn lại chiều đi
            </button>
          </div>
        )}

        {/* Quick Search & Filter Bar */}
        <form onSubmit={handleApplySearch} className="bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Hàng 1: Loại vé (Một chiều / Khứ hồi) */}
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <button
              type="button"
              onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way' }))}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                searchParams.tripType === 'one-way'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 bg-zinc-100'
              }`}
            >
              Một chiều
            </button>
            <button
              type="button"
              onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                searchParams.tripType === 'round-trip'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 bg-zinc-100'
              }`}
            >
              <span>Khứ hồi</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-extrabold">-10%</span>
            </button>
          </div>

          {/* Hàng 2: Form Chọn Tuyến và Ngày */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Điểm đi (4 cols) */}
            <div className="lg:col-span-3 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
              <AirplaneTakeoff size={18} className="text-blue-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-zinc-400">Điểm đi</label>
                <select 
                  value={searchParams.departure || ""}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, departure: e.target.value }))}
                  className="w-full bg-transparent text-sm font-semibold text-zinc-800 outline-none cursor-pointer"
                >
                  <option value="">Chọn điểm đi</option>
                  {(Array.isArray(airports) ? airports : []).map(ap => (
                    <option key={ap.id || ap.code} value={ap.code}>{ap.city} ({ap.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nút đảo chiều (1 col) */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <button 
                type="button" 
                onClick={handleSwapAirports}
                className="w-8 h-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-colors shadow-xs cursor-pointer"
                title="Đổi chiều"
              >
                <ArrowsLeftRight size={14} weight="bold" />
              </button>
            </div>

            {/* Điểm đến (3 cols) */}
            <div className="lg:col-span-3 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
              <MapPinLine size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-zinc-400">Điểm đến</label>
                <select 
                  value={searchParams.arrival || ""}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, arrival: e.target.value }))}
                  className="w-full bg-transparent text-sm font-semibold text-zinc-800 outline-none cursor-pointer"
                >
                  <option value="">Chọn điểm đến</option>
                  {(Array.isArray(airports) ? airports : []).map(ap => (
                    <option key={ap.id || ap.code} value={ap.code}>{ap.city} ({ap.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ngày đi / Ngày về (3 or 4 cols) */}
            <div className={`lg:col-span-3 grid ${searchParams.tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2">
                <CalendarBlank size={16} className="text-amber-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] uppercase font-bold text-zinc-400 truncate">Ngày đi</label>
                  <input 
                    type="date"
                    value={searchParams.date || ""}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-transparent text-xs font-semibold text-zinc-800 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {searchParams.tripType === 'round-trip' && (
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2">
                  <CalendarBlank size={16} className="text-indigo-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] uppercase font-bold text-zinc-400 truncate">Ngày về</label>
                    <input 
                      type="date"
                      value={searchParams.returnDate || ""}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                      min={searchParams.date || undefined}
                      className="w-full bg-transparent text-xs font-semibold text-zinc-800 outline-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Nút tìm kiếm (2 cols) */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full h-full min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <MagnifyingGlass size={16} weight="bold" />
                Tìm chuyến
              </button>
            </div>
          </div>
        </form>
      </header>

      {/* Main Layout: Flex container song song (cần items-start để aside sticky hoạt động) */}
      <main className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12 relative z-10">
        
        {/* Left: Sticky Filters */}
        <FlightFilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        {/* Right: Flight List */}
        <div className="flex-1 w-full">
          {/* Top Bar Summary */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200">
            <span className="text-sm font-medium text-zinc-500">
              Hiển thị <strong className="text-zinc-900">{displayedFlights.length}</strong> kết quả
            </span>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50 text-zinc-500">
              <MagnifyingGlass className="animate-pulse" size={32} />
              <p className="text-sm font-medium">Đang tìm chuyến bay...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : displayedFlights.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
              <AirplaneLanding size={48} weight="duotone" className="mb-4 opacity-50 text-blue-500 animate-bounce" />
              <p className="text-sm font-medium">Không tìm thấy chuyến bay nào phù hợp với bộ lọc.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6 w-full">
              {displayedFlights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight} 
                  onSelect={handleSelectFlight} 
                />
              ))}
            </ul>
          )}
        </div>

      </main>

      <div className="mt-20">
        <Footer />
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        data={rescheduleData}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleRescheduleConfirm}
      />
    </motion.div>
  );
}