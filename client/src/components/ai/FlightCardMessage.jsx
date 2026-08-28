import React from "react";
import { AirplaneTilt, ArrowRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export const FlightCardMessage = ({ flight }) => {
  const navigate = useNavigate();

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
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all w-full my-1">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-2">

        <div className="flex items-center gap-1.5 min-w-0">

          <div className="w-5.5 h-5.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

            <AirplaneTilt
              size={12}
              weight="fill"
              className="transform -rotate-45"
            />

          </div>

          <span className="text-[13px] font-semibold text-slate-800 truncate">
            {flightNumber}
          </span>

        </div>

        <span className="text-[13.5px] font-bold text-blue-600 shrink-0">
          {new Intl.NumberFormat("vi-VN").format(price)} đ
        </span>

      </div>

      {/* FLIGHT SCHEDULE */}

      <div className="flex items-center justify-between text-xs py-2.5 my-2 border-y border-slate-100">

        {/* Departure */}

        <div>

          <div className="font-bold text-slate-800 text-[13.5px]">
            {departureTime}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {origin}
          </div>

        </div>

        {/* Duration */}

        <div className="flex flex-col items-center px-2">

          <span className="text-[10px] text-slate-400 font-medium">
            {durationLabel ?? "—"}
          </span>

          <div className="w-14 h-px bg-slate-200 relative my-0.5">

            <AirplaneTilt
              size={9}
              weight="fill"
              className="text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45"
            />

          </div>

          <span className="text-[9px] text-emerald-600 font-semibold">
            Direct
          </span>

        </div>

        {/* Arrival */}

        <div className="text-right">

          <div className="font-bold text-slate-800 text-[13.5px]">
            {arrivalTime}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {destination}
          </div>

        </div>

      </div>

      {/* BOOK BUTTON */}

      <button
        type="button"
        onClick={handleBookFlight}
        disabled={!flightId}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
      >

        <span>
          👉 Chọn ghế & Đặt vé ngay
        </span>

        <ArrowRight
          size={12}
          weight="bold"
        />

      </button>

    </div>
  );
};

export default FlightCardMessage;