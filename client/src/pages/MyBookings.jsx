import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AirplaneTilt,
  AirplaneTakeoff,
  AirplaneLanding,
  Ticket,
  CircleNotch,
  CalendarBlank,
  UserCircle,
  CurrencyCircleDollar,
  Clock,
  Armchair,
  Hash,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Funnel,
  Sparkle,
  ArrowRight
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";

// ─── Airline Config ─────────────────────────────────────────────────────────

const AIRLINE_CONFIG = {
  VN: {
    name: "Vietnam Airlines",
    badge: "bg-blue-600",
    text: "text-white",
    light: "bg-blue-50 text-blue-700 border-blue-200",
    accent: "from-blue-600 to-blue-400",
    dot: "bg-blue-600",
    logo: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
        <span className="text-amber-300 font-black text-xs tracking-tight">VNA</span>
      </div>
    ),
  },
  VJ: {
    name: "VietJet Air",
    badge: "bg-red-500",
    text: "text-white",
    light: "bg-red-50 text-red-700 border-red-200",
    accent: "from-red-600 to-red-400",
    dot: "bg-red-500",
    logo: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
        <span className="text-white font-black text-xs tracking-tight">VJA</span>
      </div>
    ),
  },
  FB: {
    name: "FlightBus",
    badge: "bg-violet-600",
    text: "text-white",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    accent: "from-violet-600 to-purple-400",
    dot: "bg-violet-500",
    logo: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-700 to-purple-500 flex items-center justify-center shadow-md shadow-violet-500/20 shrink-0">
        <span className="text-white font-black text-xs tracking-tight">FBS</span>
      </div>
    ),
  },
};

const DEFAULT_AIRLINE = {
  name: "SkyLink Airlines",
  badge: "bg-blue-600",
  text: "text-white",
  light: "bg-blue-50 text-blue-700 border-blue-200",
  accent: "from-blue-600 to-indigo-500",
  dot: "bg-blue-600",
  logo: (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
      <span className="text-white font-black text-xs tracking-wider">SKY</span>
    </div>
  ),
};

function getAirline(flightNumber = "") {
  const prefix = (flightNumber.match(/^[A-Za-z]+/) ?? [""])[0].toUpperCase();
  return AIRLINE_CONFIG[prefix] ?? DEFAULT_AIRLINE;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (d) =>
  new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const formatDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount) + " đ";

