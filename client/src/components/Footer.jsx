import React from "react";
import { Link } from "react-router-dom";
import {
  PaperPlaneTilt,
  Phone,
  EnvelopeSimple,
  MapPin,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo
} from "@phosphor-icons/react";

// Official Real SVG Logos for Payments & Certifications
const VisaLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.123 1.258L12.55 15.242H8.225L5.02 3.822C4.825 3.09 4.654 2.824 4.07 2.502C3.12 1.996 1.636 1.517 0.28 1.226L0.378 0.772H7.073C7.948 0.772 8.73 1.353 8.925 2.348L10.63 11.458L14.862 0.772H19.123V1.258ZM36.035 10.457C36.05 6.47 30.505 6.25 30.544 4.456C30.56 3.918 31.085 3.336 32.228 3.184C32.793 3.109 34.364 3.048 36.094 3.844L36.782 0.627C35.836 0.284 34.618 0 33.09 0C29.07 0 26.216 2.128 26.19 5.176C26.155 7.432 28.175 8.694 29.718 9.444C31.302 10.213 31.835 10.71 31.825 11.403C31.81 12.464 30.549 12.929 29.385 12.946C27.327 12.977 26.128 12.39 25.174 11.947L24.464 15.263C25.429 15.706 27.218 16.082 29.066 16.102C33.328 16.102 36.022 13.996 36.035 10.457ZM46.545 15.242H50.316L46.995 0.772H43.486C42.707 0.772 42.046 1.226 41.764 1.895L35.666 15.242H39.873L40.71 12.916H45.864L46.545 15.242ZM41.875 9.878L44.013 3.998L45.241 9.878H41.875ZM25.076 0.772L21.674 15.242H17.653L21.055 0.772H25.076Z" fill="#1434CB" />
  </svg>
);

const MastercardLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="22" rx="3" fill="transparent" />
    <circle cx="13" cy="11" r="9" fill="#EB001B" />
    <circle cx="23" cy="11" r="9" fill="#F79E1B" />
    <path d="M18 4.39A9 9 0 0013 11a9 9 0 005 6.61A9 9 0 0023 11a9 9 0 00-5-6.61z" fill="#FF5F00" />
  </svg>
);

const VnpayLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 76 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="76" height="22" rx="4" fill="#005BAA" />
    <text x="7" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="0.5">VN</text>
    <text x="31" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#E31837" letterSpacing="0.5">PAY</text>
    <path d="M60 4L66 11L60 18H65L71 11L65 4H60Z" fill="#E31837" />
    <path d="M66 4L72 11L66 18H71L77 11L71 4H66Z" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

const MomoLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="5" fill="#A50064" />
    <circle cx="7" cy="8.5" r="3.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
    <circle cx="15" cy="8.5" r="3.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
    <path d="M5.5 14C5.5 14 7 17 11 17C15 17 16.5 14 16.5 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const NapasLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="20" rx="3" fill="#0072BC" />
    <text x="5" y="14.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" fontStyle="italic" letterSpacing="1">napas</text>
  </svg>
);

const IataBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
    <svg className="h-4 w-auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="#002D62" strokeWidth="2" fill="#E6F0FA" />
      <path d="M7 16H25M16 7V25M9 10C12 13 20 13 23 10M9 22C12 19 20 19 23 22" stroke="#002D62" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-black text-[#002D62] leading-none tracking-wider">IATA</span>
      <span className="text-[7px] font-extrabold uppercase text-zinc-400 leading-tight">Member</span>
    </div>
  </div>
);

const SkytraxBadge = () => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/80 shadow-xs hover:border-amber-300 transition-colors">
    <div className="flex text-amber-500 text-[10px] tracking-tighter">
      {"★".repeat(5)}
    </div>
    <div className="flex flex-col text-left border-l border-amber-200 pl-1.5">
      <span className="text-[9px] font-black text-amber-950 uppercase leading-none tracking-tight">SKYTRAX</span>
      <span className="text-[7px] font-bold text-amber-700 leading-tight">5-Star Airline</span>
    </div>
  </div>
);

const BoCongThuongBadge = () => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200 shadow-xs">
    <svg className="h-4 w-auto text-blue-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM10 15.5L6.5 12L7.91 10.59L10 12.67L16.09 6.59L17.5 8L10 15.5Z" />
    </svg>
    <div className="flex flex-col text-left">
      <span className="text-[8px] font-extrabold text-blue-900 uppercase leading-none">ĐÃ THÔNG BÁO</span>
      <span className="text-[6.5px] font-semibold text-blue-700 leading-tight">Bộ Công Thương</span>
    </div>
  </div>
);

