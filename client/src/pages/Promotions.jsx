import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Gift, EnvelopeSimple, ArrowRight, CheckCircle, Trophy, Clock } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

/**
 * Promotions Bento Page
 * Taste Skill: Variance 6, Motion 7, Density 5
 */
export default function Promotions() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

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
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-zinc-200 text-zinc-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <Gift size={14} weight="bold" /> Ưu đãi độc quyền
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 bg-clip-text text-transparent">
              Ưu đãi dành riêng cho bạn
            </h1>
            <p className="text-zinc-500 font-medium text-lg leading-relaxed">
              Tiết kiệm hơn cho mỗi hành trình bay. Mở khóa đặc quyền với mã ưu đãi dưới đây.
            </p>
          </div>
        </div>

        {/* Promo Bento Grid (Bố cục Bento Grid bất đối xứng cao cấp) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Chào đón mùa hè (Featured, md:col-span-2) */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-[2rem] overflow-hidden border border-zinc-800 shadow-xl flex flex-col justify-between group relative min-h-[340px]"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
            
            <div className="p-8 md:p-10 flex-1 flex flex-col md:flex-row justify-between gap-6 relative z-10">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-6 inline-block">
                    Mã: SUMMER26 • Hạn: 15/05/2026
                  </span>
                  <h3 className="text-xl font-medium mb-1 text-zinc-400">Chào đón mùa hè</h3>
                  <div className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent">
                    Giảm 500.000đ
                  </div>
                  <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-6">
                    Dành cho các chuyến bay nội địa khởi hành từ Hà Nội và TP.HCM. Trải nghiệm hành trình mùa hè rực rỡ cùng gia đình.
                  </p>
                </div>

                {/* Copy Code Section */}
                <div className="flex items-center justify-between bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/60 max-w-sm">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5 tracking-widest">Mã ưu đãi</p>
                    <span className="font-mono text-lg font-bold tracking-wider text-amber-300">
                      SUMMER26
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCopy("SUMMER26")}
                    className="p-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-650 hover:bg-zinc-700 text-white rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedCode === "SUMMER26" ? <CheckCircle size={20} weight="fill" className="text-green-400" /> : <Copy size={20} weight="bold" />}
                  </button>
                </div>
              </div>

              {/* Graphic element */}
              <div className="hidden md:flex flex-col items-center justify-center pr-6 opacity-30 group-hover:opacity-45 transition-opacity duration-300">
                <span className="text-8xl font-extrabold tracking-tighter text-zinc-800 select-none">HOT</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Loyalty Widget (SkyLink Loyalty - md:col-span-1) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-1 bg-gradient-to-br from-blue-950 via-slate-900 to-zinc-950 text-white rounded-[2rem] p-8 border border-blue-900/30 shadow-xl flex flex-col justify-between relative overflow-hidden group min-h-[340px]"
          >
            {/* Glow background */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex justify-between items-start">
                <span className="bg-blue-500/15 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Thành viên Platinum
                </span>
                <Trophy size={28} className="text-amber-400" weight="fill" />
              </div>

              <div>
                <p className="text-xs text-zinc-400 font-semibold mb-1 uppercase tracking-wider">Điểm tích lũy hiện tại</p>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2 flex items-baseline gap-1">
                  2,500 <span className="text-sm font-bold text-blue-400">PTS</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-[70%]" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                  <span>2,500 / 3,500 PTS</span>
                  <span>Còn 1,000 PTS đến Hạng Diamond</span>
                </div>
              </div>

              <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/10 rounded-xl p-3 font-medium">
                ★ Tự động nhân 1.5 lần điểm thưởng khi đặt vé hạng Thương gia.
              </div>
            </div>
          </motion.div>

          {/* Card 3: Ưu đãi thành viên mới (WELCOM20 - md:col-span-1) */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden hover:shadow-md transition-all group flex flex-col min-h-[380px]"
          >
            <div className="h-24 bg-blue-650 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
              <span className="text-4xl font-bold tracking-tighter opacity-20 text-white">WELCOME</span>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-6">
              <div>
                <div className="bg-white border border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm">
                  Hạn dùng: 30/04/2026
                </div>
                <h3 className="text-lg font-semibold mb-1 text-zinc-655">Ưu đãi thành viên mới</h3>
                <div className="text-3xl font-extrabold tracking-tighter mb-4 text-zinc-900">
                  Giảm 20%
                </div>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                  Áp dụng cho lần đặt vé đầu tiên trên hệ thống trực tuyến của Skylink.
                </p>
              </div>

              {/* Copy Code & Action */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200 group-hover:border-blue-200 transition-colors">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5 tracking-widest">Mã ưu đãi</p>
                    <span className="font-mono text-lg font-bold tracking-wider text-zinc-900">
                      WELCOME20
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCopy("WELCOME20")}
                    className="p-3 bg-white border border-zinc-200 text-zinc-900 rounded-lg hover:bg-zinc-100 hover:text-blue-600 transition-all active:scale-95 shadow-sm cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedCode === "WELCOME20" ? <CheckCircle size={20} weight="fill" className="text-green-600" /> : <Copy size={20} weight="bold" />}
                  </button>
                </div>
                <button 
                  onClick={() => navigate("/flights")}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Tìm chuyến bay
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Đặc quyền thẻ Platinum (PLATINUMUP - md:col-span-1) */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden hover:shadow-md transition-all group flex flex-col min-h-[380px]"
          >
            <div className="h-24 bg-zinc-200 relative overflow-hidden flex items-center justify-center">
              <span className="text-4xl font-bold tracking-tighter opacity-20 text-zinc-900">PLATINUM</span>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-6">
              <div>
                <div className="bg-white border border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm">
                  Hạn dùng: Vô thời hạn
                </div>
                <h3 className="text-lg font-semibold mb-1 text-zinc-655">Đặc quyền thẻ Platinum</h3>
                <div className="text-3xl font-extrabold tracking-tighter mb-4 text-zinc-900">
                  Nâng hạng ghế
                </div>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                  Tự động nâng lên hạng Thương gia cho thành viên thân thiết khi còn chỗ trống.
                </p>
              </div>

              {/* Copy Code & Action */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200 group-hover:border-blue-200 transition-colors">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5 tracking-widest">Mã ưu đãi</p>
                    <span className="font-mono text-lg font-bold tracking-wider text-zinc-900">
                      PLATINUMUP
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCopy("PLATINUMUP")}
                    className="p-3 bg-white border border-zinc-200 text-zinc-900 rounded-lg hover:bg-zinc-100 hover:text-blue-600 transition-all active:scale-95 shadow-sm cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedCode === "PLATINUMUP" ? <CheckCircle size={20} weight="fill" className="text-green-600" /> : <Copy size={20} weight="bold" />}
                  </button>
                </div>
                <button 
                  onClick={() => navigate("/flights")}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Tìm chuyến bay
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Countdown Widget (md:col-span-1) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-1 bg-gradient-to-br from-red-950 via-rose-950 to-zinc-950 text-white rounded-[2rem] p-8 border border-red-900/30 shadow-xl flex flex-col justify-between relative overflow-hidden group min-h-[380px]"
          >
            {/* Glow background */}
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-rose-500/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex justify-between items-start">
                <span className="bg-red-500/15 border border-red-500/30 text-rose-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <Clock size={12} weight="bold" /> Ưu đãi sắp kết thúc
                </span>
              </div>

              <div>
                <p className="text-xs text-rose-300/80 font-bold mb-2 uppercase tracking-wider">Mã SUMMER26 hết hạn sau:</p>
                <div className="flex gap-3 text-center mb-6">
                  <div className="bg-zinc-900/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-zinc-800 min-w-[54px]">
                    <div className="text-2xl font-black text-white">02</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Ngày</div>
                  </div>
                  <div className="bg-zinc-900/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-zinc-800 min-w-[54px]">
                    <div className="text-2xl font-black text-white">14</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Giờ</div>
                  </div>
                  <div className="bg-zinc-900/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-zinc-800 min-w-[54px]">
                    <div className="text-2xl font-black text-white">45</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Phút</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate("/flights")}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/20"
              >
                Đặt vé ngay <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-24 bg-blue-650 text-white rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-blue-900/10"
        >
          {/* Decorative graphic */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <EnvelopeSimple size={48} weight="duotone" className="mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Cập nhật ưu đãi mới nhất
            </h2>
            <p className="text-blue-100 mb-10 font-medium">
              Đăng ký nhận bản tin để nhận mã giảm giá độc quyền và thông tin về các chặng bay mới của Skylink.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-blue-200 px-6 py-4 rounded-xl outline-none focus:bg-white/20 transition-colors font-medium"
              />
              <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                Đăng ký <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}