import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  SuitcaseRolling,
  ForkKnife,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  AirplaneInFlight,
  CalendarBlank,
  Users,
  Star,
  LockKey,
  X,
  Sparkle
} from "@phosphor-icons/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

const defaultMockServices = [
  {
    id: 1,
    name: "Hành lý ký gửi 20kg",
    description: "Mang theo nhiều hơn những gì bạn cần cho chuyến đi.",
    price: 250000,
    badge: "Phổ biến",
    unit: "kiện",
    weightTag: "20kg",
    iconType: "luggage20",
    tags: ["Áp dụng cho mọi hành khách", "Hỗ trợ tại sân bay"],
    image: "https://static.vecteezy.com/system/resources/previews/036/209/973/non_2x/ai-generated-flying-suitcase-on-blue-airplane-business-travel-mode-generated-by-ai-free-photo.jpg"
  },
  {
    id: 2,
    name: "Hành lý ký gửi 30kg",
    description: "Thoải mái mang theo hành lý cá nhân và quà tặng.",
    price: 400000,
    badge: null,
    unit: "kiện",
    weightTag: "30kg",
    iconType: "luggage30",
    tags: ["Áp dụng cho mọi hành khách", "Hỗ trợ tại sân bay"],
    image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Suất ăn nóng",
    description: "Thưởng thức bữa ăn chất lượng trên chuyến bay.",
    price: 120000,
    badge: null,
    unit: "suất",
    iconType: "meal",
    tags: ["Đa dạng thực đơn", "Đặt trước dễ dàng"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Ưu tiên làm thủ tục",
    description: "Tiết kiệm thời gian, nhanh chóng làm thủ tục tại quầy ưu tiên.",
    price: 150000,
    badge: null,
    unit: "khách",
    iconType: "priority",
    tags: ["Lối đi riêng", "Hỗ trợ tận tình"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop"
  }
];

export default function ServiceSelection() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin chuyến bay đã chọn từ localStorage
  const selectedFlights = JSON.parse(localStorage.getItem("selected_flights") || "[]");

  // Fallback flight data để UI hiển thị đẹp chuẩn như ảnh mẫu nếu chưa có data
  const primaryFlight = selectedFlights[0] || {
    departure_airport: { code: "DAD", city_name: "Đà Nẵng" },
    arrival_airport: { code: "PQC", city_name: "Phú Quốc" },
    departure_time: "2026-09-26T08:00:00",
    display_price: 1900000,
    base_price: 1900000
  };

  const basePrice = selectedFlights.length > 0
    ? selectedFlights.reduce((sum, f) => sum + Number(f.display_price || f.base_price || 0), 0)
    : 1900000;

  // Gọi API lấy dịch vụ thật từ DB (với fallback 4 gói chuẩn theo ảnh)
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setServices(list);
        } else {
          // Default mock data matching the screenshot
          setServices(defaultMockServices);
        }
      })
      .catch(() => {
        setServices(defaultMockServices);
      })
      .finally(() => setLoading(false));
  }, []);

  const fallbackImages = [
    "https://static.vecteezy.com/system/resources/previews/036/209/973/non_2x/ai-generated-flying-suitcase-on-blue-airplane-business-travel-mode-generated-by-ai-free-photo.jpg",
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop"
  ];

  const getServiceImage = (service, idx = 0) => {
    const nameLower = (service?.name || "").toLowerCase();
    const idNum = Number(service?.id || 0);

    if (idNum === 1 || nameLower.includes("20")) return fallbackImages[0];
    if (idNum === 2 || nameLower.includes("30")) return fallbackImages[1];
    if (idNum === 3 || nameLower.includes("ăn") || nameLower.includes("món")) return fallbackImages[2];
    if (idNum === 4 || nameLower.includes("ưu tiên") || nameLower.includes("thủ tục")) return fallbackImages[3];

    if (
      service?.image &&
      typeof service.image === "string" &&
      service.image.startsWith("http") &&
      !service.image.includes("dsmcdn") &&
      !service.image.includes("googleapis") &&
      !service.image.includes("1553531384-397c80973a0b")
    ) {
      return service.image;
    }

    return fallbackImages[idx % fallbackImages.length];
  };

  const getWeightTag = (service) => {
    if (service.weightTag) return service.weightTag;
    const nameLower = (service.name || "").toLowerCase();
    if (nameLower.includes("20")) return "20kg";
    if (nameLower.includes("30")) return "30kg";
    return null;
  };

  const toggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
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
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    } catch {
      return "09/26/2026";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pt-24 pb-20 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <div className="mb-4">
          <BackButton label="Quay lại chọn chuyến bay" to="/flights" />
        </div>

        {/* Hero Section matching reference image */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <SuitcaseRolling size={22} weight="fill" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Dịch vụ bổ sung
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-medium pl-1">
              Tăng thêm sự thoải mái cho hành trình của bạn với các gói tiện ích được thiết kế riêng.
            </p>
          </div>

          {/* Airplane Image matching right side of reference image */}
          <div className="hidden md:block absolute right-0 top-0 -translate-y-4 w-72 h-36 pointer-events-none">
            <img
              src="https://static.vecteezy.com/system/resources/previews/035/719/664/non_2x/ai-generated-image-of-a-large-airliner-flying-in-the-sky-free-photo.jpg"
              alt="SkyLink Airplane"
              className="w-full h-full object-contain filter drop-shadow-xl opacity-90 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left 2x2 Services Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(services.length > 0 ? services : defaultMockServices).map((service, idx) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);

              return (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggleService(service)}
                  className={`relative bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${isSelected
                    ? "border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                    }`}
                >
                  {/* Top Popular Badge if exists */}
                  {service.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Star size={11} weight="fill" /> {service.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Top Row: Service Image & Text */}
                    <div className="flex items-start gap-4 mb-4">

                      {/* Left Graphic Box */}
                      <div className="relative w-24 h-24 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 overflow-hidden group">
                        <img
                          src={getServiceImage(service, idx)}
                          alt={service.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImages[idx % fallbackImages.length];
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Circular Badges on bottom right of image box */}
                        {getWeightTag(service) ? (
                          <span className="absolute bottom-1.5 right-1.5 bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md tracking-tight z-10">
                            {getWeightTag(service)}
                          </span>
                        ) : (service.iconType === "meal" || (service.name || "").toLowerCase().includes("ăn") || idx === 2) ? (
                          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                            <ForkKnife size={12} weight="bold" />
                          </div>
                        ) : (service.iconType === "priority" || (service.name || "").toLowerCase().includes("ưu tiên") || idx === 3) ? (
                          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                            <Sparkle size={12} weight="bold" />
                          </div>
                        ) : null}
                      </div>

                      {/* Right Title & Description */}
                      <div className="flex-1 pr-4">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-1">
                          {service.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {service.description || "Tận hưởng trải nghiệm bay cao cấp hơn."}
                        </p>

                        <div className="mt-3">
                          <span className="text-sm font-extrabold text-blue-600">
                            +{formatCurrency(service.price)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal"> / {service.unit || "gói"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Select Button matching screenshot */}
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                        }`}
                    >
                      {isSelected ? (
                        <>
                          <Check size={14} weight="bold" /> Đã chọn dịch vụ
                        </>
                      ) : (
                        <>
                          Chọn dịch vụ <ArrowRight size={13} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Footer Tags Strip matching screenshot */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">♥</span> {service.tags?.[0] || "Áp dụng cho mọi hành khách"}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">✈</span> {service.tags?.[1] || "Hỗ trợ tận tình"}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Right Sticky Flight Summary Sidebar matching screenshot */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-28 space-y-5">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AirplaneInFlight size={18} weight="bold" className="text-blue-600" />
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Tóm tắt chuyến bay
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {selectedFlights.length > 1 ? "Khứ hồi" : "Chuyến đi"}
                </span>
              </div>

              {/* Route Info */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>{primaryFlight.departure_airport?.city_name || "Đà Nẵng"} ({primaryFlight.departure_airport?.code || "DAD"})</span>
                  <span className="text-slate-400 font-normal">→</span>
                  <span>{primaryFlight.arrival_airport?.city_name || "Phú Quốc"} ({primaryFlight.arrival_airport?.code || "PQC"})</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CalendarBlank size={14} className="text-slate-400" />
                    {formatDate(primaryFlight.departure_time)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    1 hành khách <span className="text-[10px] text-slate-400">(Phổ thông)</span>
                  </span>
                </div>
              </div>

              {/* Selected Services Box */}
              <div className="bg-blue-50/70 border border-blue-100/80 rounded-2xl p-4 space-y-3">
                {selectedServices.length === 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <SuitcaseRolling size={16} className="text-blue-600" /> Chưa chọn dịch vụ bổ sung
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                      Bạn có thể chọn thêm các dịch vụ để chuyến đi thoải mái hơn.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block mb-1">
                      Dịch vụ đã chọn ({selectedServices.length})
                    </span>
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs bg-white rounded-xl p-2 border border-blue-100 shadow-2xs">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">+{formatCurrency(s.price)}</span>
                          <button
                            type="button"
                            onClick={() => toggleService(s)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <X size={14} weight="bold" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">
                      {formatCurrency(grandTotal)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Đã bao gồm thuế, phí
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button matching screenshot */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                Tiếp tục thanh toán <ArrowRight size={16} weight="bold" />
              </button>

              {/* Security Footer Note */}
              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <LockKey size={13} className="text-slate-400" /> Thanh toán an toàn • Bảo mật thông tin
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Page Bottom Footer Slogan matching reference image */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-slate-400 italic flex items-center justify-center gap-2">
            <AirplaneInFlight size={15} className="text-blue-400" /> Hành trình của bạn, chúng tôi luôn đồng hành —
          </p>
        </div>

      </div>
    </motion.div>
  );
}