const calcDuration = (dep, arr) => {
  const ms = new Date(arr) - new Date(dep);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}g ${m}p`;
};

// ─── Status Helpers ───────────────────────────────────────────────────────────

const STATUS_STYLE = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  pending: "bg-amber-50 text-amber-700 border-amber-200/80",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const STATUS_TEXT = {
  paid: "✓ Đã thanh toán",
  pending: "⏳ Chờ thanh toán",
  cancelled: "✕ Đã hủy",
};

// ─── BookingCard Component ───────────────────────────────────────────────────

function BookingCard({ booking, idx }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const flight = booking.flight;
  const airline = getAirline(flight?.flight_number ?? "");
  const status = booking.status;

  const handleCopyPnr = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(booking.pnr_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCheckInStatus = () => {
    if (!flight || status !== "paid") {
      return { isOpen: false, label: "Làm thủ tục (Check-in)" };
    }
    const depTime = new Date(flight.departure_time).getTime();
    const now = new Date().getTime();
    const checkInOpenTime = depTime - 24 * 60 * 60 * 1000;
    const checkInCloseTime = depTime - 2 * 60 * 60 * 1000;

    if (now < checkInOpenTime) {
      return { isOpen: false, label: "Làm thủ tục (Chưa mở)" };
    } else if (now > checkInCloseTime) {
      return { isOpen: false, label: "Làm thủ tục (Đã đóng)" };
    } else {
      return { isOpen: true, label: "Làm thủ tục Check-in ngay" };
    }
  };

  const checkInStatus = getCheckInStatus();

  return (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.3 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Top Gradient Bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${airline.accent}`} />

      <div className="p-6 sm:p-7">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          
          {/* Left: Airline Branding */}
          <div className="flex items-center gap-3">
            {airline.logo}
            <div>
              <p className="text-base font-extrabold text-slate-900 leading-tight">
                {airline.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-0.5 font-mono">
                  <Hash size={12} weight="bold" /> {flight?.flight_number ?? "—"}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs font-semibold text-slate-400">
                  {flight?.aircraft?.model ?? "Airbus A320neo"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: PNR Code & Status Badge */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            {/* PNR Code Pill with Copy */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Mã PNR:</span>
              <strong className="font-mono text-sm font-black text-slate-900 tracking-wider">
                {booking.pnr_code}
              </strong>
              <button
                type="button"
                onClick={handleCopyPnr}
                title="Sao chép mã PNR"
                className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-0.5"
              >
                {copied ? <Check size={14} className="text-emerald-600 font-bold" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Status Pill */}
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
              {STATUS_TEXT[status] ?? status}
            </span>
          </div>
        </div>

        {/* Route Flight Timeline Banner */}
        <div className="bg-slate-50/80 rounded-2xl p-5 mb-5 border border-slate-100">
          <div className="flex items-center gap-4">
            
            {/* Departure Airport */}
            <div className="text-left min-w-[90px]">
              <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {formatTime(flight?.departure_time)}
              </div>
              <div className="text-xs font-black text-blue-600 uppercase tracking-wider mt-0.5">
                {flight?.departure_airport?.code ?? "—"}
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
                {flight?.departure_airport?.city ?? ""}
              </div>
            </div>

            {/* Flight Flight Graphic Line */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/70 shadow-2xs">
                <Clock size={12} weight="bold" />
                {flight ? calcDuration(flight.departure_time, flight.arrival_time) : "—"}
              </span>

              <div className="w-full flex items-center gap-2 my-1">
                <AirplaneTakeoff size={16} weight="fill" className="text-blue-600 shrink-0" />
                <div className="flex-1 h-0.5 bg-slate-200 rounded-full relative">
                  <div className="absolute inset-0 bg-blue-600/40 rounded-full" />
                </div>
                <AirplaneLanding size={16} weight="fill" className="text-blue-600 shrink-0" />
              </div>

              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Bay trực tiếp
              </span>
            </div>

            {/* Arrival Airport */}
            <div className="text-right min-w-[90px]">
              <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {formatTime(flight?.arrival_time)}
              </div>
              <div className="text-xs font-black text-blue-600 uppercase tracking-wider mt-0.5">
                {flight?.arrival_airport?.code ?? "—"}
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
                {flight?.arrival_airport?.city ?? ""}
              </div>
            </div>

          </div>

          {/* Departure Date Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/70 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <CalendarBlank size={14} weight="bold" className="text-blue-600" />
              Ngày khởi hành: {flight ? formatDate(flight.departure_time) : "—"}
            </span>

            {status === "pending" && booking.expires_at && (
              <CountdownTimer
                expiresAt={booking.expires_at}
                onExpire={() => window.location.reload()}
              />
            )}
          </div>
        </div>

        {/* Passenger & Price Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <UserCircle size={16} className="text-blue-600" weight="bold" />
              <span>{booking.tickets?.length ?? 0} hành khách</span>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              {expanded ? "Thu gọn ▲" : "Xem chi tiết vé ▼"}
            </button>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">Tổng cộng:</span>
            <span className="text-xl font-black text-blue-600 tracking-tight">
              {formatCurrency(booking.total_amount)}
            </span>
          </div>
        </div>

        {/* Expandable Tickets Details Drawer */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
                <p className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket size={14} weight="bold" className="text-blue-600" />
                  Danh sách vé & Ghế ngồi hành khách
                </p>

                {booking.tickets?.map((ticket, ti) => (
                  <div
                    key={ti}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs font-bold text-sm">
                        {ti + 1}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 uppercase">
                          {ticket.passenger_name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">
                          CCCD/Passport: {ticket.identity_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Seat Badge */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                        <Armchair size={15} weight="bold" className="text-blue-600" />
                        <span className="text-xs font-extrabold text-slate-900">
                          Ghế {ticket.seat?.seat_number ?? "N/A"}
                        </span>
                      </div>

                      {/* Ticket Code */}
                      <div className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 uppercase font-mono tracking-wider">
                        {ticket.ticket_code?.slice(0, 10)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">

          {/* Pay Now Button (For Pending Status) */}
          {status === "pending" && (
            <button
              type="button"
              onClick={() => navigate(`/payment-retry/${booking.id}`, { state: { booking } })}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              Thanh toán ngay <ArrowRight size={16} weight="bold" />
            </button>
          )}

          {/* Check-in Button (For Paid Status) */}
          {status === "paid" && (
            <button
              type="button"
              disabled={!checkInStatus.isOpen}
              onClick={() => navigate(`/check-in?pnr=${booking.pnr_code}`)}
              className={`w-full sm:flex-1 py-3.5 px-4 rounded-2xl text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                checkInStatus.isOpen
                  ? "text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 cursor-pointer"
                  : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <CheckCircle size={18} weight="bold" />
              {checkInStatus.label}
            </button>
          )}

          {/* Reschedule & Cancel Action Buttons */}
          {new Date() < new Date(flight?.departure_time) && status !== "cancelled" && (
            <>
              <button
                type="button"
                onClick={() => navigate('/search', { state: { rescheduleBooking: booking } })}
                className="py-3 px-4 rounded-2xl text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all duration-200 cursor-pointer"
              >
                Đổi chuyến bay
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Bạn có chắc chắn muốn hủy đặt vé này?")) return;
                  try {
                    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
                    const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (res.ok && data.status === "success") {
                      alert(data.message || "Hủy vé thành công");
                      window.location.reload();
                    } else {
                      alert(data.message || "Không thể hủy vé");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Lỗi khi kết nối tới máy chủ.");
                  }
                }}
                className="py-3 px-4 rounded-2xl text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all duration-200 cursor-pointer"
              >
                Hủy vé
              </button>
            </>
          )}

        </div>

      </div>
    </motion.div>
  );
}

// ─── Main MyBookings Page ──────────────────────────────────────────────────

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.status === "success") {
          const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setBookings(list);
        } else {
          setError(data.message || "Lỗi khi tải lịch sử vé.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // Filter Bookings by activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "paid") return b.status === "paid";
    if (activeTab === "pending") return b.status === "pending";
    if (activeTab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const getTabCount = (statusKey) => {
    if (statusKey === "all") return bookings.length;
    return bookings.filter((b) => b.status === statusKey).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pt-24 pb-20 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Hero Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Ticket size={22} weight="fill" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Chuyến bay của tôi
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-medium pl-1">
              Quản lý lịch sử đặt vé, làm thủ tục trực tuyến (Check-in) và chi tiết vé máy bay SkyLink.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs self-start md:self-auto">
            <Sparkle size={18} className="text-blue-600" weight="fill" />
            <span className="text-xs font-bold text-slate-700">
              Tổng số vé: <strong className="text-blue-600 font-black">{bookings.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "Tất cả chuyến bay" },
            { id: "paid", label: "Đã thanh toán" },
            { id: "pending", label: "Chờ thanh toán" },
            { id: "cancelled", label: "Đã hủy" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <CircleNotch size={38} className="animate-spin text-blue-600" />
            <p className="text-sm font-bold text-slate-500">Đang tải lịch sử đặt vé của bạn...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200 p-8 rounded-3xl text-center font-bold text-sm">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border border-slate-200/80 p-12 sm:p-16 rounded-3xl text-center shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <AirplaneTilt size={32} weight="fill" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              {activeTab === "all" ? "Chưa có chuyến bay nào" : "Không có vé phù hợp với bộ lọc"}
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto font-medium leading-relaxed">
              {activeTab === "all"
                ? "Bạn chưa thực hiện giao dịch đặt vé nào. Hãy bắt đầu tìm chuyến bay đầu tiên để nhận ưu đãi từ SkyLink!"
                : "Không tìm thấy vé nào thuộc danh mục này. Anh/chị có thể chuyển về tất cả chuyến bay."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md shadow-blue-500/25 transition-all duration-200 cursor-pointer active:scale-95 text-xs inline-flex items-center gap-2"
            >
              Tìm chuyến bay ngay <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, idx) => (
              <BookingCard key={booking.id} booking={booking} idx={idx} />
            ))}
          </div>
        )}

      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </motion.div>
  );
}

