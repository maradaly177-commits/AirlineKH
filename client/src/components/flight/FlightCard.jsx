// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  AirplaneTilt,
  SuitcaseRolling,
  Clock,
  CalendarBlank,
  AirplaneLanding,
  AirplaneTakeoff,
} from "@phosphor-icons/react";

// Real Airline Brand SVG Logos
const VietnamAirlinesLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-[#00557B] flex items-center justify-center shadow-md shadow-blue-900/20 flex-shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6C20 6 22 13 25 15C28 17 34 18 34 18C34 18 28 20 25 23C22 26 20 34 20 34C20 34 18 26 15 23C12 20 6 18 6 18C6 18 12 17 15 15C18 13 20 6 20 6Z" fill="#F4B41A"/>
      <circle cx="20" cy="19" r="2.5" fill="#00557B"/>
    </svg>
  </div>
);

const VietjetLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-[#ED1B24] flex items-center justify-center shadow-md shadow-red-600/20 flex-shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L20 28L32 12" stroke="#FFF200" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="3" fill="#FFFFFF"/>
    </svg>
  </div>
);

const BambooAirwaysLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006633] to-[#009933] flex items-center justify-center shadow-md shadow-emerald-700/20 flex-shrink-0 p-1">
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 28C14 20 20 14 28 10C24 18 18 24 12 28Z" fill="#FFFFFF"/>
      <path d="M15 32C17 25 22 20 29 17C26 23 21 28 15 32Z" fill="#00AEEF"/>
    </svg>
  </div>
);

const SkyLinkFlightLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
    <AirplaneTilt size={20} weight="fill" className="text-white" />
  </div>
);

// ─── Airline Config ───────────────────────────────────────────────────────────
const AIRLINE_CONFIG = {
  VN: {
    name: "Vietnam Airlines",
    shortName: "VNA",
    badge: "bg-[#00557B]",
    badgeText: "text-white",
    accent: "from-[#00557B] to-yellow-500",
    accentSolid: "bg-[#00557B]",
    dot: "bg-blue-600",
    icon: "✈",
    logo: <VietnamAirlinesLogo />,
  },
  VJ: {
    name: "VietJet Air",
    shortName: "VJA",
    badge: "bg-[#ED1B24]",
    badgeText: "text-white",
    accent: "from-red-600 to-yellow-400",
    accentSolid: "bg-[#ED1B24]",
    dot: "bg-red-500",
    icon: "✈",
    logo: <VietjetLogo />,
  },
  QH: {
    name: "Bamboo Airways",
    shortName: "BAV",
    badge: "bg-[#006633]",
    badgeText: "text-white",
    accent: "from-[#006633] to-sky-400",
    accentSolid: "bg-[#006633]",
    dot: "bg-emerald-600",
    icon: "✈",
    logo: <BambooAirwaysLogo />,
  },
  FB: {
    name: "Bamboo Airways",
    shortName: "BAV",
    badge: "bg-[#006633]",
    badgeText: "text-white",
    accent: "from-[#006633] to-sky-400",
    accentSolid: "bg-[#006633]",
    dot: "bg-emerald-600",
    icon: "✈",
    logo: <BambooAirwaysLogo />,
  },
};

const DEFAULT_AIRLINE = {
  name: "SkyLink Airlines",
  shortName: "SKY",
  badge: "bg-blue-600",
  badgeText: "text-white",
  accent: "from-blue-600 to-indigo-600",
  accentSolid: "bg-blue-600",
  dot: "bg-blue-500",
  icon: "✈",
  logo: <SkyLinkFlightLogo />,
};

function getAirline(flightNumber = "") {
  // Extract leading letters only: "VN-201" → "VN", "VN813" → "VN", "FB-10" → "FB"
  const prefix = (flightNumber.match(/^[A-Za-z]+/) ?? [""])[0].toUpperCase();
  return AIRLINE_CONFIG[prefix] ?? DEFAULT_AIRLINE;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function calcDuration(dep, arr) {
  const ms = new Date(arr) - new Date(dep);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return { h, m, label: `${h}g ${m}p` };
}

// ─── Discount Badge ───────────────────────────────────────────────────────────

function DiscountBadge({ basePrice, displayPrice }) {
  if (!displayPrice || displayPrice >= basePrice) return null;
  const pct = Math.round(((basePrice - displayPrice) / basePrice) * 100);
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-emerald-500/15 text-emerald-600 border border-emerald-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
      -{pct}%
    </span>
  );
}

