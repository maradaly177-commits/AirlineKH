import React, { useState } from "react";
import { AirplaneTilt, ArrowRight, CaretDown, CaretUp, Leaf } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const AIRPORT_CITY_MAP = {
  HAN: "Hà Nội",
  SGN: "TP. Hồ Chí Minh",
  DAD: "Đà Nẵng",
  PQC: "Phú Quốc",
  CXR: "Nha Trang",
  HPH: "Hải Phòng",
  VCA: "Cần Thơ",
  UIH: "Quy Nhơn",
  DLI: "Đà Lạt",
  HUI: "Huế",
  VCL: "Chu Lai",
  THD: "Thanh Hóa",
  VII: "Vinh",
  VDH: "Đồng Hới",
  PXU: "Pleiku",
  TNN: "Tuy Hòa",
  BMV: "Buôn Ma Thuột",
  VCS: "Côn Đảo",
  VDO: "Vân Đồn",
  VKG: "Rạch Giá",
  DIN: "Điện Biên",
  CAH: "Cà Mau",
};

const AirlineLogo = ({ airlineName, flightNumber }) => {
  const name = String(airlineName || "").toLowerCase();
  const num = String(flightNumber || "").toUpperCase();

  if (name.includes("vietnam") || num.includes("VN")) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#00557B] flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M20 6C20 6 22 13 25 15C28 17 34 18 34 18C34 18 28 20 25 23C22 26 20 34 20 34C20 34 18 26 15 23C12 20 6 18 6 18C6 18 12 17 15 15C18 13 20 6 20 6Z" fill="#F4B41A"/>
        </svg>
      </div>
    );
  }

  if (name.includes("vietjet") || num.includes("VJ")) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#ED1B24] flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M8 12L20 28L32 12" stroke="#FFF200" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  if (name.includes("bamboo") || num.includes("QH") || num.includes("FB")) {
    return (
      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#006633] to-[#009933] flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M12 28C14 20 20 14 28 10C24 18 18 24 12 28Z" fill="#FFFFFF"/>
          <path d="M15 32C17 25 22 20 29 17C26 23 21 28 15 32Z" fill="#00AEEF"/>
        </svg>
      </div>
    );
  }

  if (name.includes("vietravel") || num.includes("VU")) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#003B7A] flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M10 28L20 10L30 28H23L20 22L17 28H10Z" fill="#F4B41A"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-5 h-5 flex items-center justify-center text-blue-600 shrink-0">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transform -rotate-45">
        <path d="M22.4 2L2 10.3c-.6.2-.6.9 0 1.1l5.4 1.8 1.8 5.4c.2.6.9.6 1.1 0l8.3-20.4L22.4 2zM8.5 12.5L16 6.5l-4.5 7.5L8.5 12.5z" />
      </svg>
    </div>
  );
};

