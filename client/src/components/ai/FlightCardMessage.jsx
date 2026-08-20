import React from "react";
import { AirplaneTilt, ArrowRight } from "@phosphor-icons/react";

export const FlightCardMessage = ({ flight, onSelect, onSelectFlight }) => {
  if (!flight) return null;
  const handleSelect = onSelect || onSelectFlight;
  const price = flight.fares?.economySaver?.price || flight.price || flight.basePrice || 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all w-full my-1">
      {/* Header Flight & Price */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5.5 h-5.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <AirplaneTilt size={12} weight="fill" className="transform -rotate-45" />
          </div>
          <span className="text-[13px] font-semibold text-slate-800 truncate">
            {flight.flightNumber || flight.airline || "SkyLink"}
          </span>
        </div>
        <span className="text-[13.5px] font-bold text-blue-600 shrink-0">
          {new Intl.NumberFormat("vi-VN").format(price)} đ
        </span>
      </div>

      {/* Flight Schedule */}
      <div className="flex items-center justify-between text-xs py-2.5 my-2 border-y border-slate-100">
        <div>
          <div className="font-bold text-slate-800 text-[13.5px]">{flight.departureTime || "08:00"}</div>
          <div className="text-[11px] text-slate-400 font-medium">{flight.fromCity || flight.from || "HAN"}</div>
        </div>

        <div className="flex flex-col items-center px-2">
          <span className="text-[10px] text-slate-400 font-medium">{flight.duration || flight.durationText || "1h 55m"}</span>
          <div className="w-14 h-px bg-slate-200 relative my-0.5">
            <AirplaneTilt size={9} weight="fill" className="text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
          </div>
          <span className="text-[9px] text-emerald-600 font-semibold">Direct</span>
        </div>

        <div className="text-right">
          <div className="font-bold text-slate-800 text-[13.5px]">{flight.arrivalTime || "09:55"}</div>
          <div className="text-[11px] text-slate-400 font-medium">{flight.toCity || flight.to || "SGN"}</div>
        </div>
      </div>

      {/* Select Flight Button */}
      <button
        type="button"
        onClick={() => handleSelect && handleSelect(flight)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
      >
        <span>Select Flight</span>
        <ArrowRight size={12} weight="bold" />
      </button>
    </div>
  );
};

export default FlightCardMessage;