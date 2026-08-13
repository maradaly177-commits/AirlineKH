import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { AirplaneTakeoff, MapPinLine, CalendarBlank, ArrowsLeftRight, Users, PaperPlaneTilt, CaretLeft, CaretRight, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";

const MetricBadge = ({ text }) => (
  <div
    className="backdrop-blur-xl bg-white/20 border border-white/40 text-white px-5 md:px-6 py-2 md:py-3 rounded-full font-bold shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-xs md:text-sm whitespace-nowrap flex items-center justify-center"
  >
    {text}
  </div>
);

/**
 * HomePage Smart Component
 * Premium Light Theme, High Variance Layout, Modern Utility Classes.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const [airports, setAirports] = useState([]);
  const [searchData, setSearchData] = useState({
    departure: "",
    arrival: "",
    date: "",
    returnDate: "",
    tripType: "one-way",
    flightClass: "economy",
    passengers: { adults: 1, children: 0 }
  });
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);


  const handleUpdatePassengers = (type, change) => {
    setSearchData(prev => {
      const current = prev.passengers[type];
      const next = Math.max(0, current + change);
      if (type === 'adults' && next < 1) return prev;
      return {
        ...prev,
        passengers: {
          ...prev.passengers,
          [type]: next
        }
      };
    });
  };

  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }));
  };
// Fetch airports data on component mount
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/airports")
      .then(res => {
        console.log("API Airports:", res.data);
        setAirports(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    if (!searchData.departure || !searchData.arrival) {
      alert("Vui lòng chọn đầy đủ điểm đi và điểm đến.");
      return;
    }
    if (!searchData.date) {
      alert("Vui lòng chọn ngày đi.");
      return;
    }
    if (searchData.tripType === 'round-trip' && !searchData.returnDate) {
      alert("Vui lòng chọn ngày về.");
      return;
    }
    if (searchData.tripType === 'round-trip' && searchData.returnDate < searchData.date) {
      alert("Ngày về phải sau hoặc cùng ngày với ngày đi.");
      return;
    }
    localStorage.setItem("search_params", JSON.stringify(searchData));
    navigate("/flights");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-50 text-zinc-900 font-sans font-medium selection:bg-blue-500/20 selection:text-zinc-900"
    >
      
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 flex flex-col items-center w-full">
        {/* Background Image Area - Full Bleed Edge-to-Edge */}
        <div className="w-full h-[75vh] md:h-[85vh] overflow-hidden relative">
          <motion.img 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/hero-bg.png" 
            alt="Luxury airplane view at golden hour" 
            className="w-full h-full object-cover"
          />
          {/* Multi-layer gradient overlay for premium depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-transparent"></div>
          
          {/* Ambient glow orbs */}
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/30 via-amber-400/15 to-transparent blur-[180px] rounded-full pointer-events-none z-0 mix-blend-screen -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-500/10 via-blue-400/8 to-transparent blur-[160px] rounded-full pointer-events-none z-0 mix-blend-screen translate-x-1/4"></div>

          {/* SVG Flight Path Overlay */}
          <svg className="absolute bottom-0 left-0 w-3/4 h-3/4 pointer-events-none z-0 opacity-60" viewBox="0 0 800 600">
            <path 
              d="M -100,700 C 150,500 300,300 900,50" 
              stroke="rgba(255,255,255,0.25)" 
              strokeWidth="2" 
              strokeDasharray="8 12" 
              fill="none" 
            />
            <motion.path 
              d="M -100,700 C 150,500 300,300 900,50" 
              stroke="rgba(255,255,255,0.9)" 
              strokeWidth="3" 
              fill="none" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
            />
          </svg>
          
          <div className="absolute top-[28%] -translate-y-1/2 left-8 md:left-16 max-w-2xl text-white z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
              ✈ Hàng không 5 sao
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl">
              Khám phá thế giới <br/> với sự tĩnh lặng.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="text-lg md:text-xl text-white/85 font-medium max-w-[45ch] mb-10 drop-shadow-xl leading-relaxed">
              Trải nghiệm hàng không chuẩn 5 sao. Không ồn ào, không rườm rà. Chỉ có bạn và hành trình phía trước.
            </motion.p>
          </div>

          {/* Metric Badges */}
          <div className="absolute bottom-28 md:bottom-36 left-8 md:left-16 flex flex-wrap gap-4 md:gap-5 z-20">
            <MetricBadge text="✈️ 150+ Điểm đến" />
            <MetricBadge text="⭐ Đội bay 5 sao" />
          </div>
        </div>

        {/* Floating Search Card */}
        <div className="relative z-10 w-full max-w-5xl px-4 -mt-20 md:-mt-28">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-br from-blue-500/10 via-violet-500/6 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.5 }}
          className="relative w-full backdrop-blur-2xl bg-white/85 border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12),0_4px_20px_-4px_rgba(0,0,0,0.06)]"
        >
          {/* Search Panel Top Row: Toggles (Bento Search Engine) */}
          <div className="flex flex-wrap gap-4 mb-6 border-b border-zinc-100 pb-4 justify-between items-center relative z-20">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSearchData(prev => ({ ...prev, tripType: 'one-way' }))}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  searchData.tripType === 'one-way'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Một chiều
              </button>
              <button
                type="button"
                onClick={() => setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  searchData.tripType === 'round-trip'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Khứ hồi
              </button>
            </div>

            <div className="flex gap-4 items-center">
              {/* Passenger Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 bg-zinc-50 border border-zinc-200 transition-all cursor-pointer"
                >
                  <Users size={14} /> {searchData.passengers.adults + searchData.passengers.children} Khách
                </button>

                {showPassengerDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowPassengerDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200/60 rounded-2xl p-4 shadow-xl z-30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-zinc-900">Người lớn</div>
                            <div className="text-xs text-zinc-400">Từ 12 tuổi</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', -1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-zinc-900 w-4 text-center">{searchData.passengers.adults}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', 1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-zinc-900">Trẻ em</div>
                            <div className="text-xs text-zinc-400">Dưới 12 tuổi</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', -1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-zinc-900 w-4 text-center">{searchData.passengers.children}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', 1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative z-10">
            {/* Swap Button absolute positioned in between Departure (col 1) and Arrival (col 2) */}
            <div className="hidden md:flex absolute left-[23.5%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button 
                type="button"
                onClick={handleSwap}
                whileHover={{ scale: 1.15, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-colors"
                title="Đổi điểm đi/điểm đến"
              >
                <ArrowsLeftRight size={14} weight="bold" />
              </motion.button>
            </div>
            
            {/* Điểm đi */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <AirplaneTakeoff size={14} /> Khởi hành
              </label>
              <select 
                className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer transition-all"
                value={searchData.departure}
                onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
              >
                <option value="">Chọn điểm đi</option>
                {airports.map(ap => (
                  <option key={ap.id} value={ap.code}>{ap.city} ({ap.code})</option>
                ))}
              </select>
            </div>

            {/* Điểm đến */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPinLine size={14} /> Điểm đến
              </label>
              <select 
                className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer transition-all"
                value={searchData.arrival}
                onChange={(e) => setSearchData({...searchData, arrival: e.target.value})}
              >
                <option value="">Bạn muốn đến đâu?</option>
                {airports.map(ap => (
                  <option key={ap.id} value={ap.code}>{ap.city} ({ap.code})</option>
                ))}
              </select>
            </div>

            {/* Ngày đi & Ngày về */}
            <div className={`grid ${searchData.tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <CalendarBlank size={14} /> Ngày đi
                </label>
                <input 
                  type="text" 
                  placeholder="Chọn ngày đi"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                  className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-zinc-400"
                  value={searchData.date}
                  onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                  min={today}
                />
              </div>

              {searchData.tripType === 'round-trip' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <CalendarBlank size={14} /> Ngày về
                  </label>
                  <input 
                    type="text" 
                    placeholder="Chọn ngày về"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                    className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-zinc-400"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
                    min={searchData.date || today}
                  />
                </div>
              )}
            </div>

            {/* CTA */}
            <motion.button 
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(37,99,235,0.25)] hover:shadow-[0_12px_36px_rgb(37,99,235,0.4)] cursor-pointer shimmer-on-hover"
            >
              Tìm chuyến bay
            </motion.button>

          </div>
        </motion.div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS (Bento Grid Logic) */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-28">
        {/* Ambient glow behind destinations grid */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] bg-violet-500/4 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-5 border border-blue-200/50">
              🗺 Điểm đến nổi bật
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900">
              Khám phá Việt Nam cùng Skylink
            </h2>
            <p className="text-lg text-zinc-500 font-medium max-w-2xl leading-relaxed">
              Các đường bay hàng đầu đang được săn đón với mức giá cực kỳ ưu đãi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {/* Main Card (Span 2x2) */}
          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-2 md:row-span-2 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://static-images.vnncdn.net/files/publish/2022/7/15/ho-hoan-kiem-542.jpg?width=0&s=la9nEfwz2GW8QkJ5hoQ9VA" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Ha Noi"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {/* Micro Badge */}
            <div className="absolute top-6 left-6 backdrop-blur-md bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              🔥 Hot Route
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
              <h3 className="text-white text-3xl font-bold tracking-tight mb-1 drop-shadow-md">Hà Nội</h3>
              <p className="text-white/80 font-medium mb-4">Từ 599.000 VNĐ</p>
              <div className="overflow-hidden h-10 flex items-end">
              
              </div>
            </div>
          </motion.div>

          {/* Sub Card 1 (Span 2x1) */}
          <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-2 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Phu Quoc"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-2xl font-bold tracking-tight mb-1">Phú Quốc</h3>
              <div className="flex justify-between items-end">
                <p className="text-white/80 font-medium">Từ 899.000 VNĐ</p>
                
              </div>
            </div>
          </motion.div>

          {/* Sub Card 2 (Span 1x1) */}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-1 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Da Nang"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold tracking-tight mb-1">Đà Nẵng</h3>
              <p className="text-white/80 text-sm font-medium">Từ 499.000 VNĐ</p>
            </div>
          </motion.div>

          {/* Sub Card 3 (Span 1x1) */}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-1 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://haycafe.vn/wp-content/uploads/2022/01/Hinh-anh-Da-Lat-suong-mu.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Da Lat"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold tracking-tight mb-1">Đà Lạt</h3>
              <p className="text-white/80 text-sm font-medium">Từ 399.000 VNĐ</p>
            </div>
          </motion.div>

          {/* Sub Card 4 (Span 2x2) */}
          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-2 md:row-span-2 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://img6.thuthuatphanmem.vn/uploads/2022/02/09/anh-bia-dep-thanh-pho-ho-chi-minh_031024011.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Ho Chi Minh"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
              <h3 className="text-white text-3xl font-bold tracking-tight mb-1 drop-shadow-md">Hồ Chí Minh</h3>
              <p className="text-white/80 font-medium mb-4">Từ 799.000 VNĐ</p>
              <div className="overflow-hidden h-10 flex items-end">
                
              </div>
            </div>
          </motion.div>

          {/* Sub Card 5 (Span 2x1) */}
          <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-2 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Cat Ba"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-2xl font-bold tracking-tight mb-1">Cát Bà</h3>
              <div className="flex justify-between items-end">
                <p className="text-white/80 font-medium">Từ 850.000 VNĐ</p>
                </div>
            </div>
          </motion.div>

          {/* Sub Card 6 (Span 1x1) */}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-1 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://khoinguonsangtao.vn/wp-content/uploads/2022/11/hinh-anh-sapa.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Sapa"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold tracking-tight mb-1">Sapa</h3>
              <p className="text-white/80 text-sm font-medium">Từ 699.000 VNĐ</p>
            </div>
          </motion.div>

          {/* Sub Card 7 (Span 1x1) */}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative overflow-hidden group rounded-[2rem] md:col-span-1 md:row-span-1 shadow-md hover:shadow-2xl cursor-pointer transition-shadow duration-500">
            <img 
              src="https://anhdephd.vn/wp-content/uploads/2022/04/anh-hoi-an.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              alt="Hoi An"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold tracking-tight mb-1">Hội An</h3>
              <p className="text-white/80 text-sm font-medium">Từ 550.000 VNĐ</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ƯU ĐÃI ĐỘC QUYỀN */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6 border border-amber-200/50">
              🎁 Ưu đãi đặc biệt
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
              Ưu đãi mùa hè năm nay
            </h2>
            <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
              Nâng tầm trải nghiệm với mức giá không tưởng.
            </p>
          </div>

          {/* Grid 3 cột */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "🔥", tag: "Flash Sale", title: "Giảm 20% Hạng Thương Gia", desc: "Bay đẳng cấp, giá bất ngờ. Áp dụng cho mọi chuyến bay nội địa cuối tuần.", tagColor: "text-red-600 bg-red-50 border-red-100", accentBorder: "hover:border-red-200", link: "/promotions" },
              { emoji: "🎫", tag: "Voucher", title: "Tặng 30kg Hành Lý Miễn Phí", desc: "Tự do mang theo mọi thứ bạn cần với gói hành lý ký gửi hoàn toàn miễn phí.", tagColor: "text-blue-600 bg-blue-50 border-blue-100", accentBorder: "hover:border-blue-200", link: "/promotions" },
              { emoji: "💎", tag: "Member Exclusive", title: "SkyClub Nhận 2X Điểm", desc: "Nhân đôi dặm bay cho các thành viên đăng ký hạng Bạc trở lên.", tagColor: "text-purple-600 bg-purple-50 border-purple-100", accentBorder: "hover:border-purple-200", link: "/skyclub" },
            ].map((promo, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(promo.link)}
                className={`bg-white rounded-3xl border border-zinc-200/60 p-8 cursor-pointer group hover:shadow-xl transition-all duration-300 ${promo.accentBorder}`}
              >
                <div className="text-5xl mb-6">{promo.emoji}</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-5 ${promo.tagColor}`}>
                  {promo.tag}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-snug">{promo.title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">{promo.desc}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 group-hover:text-blue-600 transition-colors">
                  Nhận ưu đãi <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 6. DỊCH VỤ NỔI BẬT */}
      <section className="py-28 bg-zinc-50/50 border-y border-zinc-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200/50">
              ✨ Trải nghiệm cao cấp
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
              Dịch vụ đẳng cấp
            </h2>
            <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
              Mọi chi tiết đều được chăm chút để nâng tầm hành trình của bạn.
            </p>
          </div>

          {/* Grid 3 cột */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                emoji: "🍽️",
                title: "Suất ăn hạng nhất", 
                desc: "Thực đơn tinh tuyển theo mùa, chế biến bởi bếp trưởng danh tiếng quốc tế.", 
                link: "/services/meals", 
                btnText: "Xem thực đơn",
                features: ["Nước suối tinh khiết", "Bánh mỳ pate Hội An", "Cơm sườn nướng chuẩn vị"]
              },
              { 
                emoji: "🛋️",
                title: "Phòng chờ thương gia", 
                desc: "Không gian tĩnh lặng, đầy đủ tiện nghi đẳng cấp trước khi cất cánh.", 
                featured: true, 
                link: "/services", 
                btnText: "Khám phá ngay",
                features: ["Buffet ẩm thực Á-Âu", "Phòng tắm & Spa thư giãn", "Khu làm việc tĩnh lặng"]
              },
              { 
                emoji: "🧳",
                title: "Hành lý linh hoạt", 
                desc: "Các gói hành lý đa dạng, dễ dàng thêm bớt theo nhu cầu thực tế.", 
                link: "/services", 
                btnText: "Mua thêm hành lý",
                features: ["Mua 30kg ký gửi", "Ưu tiên nhận hành lý sớm", "Hỗ trợ đóng gói an toàn"]
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-xl
                  ${item.featured 
                    ? "border-2 border-blue-200 shadow-lg shadow-blue-500/5 relative" 
                    : "border border-zinc-200/60"
                  }
                `}
              >
                {item.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Phổ biến nhất
                  </div>
                )}

                <div className="text-5xl mb-6">{item.emoji}</div>
                
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Features inline */}
                <ul className="space-y-3 mb-8 flex-1">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
                      <CheckCircle weight="fill" className="text-emerald-500 w-4 h-4 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.link)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all
                    ${item.featured 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                    }
                  `}
                >
                  {item.btnText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE SKYLINK EXPERIENCE & FLEET INFO (Stretched Full-Bleed) */}
      <section className="w-full bg-zinc-950 text-white py-32 relative overflow-hidden border-t border-zinc-900">
        {/* Abstract Dark Theme Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-0"></div>
        
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          {/* Cột Trái: Text & Tech-Specs */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-widest mb-8 border border-white/10">
               Đội bay hiện đại nhất
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Trải nghiệm <br/><span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">vượt đỉnh mây.</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed tracking-tight mb-12 max-w-xl">
              Sở hữu đội bay thế hệ mới bao gồm Boeing 787 Dreamliner và Airbus A321neo. Skylink cam kết mang đến sự an toàn tuyệt đối, giảm thiểu tiếng ồn và không gian khoang khách siêu thực.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              <div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-2">150+</div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Điểm đến toàn cầu</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-2">4.2<span className="text-xl text-zinc-500 ml-1">năm</span></div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Độ tuổi trung bình</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-2">99<span className="text-xl text-zinc-500 ml-1">%</span></div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Đúng giờ xuất phát</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-2">5<span className="text-xl text-zinc-500 ml-1">sao</span></div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Chất lượng dịch vụ</div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Visual Frame Wide */}
          <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center">
            {/* Airplane Image floating effect - wider aspect ratio */}
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80" 
              className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
              alt="Skylink Dreamliner"
            />
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-zinc-200/60 bg-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <PaperPlaneTilt size={20} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-zinc-900">SKYLINK</span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-zinc-400 uppercase block -mt-1">Airlines</span>
              </div>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-zinc-500">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Về chúng tôi</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Điều khoản</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Bảo mật</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Liên hệ</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent mb-8"></div>
          <p className="text-sm text-zinc-400 font-medium text-center">
            © 2026 Skylink Aviation. Nâng tầm mọi chuyến đi.
          </p>
        </div>
      </footer>

    </motion.div>
  );
}