// ─── FlightCard ───────────────────────────────────────────────────────────────

/**
 * FlightCard — Premium Presentational Component
 *
 * Layout (Desktop): [Departure] [Timeline] [Arrival] | [Flight Meta] | [Price + CTA]
 * Layout (Mobile):  Stacked rows with full readability
 *
 * Props consumed (all from API, read-only — zero backend changes):
 *   flight.departure_time       — ISO datetime
 *   flight.arrival_time         — ISO datetime
 *   flight.departure_airport    — { code } | null
 *   flight.arrival_airport      — { code } | null
 *   flight.departure_airport_id — fallback code
 *   flight.arrival_airport_id   — fallback code
 *   flight.flight_number        — e.g. "VN-201"
 *   flight.aircraft             — { model } | null
 *   flight.base_price           — number
 *   flight.display_price        — number | null
 */
export default function FlightCard({ flight, onSelect }) {
  const airline = getAirline(flight.flight_number);
  const duration = calcDuration(flight.departure_time, flight.arrival_time);
  const depCode = flight.departure_airport?.code ?? flight.departure_airport_id ?? "---";
  const arrCode = flight.arrival_airport?.code ?? flight.arrival_airport_id ?? "---";
  const depCity = flight.departure_airport?.city ?? depCode;
  const arrCity = flight.arrival_airport?.city ?? arrCode;
  const aircraftModel = flight.aircraft?.model ?? "A320neo";
  const price = flight.display_price || flight.base_price;
  const hasDiscount = flight.display_price && flight.display_price < flight.base_price;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      whileHover={{ y: -3, boxShadow: "0 20px 60px -12px rgba(0,0,0,0.13)" }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        default: { type: "spring", stiffness: 380, damping: 28 },
      }}
      className="list-none w-full bg-white/90 backdrop-blur-sm rounded-[24px] border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden cursor-default hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500"
    >
      {/* ── Top accent bar (airline color) ── */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${airline.accent}`} />

      <div className="p-5 md:p-6">

        {/* ══ DESKTOP LAYOUT ══════════════════════════════════════════════════ */}
        <div className="hidden md:flex items-stretch gap-0">

          {/* ── Col 1: Airline identity ── */}
          <div className="flex flex-col justify-center gap-2 pr-5 w-[160px] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {airline.logo}
              <div>
                <p className="text-xs font-black text-zinc-800 leading-tight">{airline.name}</p>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{flight.flight_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${airline.dot}`} />
              <span className="text-[10px] text-zinc-400 font-semibold">{aircraftModel}</span>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-px bg-zinc-100 mx-1" />

          {/* ── Col 2: Route & Timeline ── */}
          <div className="flex-1 flex items-center gap-4 px-6">

            {/* Departure */}
            <div className="text-center">
              <div className="text-3xl font-black tracking-tight text-zinc-900 tabular-nums">
                {formatTime(flight.departure_time)}
              </div>
              <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-1">{depCode}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[80px]">{depCity}</div>
            </div>

            {/* Timeline */}
            <div className="flex-1 flex flex-col items-center gap-1.5 px-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                <Clock size={12} weight="bold" />
                {duration.label}
              </div>
              <div className="w-full flex items-center gap-1">
                <AirplaneTakeoff size={14} className="text-zinc-300 flex-shrink-0" weight="fill" />
                <div className="flex-1 relative h-px bg-zinc-200">
                  <div className={`absolute inset-0 bg-gradient-to-r ${airline.accent} opacity-60`} />
                  <motion.div
                    className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
                    animate={{ x: ["-30%", "30%", "-30%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AirplaneTilt size={14} weight="fill" className="text-blue-500 rotate-90" />
                  </motion.div>
                </div>
                <AirplaneLanding size={14} className="text-zinc-300 flex-shrink-0" weight="fill" />
              </div>
              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Bay thẳng</div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-3xl font-black tracking-tight text-zinc-900 tabular-nums">
                {formatTime(flight.arrival_time)}
              </div>
              <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-1">{arrCode}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[80px]">{arrCity}</div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-px bg-zinc-100 mx-1" />

          {/* ── Col 3: Metadata ── */}
          <div className="flex flex-col justify-center gap-2.5 px-5 w-[170px] flex-shrink-0">
            <MetaRow icon={<CalendarBlank size={13} weight="duotone" className="text-blue-500" />} label="Ngày bay" value={formatDate(flight.departure_time)} />
            <MetaRow icon={<SuitcaseRolling size={13} weight="duotone" className="text-blue-500" />} label="Hành lý" value="20kg ký gửi" />
            <MetaRow icon={<span className="text-[11px]">🛩</span>} label="Máy bay" value={aircraftModel} />
          </div>

          {/* ── Divider ── */}
          <div className="w-px bg-zinc-100 mx-1" />

          {/* ── Col 4: Price + CTA ── */}
          <div className="flex flex-col items-end justify-center pl-5 w-[200px] flex-shrink-0">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Giá / khách</div>

            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-zinc-400 line-through">{formatCurrency(flight.base_price)}</span>
                <DiscountBadge basePrice={flight.base_price} displayPrice={flight.display_price} />
              </div>
            )}

            <div className={`text-[28px] font-black tracking-tight leading-none mb-1 ${hasDiscount ? "text-emerald-600" : "text-zinc-900"}`}>
              {formatCurrency(price)}
            </div>
            <div className="text-[10px] text-zinc-400 mb-4">Đã gồm thuế & phí</div>

            <motion.button
              onClick={() => onSelect(flight)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center justify-center whitespace-nowrap px-6 py-3 rounded-xl text-sm font-black text-white bg-gradient-to-r ${airline.accent} shadow-lg hover:shadow-xl transition-all cursor-pointer outline-none shimmer-on-hover`}
            >
              Chọn chuyến bay
            </motion.button>
          </div>
        </div>

        {/* ══ MOBILE LAYOUT ═══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* Row 1: Airline + Flight number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {airline.logo}
              <div>
                <p className="text-xs font-black text-zinc-800">{airline.name}</p>
                <p className="text-[10px] text-zinc-400 font-semibold">{flight.flight_number} · {aircraftModel}</p>
              </div>
            </div>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${airline.badge} ${airline.badgeText}`}>
              {airline.shortName}
            </span>
          </div>

          {/* Row 2: Route timeline */}
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="text-left">
              <div className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums">{formatTime(flight.departure_time)}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">{depCode}</div>
            </div>

            {/* Center line */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Clock size={11} weight="bold" />{duration.label}</span>
              <div className="w-full h-px bg-zinc-200 relative">
                <AirplaneTilt size={14} weight="fill" className="text-blue-500 rotate-90 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2" />
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Bay thẳng</span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums">{formatTime(flight.arrival_time)}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">{arrCode}</div>
            </div>
          </div>

          {/* Row 3: Meta chips */}
          <div className="flex flex-wrap gap-2">
            <MetaChip icon="📅" value={formatDate(flight.departure_time)} />
            <MetaChip icon="🧳" value="20kg ký gửi" />
            <MetaChip icon="🛩" value={aircraftModel} />
          </div>

          {/* Row 4: Price + CTA */}
          <div className="flex items-end justify-between pt-2 border-t border-zinc-100">
            <div>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Giá / khách</div>
              {hasDiscount && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-zinc-400 line-through">{formatCurrency(flight.base_price)}</span>
                  <DiscountBadge basePrice={flight.base_price} displayPrice={flight.display_price} />
                </div>
              )}
              <div className={`text-2xl font-black tracking-tight ${hasDiscount ? "text-emerald-600" : "text-zinc-900"}`}>
                {formatCurrency(price)}
              </div>
              <div className="text-[9px] text-zinc-400">Đã gồm thuế & phí</div>
            </div>

            <motion.button
              onClick={() => onSelect(flight)}
              whileTap={{ scale: 0.96 }}
              className={`py-3 px-6 rounded-2xl text-sm font-black text-white bg-gradient-to-r ${airline.accent} shadow-md cursor-pointer outline-none`}
            >
              Chọn bay
            </motion.button>
          </div>
        </div>

      </div>
    </motion.li>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{label}</div>
        <div className="text-[11px] font-bold text-zinc-700 mt-0.5 truncate">{value}</div>
      </div>
    </div>
  );
}

function MetaChip({ icon, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-full px-2.5 py-1">
      <span>{icon}</span>
      {value}
    </span>
  );
}