// Official Real Color Social Media Logos
const FacebookRealIcon = () => (
  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#1877F2"/>
      <path d="M22 16.5H18.5V28H13.8V16.5H11.5V12.5H13.8V9.8C13.8 7.5 15.2 6 17.5 6H21V10H19C18.1 10 18 10.5 18 11.2V12.5H22.4L22 16.5Z" fill="white"/>
    </svg>
  </a>
);

const InstagramRealIcon = () => (
  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="igGradient" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#F56040" />
          <stop offset="75%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#igGradient)"/>
      <rect x="7" y="7" width="18" height="18" rx="5" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="16" cy="16" r="4.5" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="21.5" cy="10.5" r="1.2" fill="white"/>
    </svg>
  </a>
);

const YoutubeRealIcon = () => (
  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#FF0000"/>
      <path d="M23.5 11.2C23.2 10.1 22.4 9.3 21.3 9C19.4 8.5 16 8.5 16 8.5C16 8.5 12.6 8.5 10.7 9C9.6 9.3 8.8 10.1 8.5 11.2C8 13.1 8 16 8 16C8 16 8 18.9 8.5 20.8C8.8 21.9 9.6 22.7 10.7 23C12.6 23.5 16 23.5 16 23.5C16 23.5 19.4 23.5 21.3 23C22.4 22.7 23.2 21.9 23.5 20.8C24 18.9 24 16 24 16C24 16 24 13.1 23.5 11.2ZM14.4 19.2V12.8L19.9 16L14.4 19.2Z" fill="white"/>
    </svg>
  </a>
);

const TiktokRealIcon = () => (
  <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#000000"/>
      <path d="M21.5 11.8C20.2 11.6 19.1 10.8 18.6 9.6C18.4 9.2 18.3 8.6 18.3 8H15.5V19.4C15.4 20.8 14.2 22 12.8 22C11.3 22 10.1 20.8 10.1 19.3C10.1 17.8 11.3 16.6 12.8 16.6C13.2 16.6 13.5 16.7 13.8 16.8V13.9C13.5 13.8 13.1 13.8 12.8 13.8C9.7 13.8 7.2 16.3 7.2 19.4C7.2 22.5 9.7 25 12.8 25C15.8 25 18.3 22.6 18.4 19.6V13.8C19.7 14.8 21.3 15.3 23 15.3V12.5C22.5 12.5 22 12.2 21.5 11.8Z" fill="#25F4EE"/>
      <path d="M22.5 12.8C21.2 12.6 20.1 11.8 19.6 10.6C19.4 10.2 19.3 9.6 19.3 9H16.5V20.4C16.4 21.8 15.2 23 13.8 23C12.3 23 11.1 21.8 11.1 20.3C11.1 18.8 12.3 17.6 13.8 17.6C14.2 17.6 14.5 17.7 14.8 17.8V14.9C14.5 14.8 14.1 14.8 13.8 14.8C10.7 14.8 8.2 17.3 8.2 20.4C8.2 23.5 10.7 26 13.8 26C16.8 26 19.3 23.6 19.4 20.6V14.8C20.7 15.8 22.3 16.3 24 16.3V13.5C23.5 13.5 23 13.2 22.5 12.8Z" fill="#FE2C55"/>
      <path d="M22 12.3C20.7 12.1 19.6 11.3 19.1 10.1C18.9 9.7 18.8 9.1 18.8 8.5H16V19.9C15.9 21.3 14.7 22.5 13.3 22.5C11.8 22.5 10.6 21.3 10.6 19.8C10.6 18.3 11.8 17.1 13.3 17.1C13.7 17.1 14 17.2 14.3 17.3V14.4C14 14.3 13.6 14.3 13.3 14.3C10.2 14.3 7.7 16.8 7.7 19.9C7.7 23 10.2 25.5 13.3 25.5C16.3 25.5 18.8 23.1 18.9 20.1V14.3C20.2 15.3 21.8 15.8 23.5 15.8V13C23 13 22.5 12.7 22 12.3Z" fill="white"/>
    </svg>
  </a>
);

const ZaloRealIcon = () => (
  <a href="https://zalo.me" target="_blank" rel="noreferrer" aria-label="Zalo">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0068FF"/>
      <text x="4" y="20.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="0.3">Zalo</text>
    </svg>
  </a>
);

