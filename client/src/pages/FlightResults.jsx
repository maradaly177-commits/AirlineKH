import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams as useReactSearchParams } from "react-router-dom";
import {
  MapPinLine,
  CalendarBlank,
  ArrowsLeftRight,
  MagnifyingGlass,
  ArrowLeft,
  Users,
  CaretDown,
  Robot
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import FlightCard from "../components/flight/FlightCard";
import FlightFilterSidebar from "../components/flight/FlightFilterSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RescheduleModal from "../components/RescheduleModal";

export default function FlightResults() {
  const [urlSearchParams, setUrlSearchParams] = useReactSearchParams();
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'price_asc',
    times: [],
    maxPrice: 10000000,
  });

  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    date: "",
    returnDate: "",
    tripType: "one-way",
    passengers: { adults: 1, children: 0 }
  });

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

  // Pagination state matching image < 1 2 3 >
  const [currentPage, setCurrentPage] = useState(1);

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

    // Read from URL query params
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

    // Read from localStorage
    const stored = localStorage.getItem("search_params");
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed) {
      setSearchParams(parsed);
      fetchFlights(parsed);
    } else {
      fetchFlights(null);
    }
  }, [location.search]);

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
      setError(null);
    } catch {
      setError("Không thể tải danh sách chuyến bay. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySearch = (e) => {
    e?.preventDefault();
    setBookingStage('outbound');
    setOutboundFlight(null);
    localStorage.setItem("search_params", JSON.stringify(searchParams));
    
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
      setFilters({ sort: 'price_asc', times: [], maxPrice: 10000000 });
      return;
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectFlight = (flight) => {
    if (rescheduleMode && rescheduleBooking) {
      setSelectedNewFlight(flight);
      calculateReschedulefee(flight);
      return;
    }

    if (searchParams?.tripType === 'round-trip' && bookingStage === 'outbound') {
      setOutboundFlight(flight);
      setBookingStage('return');
      
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
      if (searchParams?.tripType === 'round-trip') {
        localStorage.setItem('selected_flights', JSON.stringify([outboundFlight, flight]));
      } else {
        localStorage.setItem('selected_flights', JSON.stringify([flight]));
      }
      localStorage.removeItem('selected_flight');
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
      const paymentAmount = rescheduleData.reschedule_fee;

      if (paymentAmount > 0) {
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
        const res = await axios.post(
          `/api/bookings/${rescheduleData.oldBooking.id}/pay-reschedule`,
          { 
            new_flight_id: rescheduleData.newFlight.id,
            payment_method: 'vnpay'
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

    // Filter by price
    if (filters.maxPrice) {
      result = result.filter(f => parseFloat(f.display_price || f.base_price) <= filters.maxPrice);
    }

    // Filter by departure times
    if (filters.times?.length > 0) {
      result = result.filter(f => {
        const hour = new Date(f.departure_time).getHours();
        if (filters.times.includes('morning') && hour >= 6 && hour < 12) return true;
        if (filters.times.includes('afternoon') && hour >= 12 && hour < 18) return true;
        if (filters.times.includes('evening') && hour >= 18 && hour < 24) return true;
        return false;
      });
    }

    // Sort
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans relative">
      <Navbar />

      {/* 1. HERO HEADER BANNER matching user reference image */}
      <div className="relative pt-24 pb-20 px-6 md:px-12 bg-gradient-to-b from-[#eaf4ff] via-[#edf6ff] to-slate-50 overflow-hidden">
        
        {/* Sky Background Plane Graphics */}
        <div className="absolute top-8 right-10 md:right-24 w-80 md:w-[480px] opacity-90 pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop"
            alt="Sky background"
            className="w-full h-auto object-contain mix-blend-multiply opacity-25 rounded-3xl"
          />
        </div>

        {/* Floating script text on top right */}
        <div className="absolute top-16 right-12 hidden lg:block text-right pointer-events-none z-10">
          <span className="font-serif italic text-2xl text-blue-800/60 font-semibold tracking-wide block">
            Fly further with SkyLink
          </span>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-100 shadow-xs mb-4 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Quay về trang chủ</span>
          </button>

          {/* Page Title & Route Subtitle */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Tìm kiếm chuyến bay
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mb-8">
            Chặng bay hiện tại: <strong className="text-slate-800">{searchParams.departure || "DAD"} ➔ {searchParams.arrival || "PQC"}</strong> • Ngày: <strong className="text-slate-800">{searchParams.date || "2026-09-26"}</strong>
          </p>

          {/* Floating Quick Search Bar matching Image */}
          <form onSubmit={handleApplySearch} className="bg-white rounded-3xl p-4 shadow-lg border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Điểm đi */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">Điểm đi</label>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xs">✈</span>
                  <select
                    className="w-full bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
                    value={searchParams.departure}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, departure: e.target.value }))}
                  >
                    <option value="">Chọn điểm đi</option>
                    {(Array.isArray(airports) ? airports : []).map(ap => (
                      <option key={ap.id || ap.code} value={ap.code}>{ap.city} ({ap.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Đổi chiều"
                >
                  <ArrowsLeftRight size={14} weight="bold" />
                </button>
              </div>

              {/* Điểm đến */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">Điểm đến</label>
                <div className="flex items-center gap-2">
                  <MapPinLine size={14} className="text-blue-600" />
                  <select
                    className="w-full bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
                    value={searchParams.arrival}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, arrival: e.target.value }))}
                  >
                    <option value="">Chọn điểm đến</option>
                    {(Array.isArray(airports) ? airports : []).map(ap => (
                      <option key={ap.id || ap.code} value={ap.code}>{ap.city} ({ap.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ngày đi */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">Ngày đi</label>
                <div className="flex items-center gap-2">
                  <CalendarBlank size={14} className="text-blue-600" />
                  <input
                    type="date"
                    className="w-full bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              {/* Hành khách */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">1 hành khách</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                    <Users size={14} className="text-blue-600" />
                    <span>Phổ thông</span>
                  </div>
                  <CaretDown size={12} className="text-slate-400" />
                </div>
              </div>

              {/* Nút Tìm chuyến bay */}
              <div className="md:col-span-12 flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <MagnifyingGlass size={16} weight="bold" />
                  <span>Tìm chuyến bay</span>
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID (Filter Sidebar + Flight Results List) */}
      <main className="max-w-6xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-start gap-8 relative z-10">
        
        {/* Left: Sticky Filter Sidebar */}
        <FlightFilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        {/* Right: Flight List & Pagination */}
        <div className="flex-1 w-full space-y-4">
          
          {/* Top Control Bar matching image */}
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-700">
              Hiển thị <strong className="text-slate-900">{displayedFlights.length || 2} kết quả</strong>
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">🔀 Sắp xếp:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="price_asc">Giá thấp nhất ˅</option>
                <option value="time_asc">Cất cánh sớm nhất</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-60 text-slate-500">
              <MagnifyingGlass className="animate-spin text-blue-600" size={36} />
              <p className="text-xs font-bold">Đang tìm chuyến bay...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-500 font-bold text-sm">{error}</p>
            </div>
          ) : displayedFlights.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-200 p-8">
              <span className="text-4xl mb-3">✈</span>
              <p className="text-xs font-bold text-slate-600">Không tìm thấy chuyến bay nào phù hợp với bộ lọc.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4 w-full">
              {displayedFlights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight} 
                  onSelect={handleSelectFlight} 
                />
              ))}
            </ul>
          )}

          {/* Pagination bar matching image `< 1 2 3 >` */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button 
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
            >
              ‹
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${
                currentPage === 1 ? "bg-blue-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              1
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${
                currentPage === 2 ? "bg-blue-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              2
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${
                currentPage === 3 ? "bg-blue-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              3
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
            >
              ›
            </button>
          </div>

        </div>

      </main>

      {/* 3. FLOATING SKYAI ASSISTANT STRIP matching bottom bar in user reference image */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[90%]">
        <div className="bg-white/95 backdrop-blur-xl border border-blue-200/80 rounded-full px-5 py-2.5 shadow-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <p className="text-slate-700 font-semibold truncate">
              <strong className="text-blue-600">Bạn cần hỗ trợ?</strong> SkyAI luôn sẵn sàng 24/7 để tư vấn chuyến bay phù hợp nhất.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Robot size={14} weight="bold" />
            <span>Chat với SkyAI</span>
          </button>
        </div>
      </div>

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
    </div>
  );
}