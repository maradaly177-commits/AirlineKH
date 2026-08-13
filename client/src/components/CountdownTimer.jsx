import { useState, useEffect } from "react";
import { Clock } from "@phosphor-icons/react";

export default function CountdownTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const dateStr = expiresAt.endsWith("Z") ? expiresAt : expiresAt + "Z";
      const diff = new Date(dateStr).getTime() - Date.now();
      if (diff <= 0) { setSecondsLeft(0); onExpire?.(); }
      else setSecondsLeft(Math.ceil(diff / 1000));
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [expiresAt, onExpire]);

  if (!secondsLeft || secondsLeft <= 0) return null;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs animate-pulse mt-1">
      <Clock size={13} /> Hủy sau {m}:{String(s).padStart(2, "0")}
    </span>
  );
}