const LinkedinRealIcon = () => (
  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
    <svg className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0A66C2"/>
      <path d="M10.8 12.2H7.2V24H10.8V12.2ZM9 7C7.8 7 6.8 8 6.8 9.2C6.8 10.4 7.8 11.4 9 11.4C10.2 11.4 11.2 10.4 11.2 9.2C11.2 8 10.2 7 9 7ZM24.8 17.3C24.8 13.9 22.9 12 19.9 12C17.5 12 16.5 13.3 15.9 14.2V12.2H12.3C12.3 13.2 12.3 24 12.3 24H15.9V17.4C15.9 17.1 15.9 16.7 16 16.4C16.3 15.7 16.9 14.9 18 14.9C19.4 14.9 20 16 20 17.6V24H23.6V17.3H24.8Z" fill="white"/>
    </svg>
  </a>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white text-zinc-900 border-t border-zinc-200/80 pt-12 pb-8 relative font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* MAIN 4-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-10">

          {/* Cột 1: Thương hiệu & Thông tin liên hệ */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <PaperPlaneTilt size={20} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-zinc-900 block leading-none">SKYLINK</span>
                <span className="text-[8px] font-extrabold tracking-[0.2em] text-blue-600 uppercase">Airlines</span>
              </div>
            </Link>

            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-sm">
              Hãng hàng không thế hệ mới chuẩn 5 sao quốc tế. Trải nghiệm bay đẳng cấp, an toàn và tiện nghi trên mọi hành trình.
            </p>

            <div className="space-y-2 text-xs text-zinc-600 font-medium pt-1">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-blue-600 shrink-0" weight="fill" />
                <span>Tổng đài 24/7: <strong className="text-zinc-900 font-bold">1900 8888</strong> (Miễn phí)</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={15} className="text-blue-600 shrink-0" weight="fill" />
                <span>Email hỗ trợ: <strong className="text-zinc-800">vakhimkhean@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-blue-600 shrink-0" weight="fill" />
                <span>SkyLink Tower, Quận 1, TP. HÀ NỘI</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pt-1">
              <FacebookRealIcon />
              <InstagramRealIcon />
              <YoutubeRealIcon />
              <TiktokRealIcon />
              <ZaloRealIcon />
              <LinkedinRealIcon />
            </div>
          </div>

          {/* Cột 2: Chuyến bay & Dịch vụ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-l-2 border-blue-600 pl-2">
              Dịch vụ bay
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-500">
              <li>
                <Link to="/flights" className="hover:text-blue-600 transition-colors">Tìm & Đặt vé máy bay</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600 transition-colors">Dịch vụ bổ trợ</Link>
              </li>
              <li>
                <Link to="/services/transfer" className="hover:text-blue-600 transition-colors">Đưa đón sân bay VIP</Link>
              </li>
              <li>
                <Link to="/services/meals" className="hover:text-blue-600 transition-colors">Suất ăn cao cấp</Link>
              </li>
              <li>
                <Link to="/services/insurance" className="hover:text-blue-600 transition-colors">Bảo hiểm du lịch</Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hội viên & Đặt chỗ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-l-2 border-indigo-600 pl-2">
              Hội viên & Đặt chỗ
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-500">
              <li>
                <Link to="/skyclub" className="hover:text-blue-600 transition-colors">Hội viên SkyClub</Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-blue-600 transition-colors">Ưu đãi vé bay</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-600 transition-colors">Quản lý vé của tôi</Link>
              </li>
              <li>
                <Link to="/check-in" className="hover:text-blue-600 transition-colors">Check-in trực tuyến</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-blue-600 transition-colors">Trung tâm hỗ trợ</Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Quy định & Chính sách */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-l-2 border-sky-600 pl-2">
              Quy định & An toàn
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-500">
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Quy định hành lý</span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Hoàn đổi & Huỷ vé</span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Điều lệ vận chuyển</span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Chính sách bảo mật</span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Tiêu chuẩn an toàn ICAO</span>
              </li>
            </ul>
          </div>

        </div>

        {/* LOGO CHỨNG NHẬN & CỔNG THANH TOÁN THỰC TẾ */}
        <div className="border-t border-zinc-100 pt-6 pb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Chứng nhận quốc tế */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Chứng nhận:</span>
            <IataBadge />
            <SkytraxBadge />
            <BoCongThuongBadge />
          </div>

          {/* Cổng thanh toán chính thức */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Thanh toán:</span>
            <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/80 shadow-xs">
              <VnpayLogo />
              <MomoLogo />
              <VisaLogo />
              <MastercardLogo />
              <NapasLogo />
            </div>
          </div>
        </div>

        {/* BẢN QUYỀN & CHÍNH SÁCH */}
        <div className="border-t border-zinc-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400 font-medium">
          <p>© 2026 SkyLink Airlines Corporation. Nâng tầm mọi chuyến đi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-700 transition-colors cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-zinc-700 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-zinc-700 transition-colors cursor-pointer">Quy chế hoạt động</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
