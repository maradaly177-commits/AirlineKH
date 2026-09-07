import React from "react";
import { AirplaneTilt, SuitcaseRolling, Ticket, CaretRight, Question } from "@phosphor-icons/react";

const getQuickReplyDetails = (label) => {
  const normLabel = label.toLowerCase();
  
  if (normLabel.includes("chuyến bay") || normLabel.includes("bay") || normLabel.includes("tìm chuyến")) {
    return {
      Icon: AirplaneTilt,
      iconColor: "text-blue-500",
      title: "Tìm chuyến bay",
      description: "Tìm hành trình Hà Nội (HAN) → Đà Nẵng (DAD)",
      iconBg: "bg-blue-50/70 border-blue-100/50"
    };
  }
  
  if (normLabel.includes("hành lý") || normLabel.includes("quy định")) {
    return {
      Icon: SuitcaseRolling,
      iconColor: "text-indigo-500",
      title: "Quy định hành lý",
      description: "Tiêu chuẩn hành lý xách tay & ký gửi miễn phí",
      iconBg: "bg-indigo-50/70 border-indigo-100/40"
    };
  }
  
  if (normLabel.includes("đặt chỗ") || normLabel.includes("tra cứu") || normLabel.includes("mã đặt")) {
    return {
      Icon: Ticket,
      iconColor: "text-amber-500",
      title: "Tra cứu mã đặt chỗ",
      description: "Xem chi tiết vé, đổi lịch trình & check-in trực tuyến",
      iconBg: "bg-amber-50/70 border-amber-100/40"
    };
  }
  
  // Default fallback if we get a random suggestion
  const titleText = label.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim();
  return {
    Icon: Question,
    iconColor: "text-slate-500",
    title: titleText || label,
    description: "Nhấp để nhận hỗ trợ nhanh chóng",
    iconBg: "bg-slate-50 border-slate-100"
  };
};

export const QuickReplies = ({ items = [], onSelect, disabled = false }) => {
  if (!items || items.length === 0) return null;

  return (
    <div 
      className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory pt-1.5"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {items.map((item, idx) => {
        const label = typeof item === "string" ? item : (item.label || item.text || item.payload);
        const payload = typeof item === "string" ? item : (item.payload || item.text || item.label);

        const details = getQuickReplyDetails(label);
        const IconComponent = details.Icon;

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect && onSelect(payload)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-white text-[11px] font-bold text-slate-700 hover:text-blue-600 hover:border-blue-400 active:scale-[0.98] transition-all shadow-[0_1px_4px_rgba(0,0,0,0.01)] hover:shadow-sm whitespace-nowrap snap-align-start shrink-0 cursor-pointer disabled:opacity-50 select-none"
          >
            <IconComponent size={13} className={`${details.iconColor}`} weight="fill" />
            <span>{details.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickReplies;