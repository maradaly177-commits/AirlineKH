import Navbar from "../../components/Navbar";
import { Gift, Briefcase, PaperPlaneRight } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function CorporateGifts() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="relative pt-32 pb-24 px-4 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Gift size={32} weight="fill" className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6">
            Quà Tặng Doanh Nghiệp
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-zinc-300">
            Giải pháp tri ân đối tác và nhân viên đẳng cấp nhất với thẻ bay SkyLink Gift Card.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 bg-zinc-900 text-white flex flex-col justify-center">
            <Briefcase size={40} className="text-amber-500 mb-6" weight="duotone" />
            <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Để lại thông tin, đội ngũ tư vấn doanh nghiệp của chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ để đưa ra chiết khấu tốt nhất.
            </p>
            <div className="space-y-4 text-sm text-zinc-300">
              <p>Email: corporate@skylink.vn</p>
              <p>Hotline: 0909 888 999</p>
            </div>
          </div>
          <div className="md:w-1/2 p-10">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tên Công Ty</label>
                <input type="text" placeholder="Công ty TNHH..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-800 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Người Liên Hệ</label>
                <input type="text" placeholder="Họ và tên" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-800 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Số Điện Thoại</label>
                <input type="tel" placeholder="090..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-800 transition-colors" />
              </div>
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4">
                Gửi Yêu Cầu <PaperPlaneRight size={18} weight="bold" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
