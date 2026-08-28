// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowClockwise, UserCircle, PencilSimple, Check, X } from "@phosphor-icons/react";
import AssistantAvatar from "./AssistantAvatar";
import FlightCardMessage from "./FlightCardMessage";
import QuickReplies from "./QuickReplies";

const formatTime = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp === "string" && timestamp.includes(":") && timestamp.length <= 5) {
    return timestamp;
  }
  return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
};

export default function MessageBubble({ message, onQuickReply, onSelectFlight, onEditMessage, disabled }) {
  const isUser = message.role === "user" || message.sender === "user";
  const timeLabel = formatTime(message.createdAt || message.timestamp);
  const quickRepliesList = message.quickReplies || message.suggestions || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    if (typeof onEditMessage === "function") {
      onEditMessage(message.id, editText.trim(), message.images);
    }
    setIsEditing(false);
  };

  // 1. User Bubble (Right)
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="group flex justify-end items-end gap-2 mb-3"
      >
        {/* Edit button shown on hover */}
        {!isEditing && !disabled && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Chỉnh sửa câu hỏi"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 cursor-pointer self-center"
          >
            <PencilSimple size={13} weight="bold" />
          </button>
        )}

        <div className="flex flex-col items-end gap-1 max-w-[85%]">
          {/* Uploaded Images Display */}
          {message.images?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {message.images.map((img, i) => (
                <img
                  key={i}
                  src={typeof img === "string" ? img : img.data}
                  alt="Đính kèm"
                  className="w-24 h-24 object-cover rounded-xl border border-slate-200/80 shadow-2xs cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => window.open(typeof img === "string" ? img : img.data, "_blank")}
                />
              ))}
            </div>
          )}

          {/* Text Bubble or Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-1.5 w-full min-w-[200px] bg-white p-2 rounded-2xl border border-blue-200 shadow-sm">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                autoFocus
                className="w-full text-[13px] text-slate-800 p-2 rounded-lg bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:outline-none resize-none"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(message.text || "");
                  }}
                  className="px-2 py-1 text-[11px] rounded-md text-slate-500 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  <X size={11} weight="bold" /> Hủy
                </button>
                <button
                  type="submit"
                  disabled={!editText.trim()}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Check size={11} weight="bold" /> Lưu & Gửi lại
                </button>
              </div>
            </form>
          ) : (
            message.text && (
              <div className="px-4 py-2.5 rounded-2xl rounded-br-xs bg-blue-600 text-white text-[13.5px] leading-relaxed shadow-2xs">
                {message.text}
              </div>
            )
          )}

          {timeLabel && <span className="text-[10px] text-slate-400 px-1">{timeLabel}</span>}
        </div>

        <div className="w-6 h-6 shrink-0 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center ring-1 ring-white">
          <UserCircle size={16} weight="fill" />
        </div>
      </motion.div>
    );
  }

  // 2. AI Bubble (Left)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex items-end gap-2 mb-3"
    >
      <div className="mb-0.5 shrink-0">
        <AssistantAvatar size="sm" />
      </div>

      <div className="flex flex-col items-start gap-2 max-w-[90%] flex-1">
        {message.text && (
          <div className="flex flex-col gap-0.5 w-full">
            <div
              className={`px-4 py-2.5 rounded-2xl rounded-bl-xs text-[13.5px] leading-relaxed ${message.isError
                  ? "bg-rose-50 border border-rose-200 text-rose-700"
                  : "bg-white border border-slate-200/80 text-slate-800 shadow-2xs"
                }`}
            >
              {message.text}
            </div>

            {timeLabel && <span className="text-[10px] text-slate-400 px-1">{timeLabel}</span>}
          </div>
        )}

        {/* Quick Replies */}
        {quickRepliesList.length > 0 && (
          <div className="w-full">
            <QuickReplies
              items={quickRepliesList}
              onSelect={onQuickReply}
              disabled={disabled}
            />
          </div>
        )}

        {/* Flight Cards */}
        {message.flights?.length > 0 && (
          <div className="w-full flex flex-col gap-2 pt-0.5">
            {message.flights.map((flight) => (
              <FlightCardMessage key={flight.id} flight={flight} onSelect={onSelectFlight} />
            ))}
          </div>
        )}

        {/* Retry Button */}
        {message.isError && message.retry && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onQuickReply && onQuickReply({ payload: message.retry })}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <ArrowClockwise size={12} weight="bold" />
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}