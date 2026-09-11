import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  PaperPlaneTilt, 
  Ticket, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  WarningCircle, 
  Clock, 
  Headset, 
  ArrowUpRight,
  Printer,
  PlusCircle,
  CheckCircle,
  CaretRight,
  X,
} from '@phosphor-icons/react';
import BoardingPassDisplay from '../components/BoardingPassDisplay';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckInPage.css';

/**
 * CheckInPage Component
 * 
 * Trang Check-in điện tử chuẩn Hãng hàng không SkyLink (Form + Thẻ lên máy bay)
 */
export default function CheckInPage() {
  const [searchParams] = useSearchParams();

  // State quản lý dữ liệu form
  const [pnrCode, setPnrCode] = useState('');
  const [passengerName, setPassengerName] = useState('');
  
  // Tự động lấy email từ user đang đăng nhập
  const [email, setEmail] = useState(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.email || '' : '';
    } catch {
      return '';
    }
  });

  // Auto fill form fields from query params when page loads
  useEffect(() => {
    const pnr = searchParams.get('pnr');
    const name = searchParams.get('name');
    const mail = searchParams.get('email');
    if (pnr) {
      setPnrCode(pnr.toUpperCase());
    }
    if (name) {
      setPassengerName(name);
    }
    if (mail) {
      setEmail(mail);
    }
  }, [searchParams]);

  const [safetyCommitment, setSafetyCommitment] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // State quản lý trạng thái xử lý
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boardingPass, setBoardingPass] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);

  /**
   * Xử lý sự kiện Check-in
   */
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!pnrCode.trim()) {
      setError('Vui lòng nhập mã đặt chỗ (PNR)');
      return;
    }

    if (!passengerName.trim()) {
      setError('Vui lòng nhập tên hành khách');
      return;
    }

    if (!safetyCommitment) {
      setError('Vui lòng xác nhận cam kết an toàn bay');
      return;
    }

    if (!termsAgreed) {
      setError('Vui lòng đồng ý với các điều khoản và điều kiện');
      return;
    }

    // Gọi API Check-in kèm token xác thực và email nếu có
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post('/api/check-in', {
        pnr_code: pnrCode.toUpperCase(),
        passenger_name: passengerName.trim(),
        email: email.trim() || undefined,
      }, { headers });

      if (response.data.status === 'success') {
        setBoardingPass(response.data.data);
        setShowSuccessBanner(true);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra khi Check-in. Vui lòng kiểm tra lại Mã PNR và Tên hành khách.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * In lại thẻ lên máy bay
   */
  const handlePrintAgain = () => {
    window.print();
  };

  /**
   * Check-in thêm hành khách khác
   */
  const handleCheckInAnother = () => {
    setBoardingPass(null);
    setPnrCode('');
    setPassengerName('');
    setSafetyCommitment(false);
    setTermsAgreed(false);
    setError('');
  };

  // NẾU ĐÃ CHECK-IN THÀNH CÔNG: Hiển thị giao diện Thẻ Lên Máy Bay trên nền Bầu Trời tươi sáng
  if (boardingPass) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-[#6b8cff] via-[#859eff] to-[#c7d5ff] flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
        <Navbar />

        {/* Bright Sky Background & Plane Graphic */}
        <div className="relative pt-24 pb-20 px-4 md:px-8 flex-1 flex flex-col items-center">
          
          {/* Background Sky Image */}
          <div 
            className="absolute inset-0 bg-cover bg-top opacity-85 mix-blend-soft-light pointer-events-none"
            style={{ 
              backgroundImage: "url('/skylink_checkin_bg.png')" 
            }}
          />

          {/* Airplane Flying Graphic Top Right */}
          <div className="absolute top-14 right-4 lg:right-24 w-72 lg:w-96 opacity-90 pointer-events-none z-10">
            <img 
              src="https://png.pngtree.com/png-clipart/20230508/original/pngtree-blue-airplane-flying-in-cloudy-sky-png-image_9151593.png" 
              alt="SkyLink Airplane Flying"
              className="w-full object-contain filter drop-shadow-xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div className="relative z-20 max-w-3xl lg:max-w-4xl w-full space-y-6 pt-2">
            
            {/* Top Teal-Green Success Notification Banner (Có nút bấm đóng X) */}
            {showSuccessBanner && (
              <div className="p-5 md:p-6 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-700/90 backdrop-blur-md rounded-3xl border border-emerald-400/40 shadow-xl shadow-teal-950/20 text-white flex items-start justify-between gap-4 animate-fadeIn">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle size={28} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">Check-in thành công!</h2>
                    <p className="text-emerald-100 text-xs md:text-sm font-medium mt-0.5 leading-relaxed">
                      Bạn đã hoàn tất thủ tục check-in. Vui lòng lưu hoặc in thẻ lên máy bay và có mặt tại cổng khởi hành trước giờ bay ít nhất 2 giờ.
                    </p>
                  </div>
                </div>

                {/* Nút bấm đóng (Close button) */}
                <button
                  type="button"
                  onClick={() => setShowSuccessBanner(false)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all shrink-0 cursor-pointer active:scale-95"
                  title="Đóng thông báo"
                  aria-label="Đóng thông báo"
                >
                  <X size={22} weight="bold" />
                </button>
              </div>
            )}

            {/* Boarding Pass Component */}
            <BoardingPassDisplay boardingPass={boardingPass} />

            {/* Action Buttons Below Card */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
              
              {/* Primary Action Button: In Thẻ Lên Máy Bay / Tải PDF */}
              <button 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                onClick={handlePrintAgain}
              >
                <Printer size={22} weight="bold" />
                <span>In Thẻ Lên Máy Bay / Tải PDF</span>
                <CaretRight size={18} weight="bold" />
              </button>

              {/* Secondary Action Button: Check-in Hành Khách Khác */}
              <button 
                className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-white text-blue-600 font-extrabold text-base md:text-lg rounded-2xl shadow-lg border border-blue-200 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                onClick={handleCheckInAnother}
              >
                <PlusCircle size={22} weight="bold" />
                <span>Check-in Hành Khách Khác</span>
                <CaretRight size={18} weight="bold" />
              </button>

            </div>

          </div>

          {/* Bottom Footer Trust Line */}
          <div className="relative z-20 max-w-3xl lg:max-w-4xl w-full mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-800 text-xs md:text-sm font-extrabold border-t border-white/40 pt-6">
            <div className="flex items-center gap-2 text-slate-800">
              <PaperPlaneTilt size={18} weight="fill" className="text-blue-700" />
              <span>Bay cùng SkyLink – Kết nối những hành trình tuyệt vời</span>
            </div>
            <div className="flex items-center gap-6 text-slate-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-emerald-700" weight="bold" />
                <span>An toàn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Headset size={18} className="text-purple-700" weight="bold" />
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PaperPlaneTilt size={18} className="text-blue-700" weight="bold" />
                <span>SkyLink Airlines</span>
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    );
  }

  // Form Check-in tỉ lệ rộng rãi (max-w-3xl đến max-w-4xl) sang trọng
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#6b8cff] via-[#859eff] to-[#c7d5ff] flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      <Navbar />

      {/* Bright Sky Cloud Layer & Graphics */}
      <div className="relative pt-24 pb-24 px-4 md:px-8 flex-1 flex flex-col items-center">
        
        {/* Background Sky Image */}
        <div 
          className="absolute inset-0 bg-cover bg-top opacity-85 mix-blend-soft-light pointer-events-none"
          style={{ 
            backgroundImage: "url('/skylink_checkin_bg.png')" 
          }}
        />

        {/* Airplane Flying Graphic on Top Right */}
        <div className="absolute top-14 right-4 lg:right-24 w-72 lg:w-96 opacity-90 pointer-events-none z-10 transform translate-x-2 -translate-y-2">
          <img 
            src="https://png.pngtree.com/png-clipart/20230508/original/pngtree-blue-airplane-flying-in-cloudy-sky-png-image_9151593.png" 
            alt="SkyLink Airplane Flying"
            className="w-full object-contain filter drop-shadow-xl"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Airplane Wing Graphic on Left Side */}
        <div className="absolute top-1/3 left-0 w-48 md:w-80 opacity-40 pointer-events-none z-10 hidden sm:block">
          <img 
            src="https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-airplane-wing-in-the-clouds-sky-view-from-the-window-png-image_4983020.png" 
            alt="Airplane Wing View"
            className="w-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Top Header Banner - Rộng Rãi */}
        <div className="relative z-20 max-w-3xl lg:max-w-4xl w-full text-left mb-6 pt-4 px-2">
          <div className="flex items-center gap-2 mb-2 text-white/90 font-semibold tracking-wide text-sm drop-shadow-sm">
            <PaperPlaneTilt size={20} weight="fill" className="text-white" />
            <span>SkyLink Airlines</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
            Check-in Điện Tử SkyLink Airlines
          </h1>
          <p className="text-white/95 text-base md:text-lg font-medium drop-shadow-sm">
            Vui lòng nhập thông tin của bạn để Check-in 24 giờ trước khi cất cánh
          </p>
        </div>

        {/* Main White Card Container - Rộng max-w-3xl đến max-w-4xl */}
        <div className="relative z-20 max-w-3xl lg:max-w-4xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-blue-950/20 overflow-hidden border border-white/90">
          
          <form className="p-6 md:p-12 lg:p-14 space-y-7 md:space-y-8" onSubmit={handleCheckIn}>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium animate-fadeIn">
                <WarningCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-red-500" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Section Title */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <PaperPlaneTilt size={22} weight="fill" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                Thông tin hành khách
              </h2>
            </div>

            {/* Input 1: Mã Đặt Chỗ (PNR) */}
            <div className="space-y-2.5">
              <label htmlFor="pnr-code" className="block text-sm md:text-base font-bold text-slate-800">
                Mã Đặt Chỗ (PNR) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-100/90 flex items-center justify-center text-slate-500 border border-slate-200/60">
                  <Ticket size={22} weight="bold" />
                </div>
                <input
                  id="pnr-code"
                  type="text"
                  placeholder="Ví dụ: BQCV0E"
                  value={pnrCode}
                  onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  disabled={loading}
                  className="w-full pl-16 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all uppercase tracking-wider text-base md:text-lg"
                  required
                />
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium pl-1">
                Mã 6 ký tự được ghi trên vé hoặc email xác nhận
              </p>
            </div>

            {/* Input 2: Họ Và Tên */}
            <div className="space-y-2.5">
              <label htmlFor="passenger-name" className="block text-sm md:text-base font-bold text-slate-800">
                Họ Và Tên <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-100/90 flex items-center justify-center text-slate-500 border border-slate-200/60">
                  <User size={22} weight="bold" />
                </div>
                <input
                  id="passenger-name"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-16 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base md:text-lg"
                  required
                />
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium pl-1">
                Tên phải trùng khớp với hộ chiếu hoặc giấy tờ tùy thân
              </p>
            </div>

            {/* Box 1: Cam Kết An Toàn Bay */}
            <div className="p-6 md:p-8 bg-[#f0f4ff] rounded-3xl border border-blue-100/90 space-y-5">
              <div className="flex items-center gap-3 text-blue-900 font-extrabold text-lg md:text-xl">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                  <ShieldCheck size={22} weight="fill" />
                </div>
                <h3>Cam Kết An Toàn Bay</h3>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                Theo quy định của hãng hàng không, vui lòng xác nhận rằng bạn không mang theo các vật phẩm sau:
              </p>

              <ul className="space-y-3 text-sm md:text-base text-slate-700 pl-1 font-semibold">
                <li className="flex items-center gap-3.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 shadow-sm shadow-red-500/30"></span>
                  <span>Chất nổ, lửa pháo, hoặc vật phẩm dễ cháy</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 text-center shrink-0 text-emerald-600 font-extrabold text-lg">🔋</div>
                  <span>Pin dự phòng có công suất cao (trên 100Wh)</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 text-center shrink-0 text-blue-600 font-extrabold text-lg">🔧</div>
                  <span>Lưỡi dao, cạo, dao bỏ túi, hoặc dụng cụ sắc nhọn</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 text-center shrink-0 text-purple-600 font-extrabold text-lg">🧪</div>
                  <span>Chất hóa học, axit, hay chất nguy hiểm khác</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 text-center shrink-0 text-amber-600 font-extrabold text-lg">🎯</div>
                  <span>Vũ khí bất kỳ loại nào</span>
                </li>
              </ul>

              <label htmlFor="safety-commitment" className="flex items-start gap-3.5 pt-3 cursor-pointer group">
                <input
                  id="safety-commitment"
                  type="checkbox"
                  checked={safetyCommitment}
                  onChange={(e) => setSafetyCommitment(e.target.checked)}
                  disabled={loading}
                  className="mt-1 w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  required
                />
                <span className="text-sm md:text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                  Tôi xác nhận rằng tôi không mang theo các vật phẩm cấm và cam kết tuân thủ các quy định an toàn bay
                </span>
              </label>
            </div>

            {/* Box 2: Điều khoản & Điều kiện */}
            <div className="p-5 bg-[#f4f7ff] rounded-2xl border border-blue-100/80">
              <label htmlFor="terms-agreed" className="flex items-center gap-3.5 cursor-pointer group">
                <input
                  id="terms-agreed"
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  disabled={loading}
                  className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  required
                />
                <span className="text-sm md:text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Tôi đồng ý với{' '}
                  <a 
                    href="#terms" 
                    onClick={(e) => { e.preventDefault(); alert("Điều khoản dịch vụ SkyLink Airlines: Hành khách tuân thủ quy định giờ làm thủ tục và mang theo giấy tờ tùy thân hợp lệ."); }} 
                    className="text-blue-600 underline font-black hover:text-blue-700 inline-flex items-center gap-0.5"
                  >
                    các điều khoản và điều kiện <ArrowUpRight size={15} weight="bold" />
                  </a>{' '}
                  của SkyLink Airlines
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 md:py-5 px-8 bg-gradient-to-r from-[#5351e8] via-[#6366f1] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <PaperPlaneTilt size={24} weight="fill" />
              <span>{loading ? 'Đang xử lý...' : 'Check-in Ngay'}</span>
              <ArrowRight size={22} weight="bold" />
            </button>

          </form>

        </div>

        {/* Footer Feature Badges Below Main Card */}
        <div className="relative z-20 max-w-3xl lg:max-w-4xl w-full mt-10 flex flex-col sm:flex-row items-center justify-around gap-6 text-slate-800 text-sm md:text-base font-extrabold pt-2">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/70 shadow-sm">
            <Clock size={22} className="text-blue-700" weight="bold" />
            <span>Nhanh chóng & Tiện lợi</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/70 shadow-sm">
            <ShieldCheck size={22} className="text-emerald-700" weight="bold" />
            <span>An toàn & Bảo mật</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/70 shadow-sm">
            <Headset size={22} className="text-purple-700" weight="bold" />
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
