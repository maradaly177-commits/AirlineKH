import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AirplaneTilt,
  AirplaneTakeoff,
  AirplaneLanding,
  Ticket,
  ArrowLeft,
  CircleNotch,
  CalendarBlank,
  UserCircle,
  CurrencyCircleDollar,
  Clock,
  Armchair,
  Hash,
} from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

// ─── Airline Config (mirrors FlightCard) ─────────────────────────────────────

const AIRLINE_CONFIG = {
  VN: {
    name: "Vietnam Airlines",
    badge: "bg-blue-600",
    text: "text-white",
    light: "bg-blue-50 text-blue-700 border-blue-200",
    accent: "from-blue-600 to-yellow-400",
    dot: "bg-blue-600",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
        <span className="text-yellow-300 font-black text-xs tracking-tight">VNA</span>
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
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center shadow-md shadow-red-500/20 flex-shrink-0">
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
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-700 to-purple-500 flex items-center justify-center shadow-md shadow-violet-500/20 flex-shrink-0">
        <span className="text-white font-black text-xs tracking-tight">FBS</span>
      </div>
    ),
  },
};

const DEFAULT_AIRLINE = {
  name: "SkyLink",
  badge: "bg-zinc-700",
  text: "text-white",
  light: "bg-zinc-100 text-zinc-700 border-zinc-200",
  accent: "from-zinc-700 to-zinc-500",
  dot: "bg-zinc-500",
  logo: (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-500 flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-white font-black text-xs">SKY</span>
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
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const calcDuration = (dep, arr) => {
  const ms = new Date(arr) - new Date(dep);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}g ${m}p`;
};

// ─── Status Helpers ───────────────────────────────────────────────────────────

const STATUS_STYLE = {
  paid:      "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};
const STATUS_TEXT = {
  paid:      "✓ Đã thanh toán",
  pending:   "⏳ Chờ thanh toán",
  cancelled: "✕ Đã hủy",
};

import CountdownTimer from "../components/CountdownTimer";

// ─── BookingCard ──────────────────────────────────────────────────────────────

function BookingCard({ booking, idx }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const flight = booking.flight;
  const airline = getAirline(flight?.flight_number ?? "");
  const status = booking.status;

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
      return { isOpen: true, label: "Làm thủ tục (Check-in)" };
    }
  };

  const checkInStatus = getCheckInStatus();

  return (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, type: "spring", stiffness: 340, damping: 28 }}
      className="bg-white rounded-[24px] border border-zinc-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)] overflow-hidden"
    >
      {/* Airline accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${airline.accent}`} />

      <div className="p-6">
        {/* ── Header Row ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          {/* Airline Identity */}
          <div className="flex items-center gap-3">
            {airline.logo}
            <div>
              <p className="text-sm font-black text-zinc-900">{airline.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <Hash size={9} weight="bold" />
                  {flight?.flight_number ?? "—"}
                </span>
                <span className="text-zinc-200">·</span>
                <span className="text-[10px] font-bold text-zinc-400">
                  {flight?.aircraft?.model ?? "A320neo"}
                </span>
              </div>
            </div>
          </div>

          {/* Status + PNR */}
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
              {STATUS_TEXT[status] ?? status}
            </span>
            {status === "pending" && booking.expires_at && (
              <CountdownTimer
                expiresAt={booking.expires_at}
                onExpire={() => window.location.reload()}
              />
            )}
            <span className="text-[10px] text-zinc-400 font-semibold">
              PNR: <span className="text-zinc-800 font-black tracking-widest">{booking.pnr_code}</span>
            </span>
          </div>
        </div>

        {/* ── Route Timeline ── */}
        <div className="bg-zinc-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="text-left min-w-[80px]">
              <div className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums">
                {formatTime(flight?.departure_time)}
              </div>
              <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                {flight?.departure_airport?.code ?? "—"}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {flight?.departure_airport?.city ?? ""}
              </div>
            </div>

            {/* Timeline Center */}
            <div className="flex-1 flex flex-col items-center gap-1 px-2">
              <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                <Clock size={11} weight="bold" />
                {flight ? calcDuration(flight.departure_time, flight.arrival_time) : "—"}
              </span>
              <div className="w-full flex items-center gap-1">
                <AirplaneTakeoff size={14} weight="fill" className="text-zinc-300 flex-shrink-0" />
                <div className={`flex-1 h-px bg-gradient-to-r ${airline.accent} opacity-50`} />
                <AirplaneLanding size={14} weight="fill" className="text-zinc-300 flex-shrink-0" />
              </div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Bay thẳng</span>
            </div>

            {/* Arrival */}
            <div className="text-right min-w-[80px]">
              <div className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums">
                {formatTime(flight?.arrival_time)}
              </div>
              <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                {flight?.arrival_airport?.code ?? "—"}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {flight?.arrival_airport?.city ?? ""}
              </div>
            </div>
          </div>

          {/* Date row */}
          <div className="flex items-center justify-center mt-3 pt-3 border-t border-zinc-200">
            <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5">
              <CalendarBlank size={12} weight="duotone" className="text-blue-500" />
              {flight ? formatDate(flight.departure_time) : "—"}
            </span>
          </div>
        </div>

        {/* ── Passengers Summary ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCircle size={16} className="text-zinc-400" weight="duotone" />
            <span className="text-xs text-zinc-500 font-semibold">
              {booking.tickets?.length ?? 0} hành khách
            </span>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors cursor-pointer ml-1"
            >
              {expanded ? "Thu gọn ▲" : "Xem chi tiết ▼"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <CurrencyCircleDollar size={16} className="text-emerald-500" weight="duotone" />
            <span className="text-base font-black text-zinc-900">
              {formatCurrency(booking.total_amount)}
            </span>
          </div>
        </div>

        {/* ── Expanded Tickets ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Ticket size={12} weight="duotone" className="text-blue-500" />
                  Chi tiết vé
                </p>

                {booking.tickets?.map((ticket, ti) => (
                  <motion.div
                    key={ti}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ti * 0.05 }}
                    className="flex items-center justify-between bg-zinc-50 rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <UserCircle size={18} weight="duotone" className="text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 uppercase">{ticket.passenger_name}</p>
                        <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                          CCCD: {ticket.identity_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Seat */}
                      <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <Armchair size={13} weight="duotone" className="text-blue-500" />
                        <span className="text-xs font-black text-zinc-800">
                          Ghế {ticket.seat?.seat_number ?? "N/A"}
                        </span>
                      </div>

                      {/* Ticket code */}
                      <div className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${airline.light} uppercase tracking-wider`}>
                        {ticket.ticket_code?.slice(0, 8)}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Flight detail recap */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {[
                    { label: "Hãng bay",    value: airline.name },
                    { label: "Số hiệu",     value: flight?.flight_number ?? "—" },
                    { label: "Máy bay",     value: flight?.aircraft?.model ?? "A320neo" },
                    { label: "Ngày đặt",    value: formatDate(booking.created_at) },
                  ].map((item) => (
                    <div key={item.label} className="bg-zinc-50 rounded-xl p-3">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-xs font-bold text-zinc-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pay button for pending ── */}
        {status === "pending" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/payment-retry/${booking.id}`, { state: { booking } })}
            className={`mt-4 w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r ${airline.accent} shadow-md cursor-pointer`}
          >
            Thanh toán ngay
          </motion.button>
        )}

        {/* ── Check-in button for paid bookings ── */}
        {status === "paid" && (
          <div className="flex flex-col w-full">
            <motion.button
              whileHover={checkInStatus.isOpen ? { scale: 1.01 } : {}}
              whileTap={checkInStatus.isOpen ? { scale: 0.98 } : {}}
              disabled={!checkInStatus.isOpen}
              onClick={() => navigate(`/check-in?pnr=${booking.pnr_code}`)}
              className={`mt-4 w-full py-3 rounded-2xl text-sm font-black text-center transition-all ${
                checkInStatus.isOpen
                  ? `text-white bg-gradient-to-r ${airline.accent} shadow-md cursor-pointer hover:shadow-lg`
                  : "bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
              }`}
            >
              {checkInStatus.label}
            </motion.button>
            {!checkInStatus.isOpen && (
              <p className="text-[10px] text-zinc-400 text-center mt-1.5 font-medium">
                * Check-in online mở từ 24 giờ đến 2 giờ trước giờ cất cánh
              </p>
            )}
          </div>
        )}

        {/* ── Self-service: Reschedule / Cancel (only if flight hasn't departed) ── */}
        {new Date() < new Date(flight?.departure_time) && status !== "cancelled" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                // Navigate to search page with booking state for rescheduling flow
                navigate('/search', { state: { rescheduleBooking: booking } });
              }}
              className="w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md cursor-pointer"
            >
              Đổi chuyến bay
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                if (!confirm('Bạn có chắc muốn hủy vé này?')) return;
                try {
                  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
                  const res = await fetch(`http://127.0.0.1:8000/api/bookings/${booking.id}/cancel`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (res.ok && data.status === 'success') {
                    alert(data.message || 'Hủy vé thành công');
                    window.location.reload();
                  } else {
                    alert(data.message || 'Không thể hủy vé: ' + (data.errors ? JSON.stringify(data.errors) : ''));
                  }
                } catch (err) {
                  console.error(err);
                  alert('Lỗi khi kết nối tới máy chủ.');
                }
              }}
              className="w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-md cursor-pointer"
            >
              Hủy vé
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── MyBookings Page ──────────────────────────────────────────────────────────

