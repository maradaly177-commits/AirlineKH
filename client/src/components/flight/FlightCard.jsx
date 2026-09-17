// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  SuitcaseRolling,
  Clock,
  ArrowsClockwise,
  CheckCircle,
  XCircle,
  Star,
  AirplaneTakeoff,
  AirplaneLanding
} from "@phosphor-icons/react";

// Real Airline Brand SVG Logos matching image
const VietnamAirlinesLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-[#00557B] flex items-center justify-center shadow-xs shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 6C20 6 22 13 25 15C28 17 34 18 34 18C34 18 28 20 25 23C22 26 20 34 20 34C20 34 18 26 15 23C12 20 6 18 6 18C6 18 12 17 15 15C18 13 20 6 20 6Z" fill="#F4B41A"/>
      <circle cx="20" cy="19" r="2.5" fill="#00557B"/>
    </svg>
  </div>
);

const VietjetLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-[#ED1B24] flex items-center justify-center shadow-xs shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M8 12L20 28L32 12" stroke="#FFF200" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="3" fill="#FFFFFF"/>
    </svg>
  </div>
);

const BambooAirwaysLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006633] to-[#009933] flex items-center justify-center shadow-xs shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M12 28C14 20 20 14 28 10C24 18 18 24 12 28Z" fill="#FFFFFF"/>
      <path d="M15 32C17 25 22 20 29 17C26 23 21 28 15 32Z" fill="#00AEEF"/>
    </svg>
  </div>
);

const SkyLinkLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs shrink-0 text-white font-black text-lg">
    ✈
  </div>
);

const AIRLINE_CONFIG = {
  VN: {
    name: "Vietnam Airlines",
    rating: "4.5 (2.3k đánh giá)",
    badgeTag: "Phổ biến",
    badgeColor: "bg-blue-600 text-white",
    logo: <VietnamAirlinesLogo />,
  },
  VJ: {
    name: "VietJet Air",
    rating: "4.0 (756 đánh giá)",
    badgeTag: null,
    badgeColor: "",
    logo: <VietjetLogo />,
  },
  QH: {
    name: "Bamboo Airways",
    rating: "4.1 (982 đánh giá)",
    badgeTag: "Bán chạy",
    badgeColor: "bg-amber-500 text-white",
    logo: <BambooAirwaysLogo />,
  },
  FB: {
    name: "Bamboo Airways",
    rating: "4.1 (982 đánh giá)",
    badgeTag: "Bán chạy",
    badgeColor: "bg-amber-500 text-white",
    logo: <BambooAirwaysLogo />,
  },
};

const DEFAULT_AIRLINE = {
  name: "SkyLink Airlines",
  rating: "4.2 (1.1k đánh giá)",
  badgeTag: "Giá tốt nhất",
  badgeColor: "bg-emerald-500 text-white",
  logo: <SkyLinkLogo />,
};

function getAirline(flightNumber = "") {
  const prefix = (flightNumber.match(/^[A-Za-z]+/) ?? [""])[0].toUpperCase();
  return AIRLINE_CONFIG[prefix] ?? DEFAULT_AIRLINE;
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function calcDuration(dep, arr) {
  const ms = new Date(arr) - new Date(dep);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}g ${m}p`;
}

export default function FlightCard({ flight, onSelect }) {
  const airline = getAirline(flight.flight_number);
  const durationLabel = calcDuration(flight.departure_time, flight.arrival_time);
  const depCode = flight.departure_airport?.code ?? flight.departure_airport_id ?? "---";
  const arrCode = flight.arrival_airport?.code ?? flight.arrival_airport_id ?? "---";
  const depCity = flight.departure_airport?.city ?? depCode;
  const arrCity = flight.arrival_airport?.city ?? arrCode;
  const aircraftModel = flight.aircraft?.model ?? "Airbus A320neo";
  const price = flight.display_price || flight.base_price;

  // Policies (Mocked dynamically for high fidelity UI)
  const isRefundable = flight.flight_number?.includes("VN") || flight.flight_number?.includes("SKY");

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="list-none w-full bg-white rounded-3xl border border-blue-100/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Badge Tag matching image */}
      {airline.badgeTag && (
        <div className="absolute top-0 left-0">
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-br-2xl inline-flex items-center gap-1 ${airline.badgeColor}`}>
            <span>⚙</span> {airline.badgeTag}
          </span>
        </div>
      )}

      {/* Top Right "Giá tốt nhất" Green Tag if applicable */}
      {flight.display_price && flight.display_price < flight.base_price && (
        <div className="absolute top-3 right-4">
          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
            🏷️ Giá tốt nhất
          </span>
        </div>
      )}

      <div className="p-6 pt-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Col 1: Airline Brand & Info (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center gap-3">
            {airline.logo}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{airline.name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{flight.flight_number}</p>
              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                <Star size={12} weight="fill" />
                <span>{airline.rating}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium space-x-2 pt-1">
            <span>✈ {aircraftModel}</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Bay thẳng</span>
          </div>
        </div>

        {/* Col 2: Flight Route & Times (4 cols) */}
        <div className="lg:col-span-4 flex items-center justify-between gap-3 px-2">
          
          {/* Departure */}
          <div className="text-center min-w-[75px]">
            <div className="text-2xl font-black text-slate-900 leading-none">{formatTime(flight.departure_time)}</div>
            <div className="text-xs font-extrabold text-slate-800 uppercase mt-1">{depCode}</div>
            <div className="text-[11px] text-slate-400 font-medium truncate max-w-[90px] mx-auto">{depCity}</div>
          </div>

          {/* Timeline center */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span>✈</span> {durationLabel}
            </span>
            <div className="w-full flex items-center gap-1">
              <div className="h-[2px] flex-1 bg-blue-100 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <span className="text-blue-500">✈</span>
              <div className="h-[2px] flex-1 bg-blue-100 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-[75px]">
            <div className="text-2xl font-black text-slate-900 leading-none">{formatTime(flight.arrival_time)}</div>
            <div className="text-xs font-extrabold text-slate-800 uppercase mt-1">{arrCode}</div>
            <div className="text-[11px] text-slate-400 font-medium truncate max-w-[90px] mx-auto">{arrCity}</div>
          </div>

        </div>

        {/* Col 3: Baggage & Fare Rules (2 cols) */}
        <div className="lg:col-span-2 text-[11px] space-y-1 text-slate-500 font-medium border-l border-slate-100 pl-4">
          <div className="flex items-center gap-1.5">
            <SuitcaseRolling size={14} className="text-slate-400 shrink-0" />
            <span>7kg xách tay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SuitcaseRolling size={14} className="text-slate-400 shrink-0" />
            <span>20kg ký gửi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowsClockwise size={14} className="text-slate-400 shrink-0" />
            <span>Đổi lịch: <strong>Có</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className={isRefundable ? "text-emerald-500 shrink-0" : "text-red-400 shrink-0"} />
            <span>Hoàn vé: <strong className={isRefundable ? "text-slate-700" : "text-red-500"}>{isRefundable ? "Có" : "Không"}</strong></span>
          </div>
        </div>

        {/* Col 4: Price & CTA Button (3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-end justify-center space-y-2 border-l border-slate-100 pl-4">
          <div className="text-right">
            <div className="text-2xl font-black text-blue-600 tracking-tight">{formatCurrency(price)}</div>
            <div className="text-[10px] text-slate-400 font-medium">Đã gồm thuế & phí</div>
          </div>
          
          <button
            type="button"
            onClick={() => onSelect(flight)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <span>Chọn chuyến bay</span>
            <span>➔</span>
          </button>
        </div>

      </div>
    </motion.li>
  );
}
