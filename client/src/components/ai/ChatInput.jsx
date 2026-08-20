import React, { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

export const ChatInput = ({ onSendMessage, onSend, isLoading, disabled, placeholder = "Type a message..." }) => {
  const [text, setText] = useState("");
  const handleSend = onSendMessage || onSend;
  const isBlocked = isLoading || disabled;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isBlocked) return;
    if (typeof handleSend === "function") {
      handleSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isBlocked}
          className="w-full pl-4 pr-11 py-2.5 bg-slate-100/90 focus:bg-white rounded-full text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-300 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim() || isBlocked}
          aria-label="Send message"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:bg-slate-300 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
        >
          <PaperPlaneTilt size={14} weight="fill" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;