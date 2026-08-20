import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { ArrowClockwise, X } from "@phosphor-icons/react";
import { useChat } from "../../hooks/useChat";
import AssistantAvatar from "./AssistantAvatar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { messages, status, sendMessage, close, reset } = useChat();
  const navigate = useNavigate();
  const isSending = status === "sending";

  const handleQuickReply = (item) => {
    const payload = typeof item === "string" ? item : (item?.payload || item?.text || item?.label || "");
    if (!payload) return;

    if (typeof payload === "string" && payload.startsWith("open:")) {
      navigate(payload.slice(5));
      close();
      return;
    }
    sendMessage(payload);
  };

  const handleSelectFlight = (flight) => {
    localStorage.setItem("selected_flights", JSON.stringify([flight]));
    localStorage.removeItem("selected_flight");
    if (!localStorage.getItem("search_params")) {
      localStorage.setItem(
        "search_params",
        JSON.stringify({ passengers: { adults: 1, children: 0 } })
      );
    }
    close();
    navigate("/seat-selection");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-20 right-4 md:right-8 z-50 flex flex-col w-[calc(100vw-2rem)] max-w-[400px] h-[580px] max-h-[82vh] rounded-2xl overflow-hidden bg-white shadow-[0_16px_50px_-10px_rgba(15,23,42,0.25)] border border-slate-200/90 font-sans"
    >
      {/* Header English */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0f172a] text-white shrink-0">
        <div className="flex items-center gap-3">
          <AssistantAvatar size="md" />
          <div className="flex flex-col">
            <h3 className="text-[14px] font-semibold text-white tracking-wide leading-tight">
              SkyLink Support
            </h3>
            <span className="text-[11px] text-slate-300 font-normal leading-tight mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {isSending ? "Typing..." : "Online 24/7"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={reset}
            title="New Chat"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowClockwise size={15} weight="bold" />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={15} weight="bold" />
          </button>
        </div>
      </header>

      {/* Message View Area (Rộng rãi 400px) */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 bg-[#f8fafc] space-y-3">
        <MessageList
          messages={messages}
          isSending={isSending}
          onQuickReply={handleQuickReply}
          onSelectFlight={handleSelectFlight}
        />
      </div>

      <ChatInput
        onSend={sendMessage}
        onSendMessage={sendMessage}
        isLoading={isSending}
        disabled={isSending}
        placeholder="Type a message..."
      />
    </motion.div>
  );
}