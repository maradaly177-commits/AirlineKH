import Navbar from "../../components/Navbar";
import { Coffee, Info } from "@phosphor-icons/react";
import { motion } from "motion/react";

const meals = [
  { id: 1, name: "Thực Đơn Chay (Vegan)", desc: "Không sử dụng thịt, trứng, sữa hay các sản phẩm từ động vật. Sử dụng nguyên liệu hữu cơ.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Thực Đơn Trẻ Em", desc: "Các món ăn dễ tiêu hóa, nhiều màu sắc, không cay, kèm theo đồ chơi nhỏ xinh xắn.", img: "https://images.unsplash.com/photo-1563804452097-9e7ec78eb26b?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Thực Đơn Hồi Giáo (Halal)", desc: "Tuân thủ nghiêm ngặt các quy định về thực phẩm Halal, được chứng nhận bởi cơ quan uy tín.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Thực Đơn Kiêng Gluten", desc: "Không chứa lúa mì, lúa mạch hay các loại tinh bột có gluten, phù hợp cho người nhạy cảm.", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80" },
];

export default function SpecialMeals() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="relative pt-32 pb-24 px-4 flex items-center justify-center bg-gradient-to-br from-amber-600 to-orange-800 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Coffee size={32} weight="fill" className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6">
            Bữa Ăn Đặc Biệt
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-orange-100/90">
            Tinh hoa ẩm thực trên chín tầng mây. Vui lòng đăng ký suất ăn đặc biệt ít nhất 24 giờ trước chuyến bay của bạn.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {meals.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row group">
              <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{m.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{m.desc}</p>
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-50 self-start px-3 py-1.5 rounded-lg">
                  <Info size={16} weight="fill" /> Đăng ký qua mục Quản lý vé
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
