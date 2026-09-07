import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { ArrowClockwise, X } from "@phosphor-icons/react";
import { useChat } from "../../hooks/useChat";
import AssistantAvatar from "./AssistantAvatar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { messages, status, sendMessage, editMessage, close, reset } = useChat();
  const navigate = useNavigate();
  const isSending = status === "sending";

  const handleQuickReply = (item) => {
    const payload = typeof item === "string" ? item : (item?.payload || item?.text || item?.label || "");
    if (!payload) return;

    if (typeof payload === "string" && payload.startsWith("open:")) {
      const targetPath = payload.slice(5);
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      close();
      if (!token && (targetPath.includes("seat-selection") || targetPath.includes("booking") || targetPath.includes("checkout"))) {
        navigate("/login", {
          state: {
            from: targetPath,
            message: "Vui lòng đăng ký hoặc đăng nhập để tiếp tục đặt vé máy bay.",
          },
        });
      } else {
        navigate(targetPath);
      }
      return;
    }
    sendMessage(payload);
  };

  const handleSelectFlight = (flight) => {
    const flightId = flight?.id ?? flight?.flight_id ?? flight?.flightId;

    if (!flightId) {
      console.error("handleSelectFlight: Không tìm thấy flight ID", flight);
      return;
    }

    // Lưu vào localStorage làm fallback
    localStorage.setItem("selected_flights", JSON.stringify([flight]));
    localStorage.removeItem("selected_seats");

    if (!localStorage.getItem("search_params")) {
      localStorage.setItem(
        "search_params",
        JSON.stringify({ passengers: { adults: 1, children: 0 } })
      );
    }

    close();

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      navigate("/login", {
        state: {
          from: `/seat-selection?flight_id=${encodeURIComponent(flightId)}`,
          message: "Vui lòng đăng ký hoặc đăng nhập để tiếp tục chọn ghế & đặt vé.",
        },
      });
    } else {
      // Navigate với flight_id trong URL — đúng theo flow AI
      navigate(`/seat-selection?flight_id=${encodeURIComponent(flightId)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-20 right-4 md:right-8 z-50 flex flex-col w-[calc(100vw-2rem)] max-w-[400px] h-[580px] max-h-[82vh] rounded-2xl overflow-hidden bg-white shadow-[0_16px_50px_-10px_rgba(15,23,42,0.25)] border border-slate-200/90 font-sans"
    >
      {/* Header English - Rebuilt to match Teneo Air mockup */}
      <header className="relative flex flex-col bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shrink-0 overflow-hidden pt-4 pb-7 px-4.5 shadow-xs">
        {/* Airplane outline watermark */}
        <div className="absolute -right-2 -bottom-2 opacity-20 pointer-events-none z-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white transform -rotate-12">
            <path d="M22.4 2L2 10.3c-.6.2-.6.9 0 1.1l5.4 1.8 1.8 5.4c.2.6.9.6 1.1 0l8.3-20.4L22.4 2zM8.5 12.5L16 6.5l-4.5 7.5L8.5 12.5z" />
          </svg>
        </div>

        {/* Waves SVG */}
        <div className="absolute bottom-0 left-0 right-0 leading-[0] z-0 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[18px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V30.9C1133.33,56.84,1060.09,86.09,985.66,92.83Z" fill="#fafafa"></path>
          </svg>
        </div>

        {/* Content Wrapper */}
        <div className="relative flex items-center justify-between z-10 w-full animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AssistantAvatar size="md" />
            <div className="flex flex-col">
              <h3 className="text-[14.5px] font-bold text-white tracking-tight leading-tight">
                SkyLink AI Assistant
              </h3>
              <span className="text-[10px] text-blue-100 font-normal leading-tight mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                {isSending ? "Typing..." : "Online 24/7"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-100">
            <button
              type="button"
              onClick={reset}
              title="New Chat"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ArrowClockwise size={15} weight="bold" />
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X size={15} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* Message View Area (Rộng rãi 400px) */}
      <div className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
        <MessageList
          messages={messages}
          isSending={isSending}
          onQuickReply={handleQuickReply}
          onSelectFlight={handleSelectFlight}
          onEditMessage={editMessage}
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