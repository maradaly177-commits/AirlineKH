import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PaperPlaneTilt,
  Phone,
  EnvelopeSimple,
  MapPin,
  CaretRight,
  ShieldCheck,
  Lock,
  ChatCircleDots
} from "@phosphor-icons/react";

// Official Real SVG Logos for Payments & Certifications
const VisaLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.123 1.258L12.55 15.242H8.225L5.02 3.822C4.825 3.09 4.654 2.824 4.07 2.502C3.12 1.996 1.636 1.517 0.28 1.226L0.378 0.772H7.073C7.948 0.772 8.73 1.353 8.925 2.348L10.63 11.458L14.862 0.772H19.123V1.258ZM36.035 10.457C36.05 6.47 30.505 6.25 30.544 4.456C30.56 3.918 31.085 3.336 32.228 3.184C32.793 3.109 34.364 3.048 36.094 3.844L36.782 0.627C35.836 0.284 34.618 0 33.09 0C29.07 0 26.216 2.128 26.19 5.176C26.155 7.432 28.175 8.694 29.718 9.444C31.302 10.213 31.835 10.71 31.825 11.403C31.81 12.464 30.549 12.929 29.385 12.946C27.327 12.977 26.128 12.39 25.174 11.947L24.464 15.263C25.429 15.706 27.218 16.082 29.066 16.102C33.328 16.102 36.022 13.996 36.035 10.457ZM46.545 15.242H50.316L46.995 0.772H43.486C42.707 0.772 42.046 1.226 41.764 1.895L35.666 15.242H39.873L40.71 12.916H45.864L46.545 15.242ZM41.875 9.878L44.013 3.998L45.241 9.878H41.875ZM25.076 0.772L21.674 15.242H17.653L21.055 0.772H25.076Z" fill="#1434CB" />
  </svg>
);

const MastercardLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="22" rx="3" fill="transparent" />
    <circle cx="13" cy="11" r="9" fill="#EB001B" />
    <circle cx="23" cy="11" r="9" fill="#F79E1B" />
    <path d="M18 4.39A9 9 0 0013 11a9 9 0 005 6.61A9 9 0 0023 11a9 9 0 00-5-6.61z" fill="#FF5F00" />
  </svg>
);

const VnpayLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 76 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="76" height="22" rx="4" fill="#005BAA" />
    <text x="7" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="0.5">VN</text>
    <text x="31" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#E31837" letterSpacing="0.5">PAY</text>
  </svg>
);

const MomoLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="5" fill="#A50064" />
    <circle cx="7" cy="8.5" r="3.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
    <circle cx="15" cy="8.5" r="3.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
    <path d="M5.5 14C5.5 14 7 17 11 17C15 17 16.5 14 16.5 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const NapasLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="20" rx="3" fill="#0072BC" />
    <text x="5" y="14.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" fontStyle="italic" letterSpacing="1">napas</text>
  </svg>
);

const ApplePayLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 40 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="18" rx="3" fill="#000000" />
    <text x="5" y="13" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#FFFFFF">Pay</text>
  </svg>
);

const GooglePayLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 44 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="18" rx="3" fill="#FFFFFF" stroke="#E2E8F0" />
    <text x="4" y="13" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#5F6368">GPay</text>
  </svg>
);

// Social Media Icons
const FacebookIcon = () => (
  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-blue-600/20 hover:bg-blue-600 flex items-center justify-center text-blue-400 hover:text-white transition-all transform hover:scale-110">
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.75 5.65c1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.77-1.61 1.56V12h2.74l-.44 3h-2.3v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>
  </a>
);

const TwitterIcon = () => (
  <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-full bg-sky-500/20 hover:bg-sky-500 flex items-center justify-center text-sky-400 hover:text-white transition-all transform hover:scale-110">
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.58 8.58 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
  </a>
);

const InstagramIcon = () => (
  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-pink-600/20 hover:bg-pink-600 flex items-center justify-center text-pink-400 hover:text-white transition-all transform hover:scale-110">
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
  </a>
);

