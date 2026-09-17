import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  AirplaneTakeoff,
  MapPinLine,
  CalendarBlank,
  ArrowsLeftRight,
  Users,
  PaperPlaneTilt,
  ArrowRight,
  CheckCircle,
  Tag,
  Headset,
  ShieldCheck,
  ArrowsClockwise,
  Buildings,
  Compass,
  Car
} from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => { });
    }
  }, []);

  const [airports, setAirports] = useState([]);
  const [activeTab, setActiveTab] = useState("flights");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] bg-[#f8fafc] text-slate-900 font-sans font-medium selection:bg-blue-600 selection:text-white"
    >
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      {/* 2. HERO SECTION matching Genesis Model (Image 2) */}
      <section className="relative pt-16 flex flex-col items-center w-full">
        {/* Background Image / Video Area with Sunset Terminal Scenery */}
        <div
          className="w-full h-[78vh] md:h-[86vh] overflow-hidden relative bg-cover bg-center bg-slate-900"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Golden Sunset Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-black/40"></div>

          {/* Hero Typography Matching Model Image 2 */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 text-center text-white z-10 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white/95 text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-white/20 shadow-md"
            >
              <PaperPlaneTilt size={14} weight="fill" className="text-cyan-400" />
              YOUR JOURNEY BEGINS HERE <ArrowRight size={12} weight="bold" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-extrabold text-6xl md:text-8xl tracking-tight leading-none mb-3 drop-shadow-2xl text-white font-sans"
            >
              SkyLink
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-xl text-slate-200 font-medium max-w-xl mx-auto drop-shadow-md tracking-wide"
            >
              More than a destination, it's an experience.
            </motion.p>
          </div>
        </div>

        {/* 3. FLOATING SEARCH ENGINE CARD matching Image 2 */}
        <div className="relative z-20 w-full max-w-6xl px-4 -mt-36 md:-mt-44 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.4 }}
            className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.18)] border border-slate-200/80"
          >
            {/* Top Category Tabs matching Image 2 */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              
              {/* Category Icons */}
              <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                <button
                  type="button"
                  onClick={() => setActiveTab("flights")}
                  className={`flex items-center gap-2 pb-2 -mb-5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "flights"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent hover:text-slate-800"
                  }`}
                >
                  <AirplaneTakeoff size={18} weight="bold" />
                  <span>Flights</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hotels")}
                  className={`flex items-center gap-2 pb-2 -mb-5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "hotels"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent hover:text-slate-800"
                  }`}
                >
                  <Buildings size={18} />
                  <span>Hotels</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("experiences")}
                  className={`flex items-center gap-2 pb-2 -mb-5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "experiences"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent hover:text-slate-800"
                  }`}
                >
                  <Compass size={18} />
                  <span>Experiences</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("cars")}
                  className={`flex items-center gap-2 pb-2 -mb-5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "cars"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent hover:text-slate-800"
                  }`}
                >
                  <Car size={18} />
                  <span>Car Rental</span>
                </button>
              </div>

              {/* Trip Type Toggle Buttons matching Image 2 */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setSearchData(prev => ({ ...prev, tripType: "one-way" }))}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    searchData.tripType === "one-way"
                      ? "bg-[#12234e] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Một chiều
                </button>
                <button
                  type="button"
                  onClick={() => setSearchData(prev => ({ ...prev, tripType: "round-trip" }))}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    searchData.tripType === "round-trip"
                      ? "bg-[#12234e] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Khứ hồi
                </button>
              </div>

            </div>

            {/* Input Form Fields Grid matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Departure Input */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-3 hover:border-slate-300 transition-colors relative">
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">From</label>
                <div className="flex items-center gap-2">
                  <MapPinLine size={16} className="text-slate-400 shrink-0" />
                  <select
                    className={`w-full bg-transparent text-sm outline-none cursor-pointer appearance-none pr-4 ${
                      searchData.departure ? "font-bold text-slate-900" : "font-medium text-slate-400"
                    }`}
                    value={searchData.departure}
                    onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })}
                  >
                    <option value="">Chọn điểm đi</option>
                    {(Array.isArray(airports) ? airports : []).map(ap => (
                      <option key={ap.id || ap.code} value={ap.code} className="text-slate-900 font-medium">
                        {ap.city} ({ap.code}) - {ap.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button Icon */}
              <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-400 cursor-pointer transition-all transform hover:rotate-180"
                  title="Swap Departure & Arrival"
                >
                  <ArrowsLeftRight size={14} weight="bold" />
                </button>
              </div>

              {/* Arrival Input */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-3 hover:border-slate-300 transition-colors">
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">To</label>
                <div className="flex items-center gap-2">
                  <MapPinLine size={16} className="text-slate-400 shrink-0" />
                  <select
                    className={`w-full bg-transparent text-sm outline-none cursor-pointer appearance-none pr-4 ${
                      searchData.arrival ? "font-bold text-slate-900" : "font-medium text-slate-400"
                    }`}
                    value={searchData.arrival}
                    onChange={(e) => setSearchData({ ...searchData, arrival: e.target.value })}
                  >
                    <option value="">Bạn muốn đến đâu?</option>
                    {(Array.isArray(airports) ? airports : []).map(ap => (
                      <option key={ap.id || ap.code} value={ap.code} className="text-slate-900 font-medium">
                        {ap.city} ({ap.code}) - {ap.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Depart Date Input */}
              <div className={`${searchData.tripType === "round-trip" ? "md:col-span-2" : "md:col-span-5"} bg-slate-50 border border-slate-200/90 rounded-2xl p-3 hover:border-slate-300 transition-colors`}>
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Depart</label>
                <div className="flex items-center gap-2">
                  <CalendarBlank size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Chọn ngày đi"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                    min={today}
                  />
                </div>
              </div>

              {/* Return Date Input (Only visible when tripType is round-trip) */}
              {searchData.tripType === "round-trip" && (
                <div className="md:col-span-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-3 hover:border-slate-300 transition-colors">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Return</label>
                  <div className="flex items-center gap-2">
                    <CalendarBlank size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Chọn ngày về"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
                      value={searchData.returnDate}
                      onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                      min={searchData.date || today}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Form Row: Passengers + Search Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-4">
              
              {/* Passengers Picker */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-500" />
                    <span>Travelers: {searchData.passengers.adults + searchData.passengers.children} Passenger • Economy</span>
                  </div>
                  <span className="text-slate-400">˅</span>
                </button>

                {showPassengerDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowPassengerDropdown(false)} />
                    <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900">Adults</div>
                            <div className="text-xs text-slate-400">12+ years</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', -1)}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-400 text-slate-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{searchData.passengers.adults}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', 1)}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-400 text-slate-600 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900">Children</div>
                            <div className="text-xs text-slate-400">Under 12 years</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', -1)}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-400 text-slate-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{searchData.passengers.children}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', 1)}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-400 text-slate-600 transition-colors cursor-pointer font-bold"
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

              {/* Search Button matching Image 2 */}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto bg-[#172c60] hover:bg-[#11224d] active:bg-[#0c1839] text-white font-bold px-8 py-3 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Flights</span>
                <ArrowRight size={16} weight="bold" />
              </button>

            </div>

          </motion.div>
        </div>

        {/* 4. VALUE PROPOSITION FEATURE STRIP matching Image 2 */}
        <div className="w-full max-w-6xl px-6 mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Tag size={20} weight="fill" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Best Price Guarantee</h4>
                <p className="text-[11px] text-slate-500 font-medium">Find the best deals</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Headset size={20} weight="fill" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">24/7 Customer Support</h4>
                <p className="text-[11px] text-slate-500 font-medium">We're here to help</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <ShieldCheck size={20} weight="fill" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Secure Booking</h4>
                <p className="text-[11px] text-slate-500 font-medium">Your data is protected</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <ArrowsClockwise size={20} weight="bold" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Flexible Options</h4>
                <p className="text-[11px] text-slate-500 font-medium">Change with ease</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. POPULAR DESTINATIONS & EXCLUSIVE OFFERS GRID matching Image 2 */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Da Nang */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg group h-[340px] border border-slate-200/80 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop"
              alt="Đà Nẵng"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-white/30">
                Popular Destination
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
              <h3 className="text-2xl font-black">Đà Nẵng</h3>
              <p className="text-xs text-slate-300 font-medium">Việt Nam</p>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Từ</span>
                  <span className="text-lg font-black text-white">499.000đ <span className="text-xs font-medium text-slate-300">/Khứ hồi</span></span>
                </div>
                <button 
                  onClick={() => navigate("/flights")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Phu Quoc */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg group h-[340px] border border-slate-200/80 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?q=80&w=1000&auto=format&fit=crop"
              alt="Phú Quốc"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            
            <div className="absolute top-4 left-4">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-white/30">
                Best Deals
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
              <h3 className="text-2xl font-black">Phú Quốc</h3>
              <p className="text-xs text-slate-300 font-medium">Việt Nam</p>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Từ</span>
                  <span className="text-lg font-black text-white">649.000đ <span className="text-xs font-medium text-slate-300">/Khứ hồi</span></span>
                </div>
                <button 
                  onClick={() => navigate("/flights")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Exclusive Offers Banner Card matching Image 2 */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#122754] via-[#0f1f42] to-[#071026] h-[340px] border border-blue-900/40 p-6 flex flex-col justify-between text-white">
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-extrabold tracking-tight">Exclusive Offers</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Sign up and get up to <strong className="text-cyan-400 font-bold">20% OFF</strong> on your next booking.
              </p>
            </div>

            {/* Airplane illustration in background */}
            <div className="absolute right-0 bottom-10 opacity-25 pointer-events-none">
              <PaperPlaneTilt size={160} weight="fill" className="text-blue-400" />
            </div>

            <form onSubmit={handleNewsletter} className="space-y-2 relative z-10">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 outline-none focus:border-cyan-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                >
                  <PaperPlaneTilt size={18} weight="fill" />
                </button>
              </div>
              {newsletterSubscribed && (
                <p className="text-[11px] text-emerald-400 font-semibold">✓ Subscribed successfully!</p>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 6. PARTNER AIRLINES LOGO STRIP matching Image 2 */}
      <section className="border-t border-slate-200/80 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all text-xs font-black tracking-widest text-slate-700 uppercase">
            <span>EMIRATES</span>
            <span>QATAR AIRWAYS</span>
            <span>LUFTHANSA</span>
            <span>AIRFRANCE</span>
            <span>DELTA</span>
            <span>TURKISH AIRLINES</span>
            <span>BRITISH AIRWAYS</span>
            <span>SINGAPORE AIRLINES</span>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <Footer />
    </motion.div>
  );
}