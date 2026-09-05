import React, { useState } from "react";
import { AirplaneTilt, ArrowRight, CaretDown, CaretUp, Leaf } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

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

    /*
     * SeatSelection hiện tại đọc selected_flights
     * nên phải lưu flight vào localStorage trước.
     *
     * Quan trọng:
     * Không gửi message ngược lại cho AI.
     * Không yêu cầu AI đặt vé.
     * User được đưa thẳng tới SeatSelection.
     */

    const selectedFlight = {
      ...flight,

      // Chuẩn hóa các field mà SeatSelection có thể cần
      id: flightId,
      flight_number: flightNumber,
      origin: origin,
      destination: destination,
      departure_airport: { code: origin },
      arrival_airport: { code: destination },
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-4 w-full flex flex-col font-sans select-none border-b last:border-b-0 border-slate-100 bg-white">
      
      {/* 1. Header: Logo + Operator name + Ticket class */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          {/* Blue solid paper plane logo like Vietnam Airlines/mockup */}
          <div className="w-5 h-5 flex items-center justify-center text-blue-600 shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transform -rotate-45">
              <path d="M22.4 2L2 10.3c-.6.2-.6.9 0 1.1l5.4 1.8 1.8 5.4c.2.6.9.6 1.1 0l8.3-20.4L22.4 2zM8.5 12.5L16 6.5l-4.5 7.5L8.5 12.5z" />
            </svg>
          </div>
          <span className="text-[12.5px] font-bold text-slate-800 tracking-tight">
            {flightNumber.includes("VJ") ? "Vietjet Air" : flightNumber.includes("VN") ? "Vietnam Airlines" : "SkyLink Airline"}
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