export default function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#0b1736] via-[#0a1329] to-[#050b1a] text-slate-300 border-t border-cyan-500/20 pt-16 pb-10 relative font-sans overflow-hidden">

      {/* Top subtle blue glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* MAIN 4-COLUMN GRID matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">

          {/* COLUMN 1: Brand & Bio (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <PaperPlaneTilt size={22} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-none">SkyLink</span>
                <span className="text-[9px] font-extrabold tracking-[0.25em] text-cyan-400 uppercase">Airlines</span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed">
              Hãng hàng không thế hệ mới chuẩn 5 sao quốc tế. Trải nghiệm các chuyến bay mượt mà, tiện nghi đẳng cấp với ưu đãi tốt nhất toàn cầu.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-cyan-400 shrink-0" weight="fill" />
                <span>Tổng đài 24/7: <strong className="text-white font-bold">1900 8888</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={15} className="text-cyan-400 shrink-0" weight="fill" />
                <span>Email: <strong className="text-slate-200">lymarada55@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-cyan-400 shrink-0" weight="fill" />
                <span>SkyLink Tower, Quận 1, TP. HÀ NỘI</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <FacebookIcon />
              <TwitterIcon />
              <InstagramIcon />
            </div>
          </div>

          {/* COLUMN 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Dịch vụ bay
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/flights" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Tìm & Đặt vé máy bay
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Dịch vụ bổ trợ
                </Link>
              </li>
              <li>
                <Link to="/services/transfer" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Đưa đón sân bay VIP
                </Link>
              </li>
              <li>
                <Link to="/services/meals" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Suất ăn cao cấp
                </Link>
              </li>
              <li>
                <Link to="/services/insurance" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Bảo hiểm du lịch
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Support & Booking (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Hội viên & Đặt chỗ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/skyclub" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Hội viên SkyClub
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Ưu đãi vé bay
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Quản lý vé của tôi
                </Link>
              </li>
              <li>
                <Link to="/check-in" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Check-in trực tuyến
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-cyan-400 transition-colors flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Trung tâm hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Rules & Regulations (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Quy định & An toàn
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Quy định hành lý
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Hoàn đổi & Huỷ vé
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Điều lệ vận chuyển
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Chính sách bảo mật
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center group">
                  <span className="text-cyan-400 font-bold mr-1.5 text-xs opacity-75 group-hover:translate-x-0.5 transition-transform">›</span>
                  Tiêu chuẩn an toàn ICAO
                </span>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: Stay Updated / Newsletter & App Download (3 cols - matching Image 2) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Đăng ký nhận ưu đãi
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhập email để nhận thông báo ưu đãi độc quyền và mẹo du lịch tiết kiệm từ SkyLink.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Địa chỉ email của bạn..."
                  className="w-full bg-[#132247] border border-blue-500/30 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-md shadow-cyan-500/25 transition-all cursor-pointer text-center"
              >
                {subscribed ? "✓ Đã đăng ký thành công!" : "Đăng ký ngay"}
              </button>
            </form>

            {/* Download App Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">Tải ứng dụng SkyLink:</span>
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-black hover:bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                  <span className="text-white text-base"></span>
                  <div className="text-left leading-none">
                    <span className="text-[8px] text-slate-400 uppercase block">Download on</span>
                    <span className="text-[11px] font-bold text-white">App Store</span>
                  </div>
                </button>

                <button className="flex-1 bg-black hover:bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                  <span className="text-white text-xs font-black">▶</span>
                  <div className="text-left leading-none">
                    <span className="text-[8px] text-slate-400 uppercase block">GET IT ON</span>
                    <span className="text-[11px] font-bold text-white">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: Payment Methods & Badges */}
        <div className="border-t border-slate-800/80 pt-8 pb-4 flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Payment Methods */}
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[11px] font-semibold text-slate-400 block">Chấp nhận tất cả phương thức thanh toán:</span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <VisaLogo />
              <MastercardLogo />
              <VnpayLogo />
              <MomoLogo />
              <NapasLogo />
              <ApplePayLogo />
              <GooglePayLogo />
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-4 text-xs text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-800/40 px-4 py-2 rounded-full">
            <div className="flex items-center gap-1.5">
              <Lock size={14} weight="bold" />
              <span>Thanh toán an toàn</span>
            </div>
            <span className="text-emerald-800">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>Đã xác thực IATA 5-Star</span>
            </div>
          </div>

        </div>

        {/* COPYRIGHT FOOTER BAR */}
        <div className="border-t border-slate-800/60 pt-6 mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© 2026 SkyLink Airlines Corporation. All rights reserved.</p>
          <div className="flex items-center gap-5 text-slate-400">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">Sitemap</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
