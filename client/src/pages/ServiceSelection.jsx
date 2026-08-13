import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { SuitcaseRolling, ForkKnife, ShieldCheck, Lightning, Check, ArrowRight } from "@phosphor-icons/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

export default function ServiceSelection() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin chuyến bay đã chọn từ localStorage
  const selectedFlights = JSON.parse(localStorage.getItem("selected_flights") || "[]");
  // Tính tổng giá vé của tất cả các chuyến bay được chọn (chiều đi + chiều về)
  const basePrice = selectedFlights.reduce((sum, f) => sum + Number(f.display_price || f.base_price), 0);

  // Gọi API lấy dịch vụ thật từ DB
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/services")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setServices(data.data);
      })
      .catch(err => console.error("Lỗi tải dịch vụ:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleService = (service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const servicesTotal = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const grandTotal = Number(basePrice) + servicesTotal;

  const handleNextStep = () => {
    localStorage.setItem("selected_services", JSON.stringify(selectedServices));
    navigate("/checkout");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Map icon component based on type
  const getIcon = (type, isSelected) => {
    const props = { 
      size: 32, 
      weight: isSelected ? "fill" : "duotone",
      className: isSelected ? "text-blue-600" : "text-zinc-400"
    };
    switch(type) {
      case 1: return <SuitcaseRolling {...props} />;
      case 2: return <ForkKnife {...props} />;
      case 3: return <Lightning {...props} />;
      case 4: return <ShieldCheck {...props} />;
      default: return <SuitcaseRolling {...props} />;
    }
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
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Bước 02
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Dịch vụ bổ sung
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Tăng thêm sự thoải mái cho hành trình của bạn với các gói tiện ích được thiết kế riêng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Services List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-8 rounded-[2rem] border border-zinc-200 bg-white animate-pulse h-56" />
              ))
            ) : services.map((service, idx) => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => toggleService(service)}
                  className={`relative p-8 rounded-[2rem] border transition-all cursor-pointer group bg-white overflow-hidden
                    ${isSelected 
                      ? "border-blue-600 shadow-md shadow-blue-600/10 ring-1 ring-blue-600" 
                      : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="mb-6 flex justify-between items-start">
                    <div className={`p-4 rounded-2xl transition-colors ${isSelected ? "bg-blue-50" : "bg-zinc-50"}`}>
                      {getIcon(service.type, isSelected)}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-300 text-transparent group-hover:border-zinc-400"}
                    `}>
                      <Check size={14} weight="bold" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-2 text-zinc-900">
                    {service.name}
                  </h3>
                  
                  <div className="mt-6 mb-6 flex justify-between items-end">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      Phí thêm
                    </span>
                    <span className="text-xl font-bold tracking-tighter text-zinc-900">
                      +{formatCurrency(service.price)}
                    </span>
                  </div>

                  <button
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-center block
                      ${isSelected
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                      }
                    `}
                  >
                    {isSelected ? "Bỏ chọn" : "Chọn dịch vụ"}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] sticky top-8 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                Tóm tắt chuyến bay
              </h2>
              
              <div className="space-y-4 mb-8">
                {selectedFlights.map((f, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500 font-medium">
                      Chuyến {idx === 0 ? "đi" : "về"} ({f.departure_airport?.code} - {f.arrival_airport?.code})
                    </span>
                    <span className="font-semibold text-zinc-900">{formatCurrency(f.display_price || f.base_price)}</span>
                  </div>
                ))}
                
                {selectedServices.length > 0 ? (
                  <div className="space-y-3 pt-4 border-t border-zinc-100">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Dịch vụ đã chọn</p>
                    {selectedServices.map(s => (
                      <motion.div layout key={s.id} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">{s.name}</span>
                        <span className="font-semibold text-zinc-900">+{formatCurrency(s.price)}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-4 border-t border-zinc-100">
                    <p className="text-sm text-zinc-400 italic">Chưa chọn dịch vụ bổ sung</p>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold tracking-tighter text-zinc-900 block leading-none mb-1">
                      {formatCurrency(grandTotal)}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Đã bao gồm thuế, phí
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Tiếp tục thanh toán <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}