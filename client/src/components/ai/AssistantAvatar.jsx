import React from "react";
import { AirplaneTilt } from "@phosphor-icons/react";

const sizes = {
  sm: { box: "w-6 h-6", icon: 12, dot: "w-1.5 h-1.5" },
  md: { box: "w-7 h-7", icon: 14, dot: "w-2 h-2" },
  lg: { box: "w-8 h-8", icon: 16, dot: "w-2 h-2" },
};

export function AssistantAvatar({ size = "md", isOnline = true }) {
  const s = sizes[size] ?? sizes.md;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${s.box} rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-xs ring-1.5 ring-white/90`}
        aria-hidden="true"
      >
        <AirplaneTilt
          size={s.icon}
          weight="fill"
          className="text-white transform -rotate-45"
        />
      </div>

      {isOnline && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${s.dot} rounded-full bg-emerald-400 ring-1.5 ring-white shadow-xs`}
          title="Đang trực tuyến"
        />
      )}
    </div>
  );
}

export default AssistantAvatar;