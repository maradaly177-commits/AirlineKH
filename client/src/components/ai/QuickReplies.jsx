import React from "react";

export const QuickReplies = ({ items = [], onSelect, disabled = false }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, idx) => {
        const label = typeof item === "string" ? item : (item.label || item.text || item.payload);
        const payload = typeof item === "string" ? item : (item.payload || item.text || item.label);

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect && onSelect(payload)}
            className="w-full text-center py-2.5 px-4 rounded-full bg-white text-blue-600 font-semibold text-xs sm:text-sm shadow-[0_2px_6px_rgba(37,99,235,0.08)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.18)] border border-blue-200/90 hover:border-blue-500 hover:bg-blue-50/70 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickReplies;