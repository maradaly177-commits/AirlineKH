import { useState, useEffect, useRef } from "react";
import { AirplaneTilt, Headset, EnvelopeSimpleOpen, Ticket, SuitcaseRolling, ForkKnife, Sparkle, PaperPlaneRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

export default function Support() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Tôi là SkyAI, trợ lý ảo của Skylink. Tôi có thể giúp gì cho hành trình của bạn hôm nay?" }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Khi trang vừa render, đảm bảo cuộn lên đầu cùng
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Chỉ cuộn vùng nội dung chat, sử dụng block: "nearest" để tránh kéo cả màn hình lớn xuống
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const botMsg = { role: "bot", text: `Cảm ơn bạn. Hệ thống SkyAI đã ghi nhận nội dung: "${chatInput}". Tư vấn viên sẽ phản hồi chi tiết trong giây lát.` };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    alert(`Yêu cầu hỗ trợ về "${ticketSubject}" đã được gửi thành công!`);
    setTicketSubject("");
    setTicketMessage("");
  };

  const faqCategories = [
    { title: "Quản lý đặt vé", icon: <Ticket size={32} weight="duotone" className="text-blue-600" />, desc: "Hoàn vé, đổi chuyến bay, sai thông tin." },
    { title: "Hành lý", icon: <SuitcaseRolling size={32} weight="duotone" className="text-blue-600" />, desc: "Quy định kích thước, mua thêm hành lý." },
    { title: "Dịch vụ trên chuyến", icon: <ForkKnife size={32} weight="duotone" className="text-blue-600" />, desc: "Suất ăn đặc biệt, chỗ ngồi, wifi." },
    { title: "Thành viên Skylink", icon: <Sparkle size={32} weight="duotone" className="text-blue-600" />, desc: "Điểm thưởng, nâng hạng thẻ." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-24 pt-24 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Quay lại trang chủ */}
        <div className="mb-8 -ml-3">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
             <Headset size={16} weight="bold" /> Hỗ trợ 24/7
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Trung tâm trợ giúp
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Chúng tôi luôn sẵn sàng lắng nghe và giải quyết mọi thắc mắc để chuyến đi của bạn hoàn hảo nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* AI Chatbot Area */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[2rem] overflow-hidden flex flex-col h-[550px] shadow-sm">
            <div className="bg-zinc-50 border-b border-zinc-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                <h3 className="font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  SkyAI Assistant <Sparkle size={16} className="text-blue-600" weight="fill" />
                </h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trực tuyến</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed font-medium ${
                    msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                    : "bg-zinc-100 text-zinc-800 rounded-bl-sm border border-zinc-200"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-200 flex gap-3">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhắn tin cho SkyAI..."
                className="flex-1 bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm transition-all"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center shadow-sm shadow-blue-600/20"
              >
                <PaperPlaneRight size={20} weight="fill" />
              </button>
            </form>
          </div>

          {/* Ticket Form Area */}
          <div className="lg:col-span-1 bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 flex items-center gap-2">
                <EnvelopeSimpleOpen size={24} className="text-blue-600" weight="duotone" /> Gửi yêu cầu
              </h2>
              <p className="text-sm text-zinc-500 font-medium mb-8">Bạn cần hỗ trợ chuyên sâu? Gửi ticket trực tiếp cho đội ngũ CSKH.</p>
              
              <form onSubmit={handleSubmitTicket} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1 block">Chủ đề</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm cursor-pointer"
                    value={ticketSubject} 
                    onChange={(e) => setTicketSubject(e.target.value)} 
                    required
                  >
                    <option value="">Chọn vấn đề...</option>
                    <option value="Booking">Vấn đề đặt vé</option>
                    <option value="Payment">Thanh toán & Hóa đơn</option>
                    <option value="Refund">Hoàn tiền / Hủy vé</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1 block">Chi tiết</label>
                  <textarea 
                    rows="4" 
                    placeholder="Mô tả sự cố bạn đang gặp phải..."
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium resize-none transition-all"
                    value={ticketMessage} 
                    onChange={(e) => setTicketMessage(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2">
                  Gửi đi
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {faqCategories.map((cat, index) => (
            <motion.div 
              key={index} 
              whileHover={{ y: -4 }}
              className="bg-white border border-zinc-200 p-8 rounded-[2rem] hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer group"
            >
              <div className="mb-6 p-4 bg-zinc-50 rounded-2xl w-fit group-hover:bg-blue-50 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-900">{cat.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Hotline Banner */}
        <div className="bg-zinc-900 text-white border border-zinc-800 p-10 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="text-center md:text-left relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Trường hợp khẩn cấp?</h3>
            <p className="text-zinc-400 font-medium">Đường dây nóng hỗ trợ hành khách ưu tiên 24/7</p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <AirplaneTilt size={32} weight="fill" className="text-blue-500 hidden md:block" />
            <span className="text-4xl md:text-6xl font-bold tracking-tighter">1900 8888</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}