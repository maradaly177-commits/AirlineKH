import Navbar from "../../components/Navbar";
import { Shield, CheckCircle } from "@phosphor-icons/react";
import { motion } from "motion/react";

const plans = [
  { id: 1, name: "Bảo Hiểm Cơ Bản", price: "99.000đ", benefits: ["Trễ chuyến bay (tối đa 1 triệu)", "Mất hành lý (tối đa 2 triệu)", "Tai nạn cá nhân (tối đa 50 triệu)"], color: "blue" },
  { id: 2, name: "Bảo Hiểm Toàn Diện", price: "199.000đ", benefits: ["Trễ chuyến bay (tối đa 3 triệu)", "Mất hành lý (tối đa 10 triệu)", "Tai nạn cá nhân (tối đa 200 triệu)", "Hủy chuyến bay do y tế"], color: "indigo", popular: true },
  { id: 3, name: "Bảo Hiểm SkyVIP", price: "399.000đ", benefits: ["Trễ chuyến bay (tối đa 10 triệu)", "Mất/Hư hỏng hành lý (Đền mới 100%)", "Tai nạn cá nhân (tối đa 1 tỷ)", "Chi phí y tế nước ngoài", "Hỗ trợ y tế khẩn cấp 24/7"], color: "violet" },
];

export default function TravelInsurance() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="relative pt-32 pb-28 px-4 flex items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Shield size={32} weight="fill" className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6">
            Bảo Hiểm Du Lịch
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-emerald-100/90">
            An tâm trọn vẹn cho mọi hành trình. Bảo vệ bạn và gia đình trước những rủi ro không lường trước.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className={`bg-white rounded-3xl overflow-hidden shadow-2xl ${p.popular ? 'ring-4 ring-indigo-500 scale-105 shadow-indigo-200/50 z-10' : 'shadow-slate-200/50'}`}>
              {p.popular && <div className="bg-indigo-500 text-white text-xs font-bold text-center py-2 uppercase tracking-widest">Gói Phổ Biến Nhất</div>}
              <div className="p-8 border-b border-slate-100 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{p.name}</h3>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className={`text-4xl font-black text-${p.color}-600`}>{p.price}</span>
                  <span className="text-slate-400 font-medium mb-1">/chuyến</span>
                </div>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {p.benefits.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle size={20} weight="fill" className={`text-${p.color}-500 flex-shrink-0 mt-0.5`} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button className={`w-full bg-${p.color}-50 hover:bg-${p.color}-100 text-${p.color}-700 border border-${p.color}-200 py-3.5 rounded-2xl font-bold transition-colors cursor-pointer`}>
                  Đăng ký ngay
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
