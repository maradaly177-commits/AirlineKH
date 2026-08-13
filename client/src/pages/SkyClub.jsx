import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Crown, Star, AirplaneInFlight, Percent, ShieldCheck } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";

export default function SkyClub() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      
      // Load saved user immediately for fast rendering
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Fetch fresh data from backend
      if (token) {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok && data.status === "success") {
            setUser(data.data);
            // Update local storage so other tabs/pages are in sync
            if (localStorage.getItem("user")) {
              localStorage.setItem("user", JSON.stringify(data.data));
            } else if (sessionStorage.getItem("user")) {
              sessionStorage.setItem("user", JSON.stringify(data.data));
            }
          }
        } catch (err) {
          console.error("Lỗi cập nhật user:", err);
        }
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Crown size={64} weight="duotone" className="text-zinc-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Đăng nhập để xem SkyClub</h2>
          <p className="text-zinc-500 mb-6">Đăng nhập hoặc đăng ký để trải nghiệm dịch vụ thượng lưu.</p>
          <button 
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  const businessTickets = user.business_class_ticket_count || 0;
  const isVip = user.is_vip || businessTickets >= 5;
  const progressPercent = Math.min((businessTickets / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Star weight="fill" /> Chương trình Khách hàng thân thiết
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
            Skylink <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SkyClub</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium">Nâng tầm mọi chuyến bay của bạn với những đặc quyền giới hạn.</p>
        </div>

        {/* VIP Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-[2rem] p-10 md:p-12 overflow-hidden shadow-2xl ${
            isVip 
              ? "bg-gradient-to-br from-zinc-900 to-zinc-800 text-white" 
              : "bg-white border border-zinc-200"
          }`}
        >
          {isVip && (
            <>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
              <Crown size={200} weight="duotone" className="absolute -bottom-10 -right-10 text-white/5" />
            </>
          )}

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 mb-12">
              <div>
                <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isVip ? "text-indigo-300" : "text-zinc-400"}`}>
                  Thẻ thành viên
                </p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isVip ? "text-white" : "text-zinc-900"}`}>
                  {user.name}
                </h2>
              </div>
              <div className="text-left md:text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold border ${
                  isVip 
                    ? "bg-white/10 border-white/20 text-white backdrop-blur-sm" 
                    : "bg-zinc-100 border-zinc-200 text-zinc-600"
                }`}>
                  {isVip ? <><Crown weight="fill" className="text-yellow-400" /> HẠNG THƯƠNG GIA VIP</> : <><Star weight="fill" /> HẠNG TIÊU CHUẨN</>}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className={`text-sm font-bold ${isVip ? "text-zinc-300" : "text-zinc-500"}`}>
                  Tiến trình thăng hạng
                </span>
                <span className={`text-2xl font-extrabold ${isVip ? "text-white" : "text-zinc-900"}`}>
                  {businessTickets} <span className={`text-lg font-medium ${isVip ? "text-zinc-400" : "text-zinc-400"}`}>/ 5 vé Thương gia</span>
                </span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${isVip ? "bg-white/10" : "bg-zinc-100"}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${isVip ? "bg-gradient-to-r from-indigo-400 to-blue-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]" : "bg-blue-600"}`}
                ></motion.div>
              </div>
            </div>

            {!isVip ? (
              <p className="text-zinc-500 font-medium text-sm">
                Chỉ còn <strong className="text-zinc-900">{5 - businessTickets} chuyến bay</strong> Hạng Thương gia nữa để mở khóa Đặc quyền VIP giảm giá 5% vĩnh viễn.
              </p>
            ) : (
              <p className="text-indigo-200 font-medium text-sm flex items-center gap-2">
                <CheckCircle weight="fill" className="text-green-400" />
                Chúc mừng! Bạn đã đạt hạng VIP. Mọi giá vé cơ bản của bạn giờ đây tự động giảm 5%.
              </p>
            )}
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Percent size={32} weight="duotone" className={isVip ? "text-blue-600" : "text-zinc-400"} />, title: "Giảm 5% giá vé cơ bản", desc: "Tự động áp dụng khi tìm kiếm mọi chuyến bay trên hệ thống." },
            { icon: <AirplaneInFlight size={32} weight="duotone" className={isVip ? "text-blue-600" : "text-zinc-400"} />, title: "Ưu tiên lên máy bay", desc: "Luôn được gọi tên đầu tiên tại cửa khởi hành." },
            { icon: <ShieldCheck size={32} weight="duotone" className={isVip ? "text-blue-600" : "text-zinc-400"} />, title: "Phòng chờ hạng thương gia", desc: "Miễn phí sử dụng phòng chờ kể cả khi bay hạng phổ thông." },
          ].map((benefit, idx) => (
            <div key={idx} className={`p-8 rounded-[2rem] border ${isVip ? "bg-white border-blue-100 shadow-xl shadow-blue-900/5" : "bg-zinc-50 border-zinc-200 opacity-60 grayscale"}`}>
              <div className="mb-6">{benefit.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${isVip ? "text-zinc-900" : "text-zinc-700"}`}>{benefit.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
        
        {!isVip && (
          <div className="mt-12 text-center">
            <button onClick={() => navigate("/flights")} className="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
              Tìm chuyến bay Thương gia ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline CheckCircle component for the success message to avoid import issues
function CheckCircle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}
