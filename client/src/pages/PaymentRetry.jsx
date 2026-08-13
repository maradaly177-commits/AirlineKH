import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CreditCard, DeviceMobile, QrCode, CheckCircle, AirplaneTilt } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import CountdownTimer from "../components/CountdownTimer";

export default function PaymentRetry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId: routeBookingId } = useParams();

  const reschedulePaymentData = JSON.parse(localStorage.getItem("reschedule_payment_data") || "null");
  const bookingId = location.state?.bookingId || routeBookingId || reschedulePaymentData?.bookingId;
  const amount = location.state?.amount || reschedulePaymentData?.amount;
  const booking = location.state?.booking || null;
  const paymentType = location.state?.type || reschedulePaymentData?.type || "payment";
  const newFlightId = location.state?.newFlightId || reschedulePaymentData?.newFlightId;

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    vnpayCard: "",
    vnpayPin: "",
    momoPhone: "",
    momoPin: ""
  });

  useEffect(() => {
    if (!booking && !bookingId) {
      setRedirecting(true);
      navigate("/my-bookings");
    }
  }, [booking, bookingId, navigate]);

  if (redirecting) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      alert("Vui lòng đăng nhập lại.");
      navigate("/login");
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

    setLoading(true);

    try {
      let apiUrl = "http://127.0.0.1:8000/api/bookings/pay";
      let requestBody = {
        booking_ids: [parseInt(bookingId)],
        payment_method: paymentMethod
      };

      if (paymentType === 'reschedule') {
        apiUrl = `http://127.0.0.1:8000/api/bookings/${bookingId}/pay-reschedule`;
        requestBody = {
          new_flight_id: newFlightId,
          payment_method: paymentMethod
        };
      }

      const payRes = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const payData = await payRes.json();

      if (payRes.ok && payData.status === "success") {
        if (paymentType === 'reschedule') {
           localStorage.removeItem('reschedule_payment_data');
           alert(`Thanh toán và đổi chuyến bay thành công!`);
        } else {
           alert(`Thanh toán thành công cho mã đặt chỗ: ${booking?.pnr_code || bookingId}`);
        }
        navigate("/my-bookings");
      } else {
        alert("Thanh toán thất bại: " + (payData.message || "Vui lòng thử lại."));
      }

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-24 pt-24"
    >
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-8 -ml-3">
          <BackButton to="/my-bookings" label="Quay lại lịch sử đặt vé" />
        </div>

        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Thanh toán vé đang chờ</h1>
              {booking ? (
                <p className="text-zinc-500 font-medium mt-1">Mã đặt chỗ (PNR): <span className="font-bold text-zinc-900">{booking.pnr_code}</span></p>
              ) : (
                <p className="text-zinc-500 font-medium mt-1">Thanh toán đổi chuyến</p>
              )}
              {booking?.expires_at && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg inline-block">
                  <CountdownTimer 
                    expiresAt={booking.expires_at} 
                    onExpire={() => {
                      alert("Đơn đặt chỗ đã hết hạn thanh toán!");
                      navigate("/my-bookings");
                    }} 
                  />
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm text-zinc-500 block mb-1">Tổng tiền cần thanh toán</span>
              <span className="text-3xl font-black text-emerald-600">{formatCurrency(amount || booking?.total_amount || 0)}</span>
            </div>
          </div>

          <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-3 text-zinc-900 mt-8 border-t pt-8">
            Chọn phương thức thanh toán
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl mb-8">
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

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            {!loading && <CheckCircle size={20} weight="bold" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
