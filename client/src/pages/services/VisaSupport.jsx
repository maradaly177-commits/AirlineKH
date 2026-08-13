import Navbar from "../../components/Navbar";
import { Globe, BookOpen, CaretRight } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function VisaSupport() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="relative pt-32 pb-24 px-4 flex items-center justify-center bg-gradient-to-br from-cyan-800 to-blue-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Globe size={32} weight="fill" className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6">
            Visa & Hỗ Trợ Nhập Cảnh
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-cyan-100/90">
            Giải pháp nhập cảnh nhanh chóng, thủ tục gọn nhẹ. Chúng tôi đối tác với các Đại sứ quán để hỗ trợ bạn tốt nhất.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <BookOpen size={28} className="text-blue-500" />
              Tra Cứu Yêu Cầu Thị Thực
            </h2>
          </div>
          <div className="p-8 bg-slate-50/50">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quốc Tịch Của Bạn</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors">
                  <option>Việt Nam</option>
                  <option>Hoa Kỳ</option>
                  <option>Nhật Bản</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Điểm Đến</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors">
                  <option>Thái Lan (Miễn Visa)</option>
                  <option>Hàn Quốc (Cần E-Visa)</option>
                  <option>Châu Âu (Schengen)</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer">
              Kiểm Tra Ngay
            </button>
          </div>
          
          <div className="p-8 divide-y divide-slate-100">
            {['Dịch vụ Fast-Track Sân bay', 'Hỗ trợ điền tờ khai Hải quan', 'Bảo lãnh y tế mùa dịch'].map((item, i) => (
              <div key={i} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-8 px-8 transition-colors">
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item}</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <CaretRight size={16} weight="bold" className="text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
