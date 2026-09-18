import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  AirplaneTilt,
  ArrowRight,
  ShieldCheck,
  LockKey,
  Timer,
  User,
  IdentificationCard,
  Sparkle,
  Wallet,
  Bank,
  Check,
  Clock,
  SuitcaseRolling,
  ForkKnife
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Real Brand Payment Logos
const VnpayBrandLogo = () => (
  <svg className="h-7 w-auto" viewBox="0 0 76 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="76" height="22" rx="4" fill="#005BAA" />
    <text x="7" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="0.5">VN</text>
    <text x="31" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#E31837" letterSpacing="0.5">PAY</text>
    <path d="M60 4L66 11L60 18H65L71 11L65 4H60Z" fill="#E31837" />
    <path d="M66 4L72 11L66 18H71L77 11L71 4H66Z" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

const MomoBrandLogo = () => (
  <svg className="h-7 w-auto" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#A50064" />
    <circle cx="9" cy="11" r="4.2" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
    <circle cx="19" cy="11" r="4.2" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
    <path d="M7 18C7 18 9 22 14 22C19 22 21 18 21 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export default function Checkout() {
  const navigate = useNavigate();

  const searchParams = JSON.parse(localStorage.getItem("search_params")) || { passengers: { adults: 1, children: 0 } };
  const totalPassengers = (searchParams.passengers?.adults || 1) + (searchParams.passengers?.children || 0);

  const [passengers, setPassengers] = useState(
    Array.from({ length: totalPassengers }).map(() => ({ name: "", identity_number: "" }))
  );

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({ outbound: [], return: [] });
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  const [paymentDetails, setPaymentDetails] = useState({
    vnpayCard: "",
    vnpayPin: "",
    momoPhone: "",
    momoPin: ""
  });

  // Countdown timer for 15 minutes hold
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    const savedFlights = JSON.parse(localStorage.getItem("selected_flights")) || [];
    const savedServices = JSON.parse(localStorage.getItem("selected_services")) || [];
    const savedSeats = JSON.parse(localStorage.getItem("selected_seats")) || {};

    if (savedFlights.length === 0) {
      alert("Không tìm thấy thông tin chuyến bay! Vui lòng chọn lại.");
      navigate("/flights");
      return;
    }

    setFlights(savedFlights);
    setServices(savedServices);
    setSelectedSeats(savedSeats);
  }, [navigate]);

  if (flights.length === 0 || !selectedSeats) return null;

  // Tính tiền vé dựa vào giá của các ghế đã chọn
  const outboundSeatPrice = selectedSeats.outbound?.reduce((sum, s) => sum + Number(s.price), 0) || 0;
  const returnSeatPrice = selectedSeats.return?.reduce((sum, s) => sum + Number(s.price), 0) || 0;

  const basePrice = outboundSeatPrice + returnSeatPrice;
  const taxAmount = basePrice * 0.80; // Thuế 80% giá vé cơ bản
  const servicesTotal = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalAmount = basePrice + taxAmount + servicesTotal;

  const handleCheckout = async () => {
    const isAnyPassengerEmpty = passengers.some(p => !p.name || !p.identity_number);
    if (isAnyPassengerEmpty) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số CCCD/Passport cho tất cả hành khách.");
      return;
    }

    const isAnyCCCDInvalid = passengers.some(p => p.identity_number.replace(/\D/g, '').length < 11);
    if (isAnyCCCDInvalid) {
      alert("Số CCCD/Passport không hợp lệ (phải có ít nhất 11 chữ số).");
      return;
    }

    if (paymentMethod === 'vnpay') {
      if (!paymentDetails.vnpayCard || !paymentDetails.vnpayPin) {
        alert("Vui lòng nhập đầy đủ Số thẻ và Mã PIN VNPAY.");
        return;
      }
      if (paymentDetails.vnpayCard.replace(/\D/g, '').length < 4) {
        alert("Số thẻ VNPAY không hợp lệ.");
        return;
      }
    } else if (paymentMethod === 'momo') {
      if (!paymentDetails.momoPhone || !paymentDetails.momoPin) {
        alert("Vui lòng nhập Số điện thoại và Mật khẩu MoMo.");
        return;
      }
      if (paymentDetails.momoPhone.replace(/\D/g, '').length < 10) {
        alert("Số điện thoại MoMo không hợp lệ.");
        return;
      }
      if (paymentDetails.momoPin.length < 6) {
        alert("Mật khẩu MoMo phải có ít nhất 6 ký tự.");
        return;
      }
    }

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

    if (!token) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      if (!selectedSeats.outbound || selectedSeats.outbound.length !== totalPassengers) {
        alert("Thông tin ghế chưa đầy đủ. Vui lòng chọn lại.");
        setLoading(false);
        return;
      }

      const flightId = flights[0].id;
      const returnFlightId = flights.length > 1 ? flights[1].id : null;

      const checkoutPayload = {
        flight_id: flightId,
        return_flight_id: returnFlightId,
        service_ids: services.map(s => s.id),
        passengers: passengers.map((p, index) => ({
          name: p.name,
          identity_number: p.identity_number,
          outbound_seat_id: selectedSeats.outbound[index]?.id,
          return_seat_id: selectedSeats.return?.[index]?.id || null
        }))
      };

      const bookingRes = await fetch(`/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(checkoutPayload)
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || bookingData.status !== "success") {
        alert("Lỗi đặt vé: " + (bookingData.message || "Đơn giữ chỗ có thể đã hết hạn (15 phút)."));
        setLoading(false);
        return;
      }

      let createdBookingIds = [];
      let pnrCodes = [];
      if (Array.isArray(bookingData.data)) {
        createdBookingIds = bookingData.data.map(b => b.id);
        pnrCodes = bookingData.data.map(b => b.pnr_code);
      } else {
        createdBookingIds = [bookingData.data.id];
        pnrCodes = [bookingData.data.pnr_code];
      }

      const payRes = await fetch("/api/bookings/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_ids: createdBookingIds,
          payment_method: paymentMethod
        })
      });

      const payData = await payRes.json();

      if (payRes.ok && payData.status === "success") {
        alert(`Thanh toán thành công!\nMã đặt chỗ của bạn là: ${pnrCodes.join(', ')}`);
        localStorage.removeItem("selected_flights");
        localStorage.removeItem("selected_services");
        localStorage.removeItem("selected_seats");
        navigate("/my-bookings");
      } else {
        alert("Thanh toán thất bại: " + (payData.message || "Vui lòng thử lại."));
        navigate("/my-bookings");
      }

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  const handleHoldBooking = async () => {
    const isAnyPassengerEmpty = passengers.some(p => !p.name || !p.identity_number);
    if (isAnyPassengerEmpty) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số CCCD/Passport cho tất cả hành khách.");
      return;
    }

    const isAnyCCCDInvalid = passengers.some(p => p.identity_number.replace(/\D/g, '').length < 11);
    if (isAnyCCCDInvalid) {
      alert("Số CCCD/Passport không hợp lệ (phải có ít nhất 11 chữ số).");
      return;
    }

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) return navigate("/login");
    setLoading(true);
    try {
      const flightId = flights[0].id;
      const checkoutPayload = {
        flight_id: flightId,
        return_flight_id: flights.length > 1 ? flights[1].id : null,
        service_ids: services.map(s => s.id),
        passengers: passengers.map((p, index) => ({
          name: p.name,
          identity_number: p.identity_number,
          outbound_seat_id: selectedSeats.outbound[index]?.id,
          return_seat_id: selectedSeats.return?.[index]?.id || null
        }))
      };
      const res = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(checkoutPayload)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        alert("Đã giữ chỗ thành công! Vui lòng thanh toán trong thời gian quy định.");
        localStorage.removeItem("selected_flights");
        localStorage.removeItem("selected_services");
        localStorage.removeItem("selected_seats");
        navigate("/my-bookings");
      } else {
        alert("Lỗi đặt vé: " + (data.message || "Vui lòng thử lại."));
      }
    } catch (e) {
      alert("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString("vi-VN");
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
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

        {/* Top Back Navigation */}
        <div className="mb-4">
          <BackButton to="/services" label="Quay lại chọn dịch vụ" />
        </div>

        {/* Hero Header & Step Progress Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                Bước 03 / 03
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Timer size={14} weight="bold" className="animate-pulse" /> Đơn giữ chỗ hết hạn trong: <strong className="font-mono text-amber-700">{formatCountdown(timeLeft)}</strong>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Xác nhận & Thanh toán
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Hoàn tất thông tin hành khách và chọn phương thức thanh toán an toàn để nhận ngay mã đặt chỗ PNR.
            </p>
          </div>

          {/* Security Guarantee Badge */}
          <div className="hidden md:flex items-center gap-2.5 bg-blue-50/80 border border-blue-100 px-4 py-3 rounded-2xl shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={20} weight="fill" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-blue-900">Bảo mật mã hóa 256-bit</p>
              <p className="text-[11px] text-blue-600 font-medium">Thanh toán an toàn 100%</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: Passenger Information & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">

            {/* SECTION 1: PASSENGER DETAILS */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    Thông tin hành khách
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Nhập đúng họ tên theo CCCD/Hộ chiếu để làm thủ tục bay
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {passengers.map((p, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        <User size={14} weight="bold" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-800">
                        Hành khách {index + 1} <span className="text-xs font-semibold text-slate-400">({index === 0 ? "Người lớn chính" : "Hành khách đi kèm"})</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Input */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                          Họ và Tên (In hoa không dấu) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="NGUYEN VAN A"
                            value={p.name}
                            onChange={(e) => {
                              const newPassengers = [...passengers];
                              newPassengers[index].name = e.target.value.toUpperCase();
                              setPassengers(newPassengers);
                            }}
                            className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl text-slate-900 text-sm font-bold uppercase focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Identity Input */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                          Số CCCD / Hộ chiếu <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nhập 12 số CCCD"
                            value={p.identity_number}
                            onChange={(e) => {
                              const newPassengers = [...passengers];
                              newPassengers[index].identity_number = e.target.value;
                              setPassengers(newPassengers);
                            }}
                            className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2: PAYMENT METHOD SELECTION */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    Phương thức thanh toán
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Chọn cổng thanh toán thuận tiện nhất dành cho bạn
                  </p>
                </div>
              </div>

              {/* Payment Option Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    id: "vnpay",
                    title: "Cổng VNPAY / Thẻ ATM",
                    subtitle: "Hỗ trợ 40+ ngân hàng nội địa",
                    Logo: VnpayBrandLogo,
                    badge: "Khuyên dùng"
                  },
                  {
                    id: "momo",
                    title: "Ví Điện Tử MoMo",
                    subtitle: "Thanh toán quét mã nhanh chóng",
                    Logo: MomoBrandLogo,
                    badge: "Tức thì"
                  }
                ].map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isSelected
                          ? method.id === "vnpay"
                            ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20"
                            : "border-pink-600 bg-pink-50/50 shadow-xs ring-2 ring-pink-600/20"
                          : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                            <method.Logo />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 leading-snug">
                              {method.title}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {method.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Selection Radio Circle */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? method.id === "vnpay"
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-pink-600 bg-pink-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Check size={12} weight="bold" />}
                        </div>
                      </div>

                      {/* Bottom Badge */}
                      <div>
                        <span
                          className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? method.id === "vnpay"
                                ? "bg-blue-600 text-white"
                                : "bg-pink-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {method.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOCK PAYMENT DETAILS INPUT FIELD */}
              <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl">
                {paymentMethod === "vnpay" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Bank size={16} /> Nhập thông tin thẻ VNPAY Sandbox
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">Thanh toán thử nghiệm</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Số thẻ ATM / Tài khoản</label>
                      <input
                        type="text"
                        placeholder="Số thẻ ATM (VD: 9704 1985 1234 5678)"
                        value={paymentDetails.vnpayCard}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, vnpayCard: e.target.value })}
                        className="w-full bg-white border border-blue-200 px-4 py-3 rounded-xl text-slate-900 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Mật khẩu / Mã PIN bảo mật</label>
                      <input
                        type="password"
                        placeholder="••••••"
                        value={paymentDetails.vnpayPin}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, vnpayPin: e.target.value })}
                        className="w-full bg-white border border-blue-200 px-4 py-3 rounded-xl text-slate-900 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-extrabold text-pink-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Wallet size={16} /> Đăng nhập ví MoMo Sandbox
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">Thanh toán thử nghiệm</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Số điện thoại đăng ký MoMo</label>
                      <input
                        type="text"
                        placeholder="0901234567"
                        value={paymentDetails.momoPhone}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, momoPhone: e.target.value })}
                        className="w-full bg-white border border-pink-200 px-4 py-3 rounded-xl text-slate-900 text-sm font-bold outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Mật khẩu Ví MoMo (6 số)</label>
                      <input
                        type="password"
                        placeholder="••••••"
                        value={paymentDetails.momoPin}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, momoPin: e.target.value })}
                        className="w-full bg-white border border-pink-200 px-4 py-3 rounded-xl text-slate-900 text-sm font-bold outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: STICKY FLIGHT SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-28 space-y-5">

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">
                  Tóm tắt đơn hàng
                </h3>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Chi tiết vé
                </span>
              </div>

              {/* Flights Summary List */}
              <div className="space-y-4 pb-4 border-b border-slate-100">
                {flights.map((f, idx) => (
                  <div key={idx} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-blue-600 mb-2 tracking-wider">
                      <span>Chuyến {idx === 0 ? "Đi" : "Về"}</span>
                      <span className="text-slate-400 font-medium">{f.flight_number || "SK-888"}</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="text-center">
                        <span className="text-xl font-black text-slate-900 block leading-tight">{f.departure_airport?.code}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{f.departure_airport?.city_name}</span>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <AirplaneTilt size={18} weight="fill" className={`text-blue-600 ${idx === 1 ? "rotate-180 text-orange-500" : ""}`} />
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider">SKYLINK</span>
                      </div>

                      <div className="text-center">
                        <span className="text-xl font-black text-slate-900 block leading-tight">{f.arrival_airport?.code}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{f.arrival_airport?.city_name}</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 text-center">
                      📅 {formatDate(f.departure_time)} &bull; ⏰ {formatTime(f.departure_time)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Itemized Price Breakdown */}
              <div className="space-y-2.5 text-xs pb-4 border-b border-slate-100">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Giá vé cơ bản ({totalPassengers} khách)</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(basePrice)}</span>
                </div>

                {services.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1">
                      <Sparkle size={12} className="text-blue-600" /> {s.name}
                    </span>
                    <span className="font-extrabold text-slate-900">+{formatCurrency(s.price)}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Thuế, phí hệ thống (80%)</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(taxAmount)}</span>
                </div>
              </div>

              {/* Total Amount Box */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-slate-600 block tracking-wider">
                    Tổng thanh toán
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Đã bao gồm VAT & phí</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 tracking-tight block">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Payment Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    "Đang xử lý giao dịch..."
                  ) : (
                    <>
                      Xác nhận & Thanh toán <ArrowRight size={16} weight="bold" />
                    </>
                  )}
                </button>

                {/* Secondary Hold Booking Button */}
                <button
                  type="button"
                  onClick={handleHoldBooking}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-50 text-xs"
                >
                  <Clock size={14} className="text-slate-500" />
                  Đặt giữ chỗ (Thanh toán sau)
                </button>
              </div>

              {/* Terms note */}
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                🔒 Bằng việc nhấp vào nút thanh toán, bạn đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của SkyLink Airlines.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </motion.div>
  );
}