export const FlightCardMessage = ({ flight }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!flight) return null;

  // ============================================================
  // FLIGHT ID
  // ============================================================

  const flightId =
    flight.id ??
    flight.flight_id ??
    flight.flightId;

  // ============================================================
  // FLIGHT INFO
  // ============================================================

  const price =
    flight.base_price ??
    flight.fares?.economySaver?.price ??
    flight.price ??
    flight.basePrice ??
    0;

  const flightNumber =
    flight.flight_number ??
    flight.flightNumber ??
    flight.airline ??
    "SkyLink";

  const departureTime = flight.departure_time
    ? (
      flight.departure_time.includes(" ")
        ? flight.departure_time.split(" ")[1]?.slice(0, 5)
        : flight.departure_time
    )
    : flight.departureTime ?? "08:00";

  const arrivalTime = flight.arrival_time
    ? (
      flight.arrival_time.includes(" ")
        ? flight.arrival_time.split(" ")[1]?.slice(0, 5)
        : flight.arrival_time
    )
    : flight.arrivalTime ?? "09:55";

  const origin =
    flight.origin ??
    flight.fromCity ??
    flight.from ??
    flight.departure_airport?.code ??
    "HAN";

  const destination =
    flight.destination ??
    flight.toCity ??
    flight.to ??
    flight.arrival_airport?.code ??
    "SGN";

  // ============================================================
  // DURATION
  // ============================================================

  const computeDuration = () => {
    // Ưu tiên field duration_minutes từ backend
    if (flight.duration_minutes && flight.duration_minutes > 0) {
      const h = Math.floor(flight.duration_minutes / 60);
      const m = flight.duration_minutes % 60;
      return h > 0
        ? `${h}h${m > 0 ? ` ${m}m` : ""}`
        : `${m}m`;
    }

    // Tính từ departure_time và arrival_time
    if (flight.departure_time && flight.arrival_time) {
      try {
        const dep = new Date(
          flight.departure_time.includes("T")
            ? flight.departure_time
            : flight.departure_time.replace(" ", "T")
        );
        const arr = new Date(
          flight.arrival_time.includes("T")
            ? flight.arrival_time
            : flight.arrival_time.replace(" ", "T")
        );
        const diffMs = arr - dep;
        if (diffMs > 0) {
          const totalMin = Math.round(diffMs / 60000);
          const h = Math.floor(totalMin / 60);
          const m = totalMin % 60;
          return h > 0
            ? `${h}h${m > 0 ? ` ${m}m` : ""}`
            : `${m}m`;
        }
      } catch {
        // Fallback bên dưới
      }
    }

    // Fallback: field duration text cũ hoặc durationText
    return flight.duration ?? flight.durationText ?? null;
  };

  const durationLabel = computeDuration();

  // ============================================================
  // CHỌN GHẾ & ĐẶT VÉ
  // ============================================================

  const handleBookFlight = () => {
    if (!flightId) {
      console.error(
        "FlightCardMessage: Không tìm thấy flight ID",
        flight
      );
      return;
    }

    console.log("✈️ Chọn flight từ AI:", flight);

    const depCityName = flight.departure_airport?.city || AIRPORT_CITY_MAP[origin] || origin;
    const arrCityName = flight.arrival_airport?.city || AIRPORT_CITY_MAP[destination] || destination;

    const selectedFlight = {
      ...flight,

      // Chuẩn hóa các field mà SeatSelection có thể cần
      id: flightId,
      flight_number: flightNumber,
      origin: origin,
      destination: destination,
      departure_airport: { code: origin, city: depCityName },
      arrival_airport: { code: destination, city: arrCityName },
      departure_time: flight.departure_time ?? null,
      arrival_time: flight.arrival_time ?? null,
      base_price: price,
    };

    // Khởi tạo search_params mặc định nếu chưa có
    if (!localStorage.getItem("search_params")) {
      localStorage.setItem(
        "search_params",
        JSON.stringify({
          trip_type: "one_way",
          passengers: { adults: 1, children: 0, infants: 0 },
          seat_class: "economy",
        })
      );
    }

    // Chuyến bay được chọn từ AI
    localStorage.setItem(
      "selected_flights",
      JSON.stringify([selectedFlight])
    );

    // Xóa ghế cũ nếu user chọn flight mới
    localStorage.removeItem("selected_seats");

    // Đi thẳng tới màn hình chọn ghế
    navigate(
      `/seat-selection?flight_id=${encodeURIComponent(flightId)}`
    );
  };

  const resolveAirlineName = () => {
    if (flight.airline_name) return flight.airline_name;
    if (flight.airline && flight.airline !== "SkyLink") return flight.airline;
    
    const num = String(flightNumber || "").toUpperCase();
    if (num.includes("VJ")) return "Vietjet Air";
    if (num.includes("VN")) return "Vietnam Airlines";
    if (num.includes("QH") || num.includes("FB")) return "Bamboo Airways";
    if (num.includes("VU")) return "Vietravel Airlines";
    
    return "SkyLink Airline";
  };

  const airlineName = resolveAirlineName();

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-4 w-full flex flex-col font-sans select-none border-b last:border-b-0 border-slate-100 bg-white">
      
      {/* 1. Header: Logo + Operator name + Ticket class */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <AirlineLogo airlineName={airlineName} flightNumber={flightNumber} />
          <span className="text-[12.5px] font-bold text-slate-800 tracking-tight">
            {airlineName}
          </span>
        </div>
        <span className="text-[9.5px]/none font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-1 uppercase tracking-wider">
          Phổ thông
        </span>
      </div>

      {/* 2. Middle Row: Time HAN -> Line -> Time DAD */}
      <div className="grid grid-cols-[1fr_1.2fr_1fr] items-center gap-2 mb-4">
        {/* Departure */}
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold text-slate-800 tracking-tight leading-none">
            {departureTime}
          </span>
          <span className="text-[10px] font-bold text-slate-450 tracking-wider mt-1.5 uppercase">
            {origin}
          </span>
        </div>

        {/* Duration line */}
        <div className="flex flex-col items-center justify-center px-1">
          <span className="text-[9px] font-bold text-slate-400 leading-none mb-1">
            {durationLabel ?? "1h 20m"}
          </span>
          
          <div className="relative w-full flex items-center justify-center">
            {/* Horizontal line */}
            <div className="absolute inset-x-0 h-[1px] bg-slate-200"></div>
            {/* Center airplane icon */}
            <div className="relative bg-white px-1.5 text-slate-400">
              <AirplaneTilt size={11} weight="fill" className="transform rotate-90" />
            </div>
          </div>

          <span className="text-[9px] font-bold text-slate-400 leading-none mt-1">
            Bay thẳng
          </span>
        </div>

        {/* Arrival */}
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-slate-800 tracking-tight leading-none">
            {arrivalTime}
          </span>
          <span className="text-[10px] font-bold text-slate-450 tracking-wider mt-1.5 uppercase">
            {destination}
          </span>
        </div>
      </div>

      {/* 3. Footer Row: Price + Toggle Detail on left, "Chọn chuyến" button on right */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          {/* Price: Blue large bold text */}
          <span className="text-[15px] font-extrabold text-blue-600 leading-none tracking-tight">
            {new Intl.NumberFormat("vi-VN").format(price)} VND
          </span>
          {/* Detailed toggle link */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10.5px] font-bold text-blue-500 hover:text-blue-605 flex items-center gap-0.5 transition-colors cursor-pointer select-none leading-none mt-1"
          >
            <span>Chi tiết</span>
            {isExpanded ? <CaretUp size={11} weight="bold" /> : <CaretDown size={11} weight="bold" />}
          </button>
        </div>

        {/* Select button */}
        <button
          type="button"
          onClick={handleBookFlight}
          className="bg-blue-600 hover:bg-blue-750 active:scale-[0.98] text-white font-extrabold text-[12px] px-4.5 py-2.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(37,99,235,0.12)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.22)] flex items-center justify-center cursor-pointer select-none"
        >
          Chọn chuyến
        </button>
      </div>

      {/* 4. Expanded section for flight info */}
      {isExpanded && (
        <div 
          className="mt-3.5 pt-3.5 border-t border-dashed border-slate-100 flex flex-col gap-2.5"
        >
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center leading-normal">
            <span>Hãng bay: <strong className="text-slate-800 font-bold">{flight.airline ?? "SkyLink Airlines"}</strong></span>
            <span>Mã hiệu: <strong className="text-slate-800 font-bold">{flightNumber}</strong></span>
            <span>Ghế trống: <strong className="text-emerald-600 font-bold">12 ghế</strong></span>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 bg-slate-50/60 p-2 rounded-lg border border-slate-100/50">
            <span className="flex items-center gap-1">🌱 Tiết kiệm <strong>15% khí thải</strong></span>
            <span>Hành lý xách tay: <strong>7kg</strong></span>
          </div>
        </div>
      )}

    </div>
  );
};

export default FlightCardMessage;