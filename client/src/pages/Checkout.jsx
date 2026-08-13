import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, AirplaneTilt, ArrowRight, DeviceMobile, QrCode } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

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
      // BƯỚC 1: TẠO BOOKING
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

      const bookingRes = await fetch(`http://127.0.0.1:8000/api/bookings`, {
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

      // Lấy ID booking vừa tạo
      let createdBookingIds = [];
      let pnrCodes = [];
      if (Array.isArray(bookingData.data)) {
        createdBookingIds = bookingData.data.map(b => b.id);
        pnrCodes = bookingData.data.map(b => b.pnr_code);
      } else {
        createdBookingIds = [bookingData.data.id];
        pnrCodes = [bookingData.data.pnr_code];
      }

      // BƯỚC 2: THANH TOÁN MOCK API
      const payRes = await fetch("http://127.0.0.1:8000/api/bookings/pay", {
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
        // Lỗi thanh toán -> Booking sẽ ở trạng thái pending và bị cron xoá sau 5 phút
        navigate("/my-bookings");
      }

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối tới server.");
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
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
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
        
        {/* Quay lại chọn dịch vụ */}
        <div className="mb-8 -ml-3">
          <BackButton to="/services" label="Quay lại chọn dịch vụ" />
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Bước 03
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Thanh toán
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Hoàn tất thông tin hành khách và thanh toán để nhận mã đặt chỗ. Đơn đặt chỗ sẽ tự động bị hủy sau 15 phút nếu chưa được thanh toán.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN & PHƯƠNG THỨC */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* THÔNG TIN HÀNH KHÁCH */}
            <section className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-zinc-900">
                <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Thông tin hành khách
              </h2>
              
              <div className="space-y-6">
                {passengers.map((p, index) => (
                  <div key={index} className="p-6 rounded-xl border border-zinc-100 bg-zinc-50/50">
                    <h3 className="font-bold text-zinc-900 mb-4">Hành khách {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Họ và Tên</label>
                        <input 
                          type="text" 
                          placeholder="NGUYEN VAN A" 
                          value={p.name}
                          onChange={(e) => {
                            const newPassengers = [...passengers];
                            newPassengers[index].name = e.target.value.toUpperCase();
                            setPassengers(newPassengers);
                          }}
                          className="w-full bg-white border border-zinc-200 p-4 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold uppercase" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Số CCCD / Passport</label>
                        <input 
                          type="text" 
                          placeholder="Nhập số giấy tờ" 
                          value={p.identity_number}
                          onChange={(e) => {
                            const newPassengers = [...passengers];
                            newPassengers[index].identity_number = e.target.value;
                            setPassengers(newPassengers);
                          }}
                          className="w-full bg-white border border-zinc-200 p-4 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold" 
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <section className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-zinc-900">
                <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'vnpay', label: 'Cổng VNPAY', icon: QrCode },
                  { id: 'momo', label: 'Ví MoMo', icon: DeviceMobile }
                ].map((method) => (
                  <div 
                    key={method.id} 
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-6 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-3
                      ${paymentMethod === method.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-zinc-200 bg-white hover:border-zinc-300"}
                    `}
                  >
                     <method.icon size={32} weight={paymentMethod === method.id ? "fill" : "duotone"} className={paymentMethod === method.id ? "text-blue-600" : "text-zinc-400"} />
                     <span className={`text-sm font-semibold ${paymentMethod === method.id ? "text-blue-700" : "text-zinc-600"}`}>
                       {method.label}
                     </span>
                  </div>
                ))}
              </div>
              
              {/* VÙNG NHẬP LIỆU MOCK THANH TOÁN */}
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl">
                {paymentMethod === 'vnpay' && (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-blue-700 mb-2">Thanh toán an toàn qua cổng VNPAY</p>
                    <input 
                      type="text" 
                      placeholder="Số thẻ ATM (VD: 9704...)" 
                      value={paymentDetails.vnpayCard}
                      onChange={(e) => setPaymentDetails({...paymentDetails, vnpayCard: e.target.value})}
                      className="w-full bg-white border border-blue-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" 
                    />
                    <input 
                      type="password" 
                      placeholder="Mật khẩu / Mã PIN" 
                      value={paymentDetails.vnpayPin}
                      onChange={(e) => setPaymentDetails({...paymentDetails, vnpayPin: e.target.value})}
                      className="w-full bg-white border border-blue-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" 
                    />
                  </div>
                )}
                {paymentMethod === 'momo' && (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-pink-600 mb-2">Đăng nhập ví MoMo để thanh toán</p>
                    <input 
                      type="text" 
                      placeholder="Số điện thoại MoMo" 
                      value={paymentDetails.momoPhone}
                      onChange={(e) => setPaymentDetails({...paymentDetails, momoPhone: e.target.value})}
                      className="w-full bg-white border border-pink-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-semibold" 
                    />
                    <input 
                      type="password" 
                      placeholder="Mật khẩu MoMo (6 số)" 
                      value={paymentDetails.momoPin}
                      onChange={(e) => setPaymentDetails({...paymentDetails, momoPin: e.target.value})}
                      className="w-full bg-white border border-pink-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-semibold" 
                    />
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (STICKY) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] sticky top-8 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-6 text-zinc-900">
                Chi tiết chuyến bay
              </h3>
              
              {/* Tóm tắt Flights (Khứ hồi hoặc 1 chiều) */}
              <div className="border-b border-zinc-100 pb-6 mb-6 space-y-6">
                {flights.map((f, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">
                      CHUYẾN {idx === 0 ? "ĐI" : "VỀ"}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold tracking-tighter text-zinc-900">{f.departure_airport?.code}</span>
                      <div className="flex flex-col items-center text-zinc-400 px-4">
                        <AirplaneTilt size={20} weight="fill" className={idx === 1 ? "rotate-180 text-orange-500" : ""} />
                      </div>
                      <span className="text-2xl font-bold tracking-tighter text-zinc-900">{f.arrival_airport?.code}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-500">
                      {f.flight_number} &bull; {formatTime(f.departure_time)}, {formatDate(f.departure_time)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Giá tiền */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Giá vé cơ bản</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(basePrice)}</span>
                </div>
                
                {services.map(s => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span className="text-zinc-500">{s.name}</span>
                    <span className="font-semibold text-zinc-900">+{formatCurrency(s.price)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Thuế, phí hệ thống (80%)</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(taxAmount)}</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-6 mb-8 flex justify-between items-end">
                <span className="font-bold uppercase text-zinc-500 text-xs tracking-widest">Tổng thanh toán</span>
                <div className="text-right">
                   <span className="text-3xl font-bold tracking-tighter text-zinc-900 block leading-none mb-1">
                     {formatCurrency(totalAmount)}
                   </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
                  {!loading && <CheckCircle size={20} weight="bold" />}
                </button>
                
                <button 
                  onClick={async () => {
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
                      const res = await fetch(`http://127.0.0.1:8000/api/bookings`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify(checkoutPayload)
                      });
                      const data = await res.json();
                      if (res.ok && data.status === "success") {
                        alert("Đã giữ chỗ thành công! Vui lòng thanh toán trong thời gian quy định.");
                        localStorage.removeItem("selected_flights"); localStorage.removeItem("selected_services"); localStorage.removeItem("selected_seats");
                        navigate("/my-bookings");
                      } else {
                        alert("Lỗi đặt vé: " + (data.message || "Vui lòng thử lại."));
                      }
                    } catch (e) {
                      alert("Lỗi kết nối.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Đặt giữ chỗ (Thanh toán sau)
                </button>
              </div>

              <p className="mt-6 text-xs text-center text-zinc-400 font-medium leading-relaxed">
                Bằng việc nhấp vào thanh toán, bạn đồng ý với các Điều khoản & Điều kiện của Skylink.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}