/**
 * MyBookings — Smart Container
 *
 * Hiển thị lịch sử đặt vé với đầy đủ thông tin:
 *  - Hãng bay (logo + màu sắc theo airline)
 *  - Số hiệu chuyến bay
 *  - Giờ cất cánh / hạ cánh
 *  - Ngày bay
 *  - Điểm đi → Điểm đến
 *  - Ghế từng hành khách
 *  - Tổng tiền
 */
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) { navigate("/login"); return; }

      try {
        const res  = await fetch("http://127.0.0.1:8000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setBookings(data.data);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-24 pt-24 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-8 -ml-3">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Lịch sử đặt vé
          </h1>
          <p className="text-zinc-500 font-medium">
            Quản lý và xem lại các hành trình của bạn cùng SkyLink.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <CircleNotch size={36} className="animate-spin text-blue-500" />
            <p className="text-sm font-semibold">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 border border-red-100 p-8 rounded-[24px] text-center font-semibold">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 p-16 rounded-[24px] text-center shadow-sm"
          >
            <AirplaneTilt size={56} weight="duotone" className="mx-auto text-zinc-300 mb-6" />
            <h3 className="text-xl font-black mb-3 text-zinc-900">Chưa có chuyến đi nào</h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-medium">
              Bạn chưa thực hiện bất kỳ giao dịch đặt vé nào. Hãy bắt đầu hành trình đầu tiên!
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg cursor-pointer"
            >
              Tìm chuyến bay ngay →
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking, idx) => (
              <BookingCard key={booking.id} booking={booking} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
