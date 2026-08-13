import Navbar from "../../components/Navbar";
import { Car, PhoneCall, Star } from "@phosphor-icons/react";
import { motion } from "motion/react";

const providers = [
  { id: 1, name: "SkyLink Limousine", type: "Xe Sang Trọng (Mercedes, BMW)", price: "Từ 500.000đ", phone: "1900 6067", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80", rating: 4.9 },
  { id: 2, name: "Grab Airport", type: "Xe Phổ Thông (4-7 chỗ)", price: "Theo app", phone: "1900 0000", img: "https://images.unsplash.com/photo-1550567705-728109d94944?auto=format&fit=crop&w=600&q=80", rating: 4.8 },
  { id: 3, name: "Taxi Nội Bài", type: "Xe Gia Đình", price: "Từ 250.000đ", phone: "0243 886 8888", img: "https://images.unsplash.com/photo-1512424072895-3bc63ce604db?auto=format&fit=crop&w=600&q=80", rating: 4.5 },
];

export default function AirportTransfer() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="relative pt-32 pb-24 px-4 flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Car size={32} weight="fill" className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6">
            Đưa Đón Sân Bay
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-blue-100/90">
            Đối tác vận chuyển uy tín của SkyLink, đảm bảo hành trình của bạn luôn đúng giờ và an toàn tuyệt đối. Vui lòng liên hệ trực tiếp để đặt xe.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {providers.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="h-56 overflow-hidden relative group">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm text-slate-800">
                  <Star weight="fill" className="text-amber-500 text-sm" /> {p.rating}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{p.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{p.type}</p>
                
                <div className="flex items-end justify-between mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">CƯỚC PHÍ DỰ KIẾN</p>
                    <p className="font-bold text-blue-600 text-lg">{p.price}</p>
                  </div>
                </div>

                <a href={`tel:${p.phone.replace(/\s+/g, '')}`} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-slate-200">
                  <PhoneCall size={20} weight="fill" />
                  Gọi Trực Tiếp: {p.phone}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
