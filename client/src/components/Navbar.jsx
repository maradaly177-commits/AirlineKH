import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import {
  PaperPlaneTilt,
  SignOut,
  Bell,
  X,
  CaretDown,
  Armchair,
  BagSimple,
  Coffee,
  Car,
  Star,
  Shield,
  Gift,
  CreditCard,
  Ticket,
  Globe,
  Headset,
  UserCircle,
  List,
  Sparkle
} from "@phosphor-icons/react";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Chuyến bay", href: "/flights" },
  {
    label: "Dịch vụ",
    href: "/services",
    mega: true,
    sections: [
      {
        title: "Trải nghiệm",
        items: [
          { icon: Coffee, label: "Bữa ăn đặc biệt", desc: "14 loại thực đơn tinh hoa", href: "/services/meals" },
          { icon: Car, label: "Đưa đón sân bay", desc: "Hệ thống xe sang trọng", href: "/services/transfer" },
        ],
      },
      {
        title: "Tiện ích",
        items: [
          { icon: Shield, label: "Bảo hiểm du lịch", desc: "An tâm trọn vẹn mọi hành trình", href: "/services/insurance" },
          { icon: Globe, label: "Visa & Hỗ trợ", desc: "Thủ tục nhanh gọn, chuẩn xác", href: "/services/visa" },
        ],
      },
      {
        title: "Khác",
        items: [
          { icon: Gift, label: "Quà tặng doanh nghiệp", desc: "Giải pháp cho công ty", href: "/services/corporate" },
          { icon: Headset, label: "Hotline 24/7", desc: "Hỗ trợ khách hàng: 1900 6067", href: "/support" },
        ],
      },
    ],
  },
  { label: "Khuyến mãi", href: "/promotions" },
  { label: "Hỗ trợ", href: "/support" },
  {
    label: "SkyClub",
    href: "/skyclub",
    badge: "PREMIUM",
  },
];

// ─── Magnetic Button Hook ─────────────────────────────────────────────────────

function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const springY = useSpring(y, { stiffness: 350, damping: 25 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

// ─── MagneticWrapper ──────────────────────────────────────────────────────────

function MagneticWrapper({ children, strength = 0.25 }) {
  const { ref, springX, springY, handleMouseMove, handleMouseLeave } = useMagnetic(strength);
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// ─── NavLink Component ────────────────────────────────────────────────────────

function NavLink({ item, isActive, onHover, isHovered }) {
  const navigate = useNavigate();
  const [localHovered, setLocalHovered] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    navigate(item.href);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => { setLocalHovered(true); onHover?.(item.label); }}
      onMouseLeave={() => { setLocalHovered(false); onHover?.(null); }}
    >
      <motion.button
        onClick={handleClick}
        className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer select-none"
        whileTap={{ scale: 0.96 }}
      >
        {/* Active / Hover Background Pill */}
        <AnimatePresence>
          {(isActive || localHovered) && (
            <motion.span
              layoutId="navHighlight"
              className={`absolute inset-0 rounded-full ${
                isActive ? "bg-blue-50 text-blue-600 font-extrabold" : "bg-slate-100/70"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
        </AnimatePresence>

        <span className={`relative z-10 transition-colors ${isActive ? "text-blue-600 font-bold" : "text-slate-700 hover:text-blue-600"}`}>
          {item.label}
        </span>

        {item.badge && (
          <span className="relative z-10 text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-2xs ml-0.5">
            {item.badge}
          </span>
        )}

        {item.mega && (
          <motion.span
            animate={{ rotate: localHovered ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <CaretDown size={12} weight="bold" className={isActive ? "text-blue-600" : "text-slate-400"} />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

// ─── Notification Menu ────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Xác nhận đặt vé thành công",
    desc: "Mã PNR #SK8921 của bạn đã được thanh toán hoàn tất.",
    time: "10 phút trước",
    read: false,
    type: "success",
  },
  {
    id: 2,
    title: "Nhắc nhở làm thủ tục (Check-in)",
    desc: "Chuyến bay VN123 từ DAD đi PQC sẽ mở check-in trong 2 giờ nữa.",
    time: "1 giờ trước",
    read: false,
    type: "warning",
  },
  {
    id: 3,
    title: "Ưu đãi hội viên SkyClub",
    desc: "Tặng 500 điểm thưởng cho chuyến bay tiếp theo của bạn.",
    time: "1 ngày trước",
    read: false,
    type: "promo",
  },
];

function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all cursor-pointer"
        title="Thông báo"
      >
        <Bell size={20} weight="bold" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">Thông báo mới</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  Không có thông báo mới nào.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                    }}
                    className={`p-4 transition-colors cursor-pointer hover:bg-blue-50/40 flex items-start gap-3 ${
                      !n.read ? "bg-blue-50/20" : "bg-white"
                    }`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full shrink-0">
                      {!n.read ? (
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={`text-xs ${!n.read ? "font-black text-slate-900" : "font-semibold text-slate-700"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug font-medium">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 text-center bg-slate-50/40">
              <span className="text-[11px] font-bold text-slate-400">
                Trung tâm thông báo SkyLink Airlines
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mega Menu ────────────────────────────────────────────────────────────────

function MegaMenu({ sections }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] z-50"
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-slate-200/80 rounded-tl-sm" />

      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 overflow-hidden p-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="grid grid-cols-3 gap-6">
          {sections.map((section, si) => (
            <div key={si}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item, ii) => (
                  <motion.button
                    key={ii}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl hover:bg-blue-50/80 transition-all duration-150 group cursor-pointer text-left"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                      <item.icon size={16} weight="bold" className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Khám phá tất cả dịch vụ cao cấp của SkyLink</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/services")}
            className="text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors cursor-pointer"
          >
            Xem tất cả →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Guest Account Menu ────────────────────────────────────────────────────────

function GuestAccountMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100/80 flex items-center justify-center transition-all cursor-pointer border border-blue-100/60"
        title="Tài khoản người dùng"
      >
        <UserCircle size={22} weight="bold" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 overflow-hidden z-50 p-4"
          >
            <div className="text-center pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                <UserCircle size={28} weight="bold" />
              </div>
              <p className="text-sm font-black text-slate-900">Tài khoản SkyLink</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Đăng nhập để nhận ưu đãi hội viên</p>
            </div>

            <div className="py-3 grid grid-cols-2 gap-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); navigate("/register"); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
              >
                Đăng ký
              </button>
            </div>

            <div className="pt-2 space-y-1">
              {[
                { icon: Ticket, label: "Tra cứu & Vé của tôi", href: "/my-bookings" },
                { icon: Armchair, label: "Check-in trực tuyến", href: "/check-in" },
                { icon: Star, label: "Quyền lợi SkyClub", href: "/skyclub" },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setOpen(false); navigate(item.href); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-700 transition-all text-left cursor-pointer"
                >
                  <item.icon size={16} weight="bold" className="text-blue-600 shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Avatar Menu ──────────────────────────────────────────────────────────────

function AvatarMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.name ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "U";

  return (
    <div className="relative" ref={menuRef}>
      <MagneticWrapper>
        <motion.button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 h-10 pl-1 pr-3 bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/60 rounded-full cursor-pointer transition-all"
          whileTap={{ scale: 0.96 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-xs">
            {initials}
          </div>
          <span className="text-xs font-extrabold text-slate-800 hidden md:block max-w-[90px] truncate">
            {user.name?.split(" ").pop()}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <CaretDown size={11} weight="bold" className="text-slate-500" />
          </motion.span>
        </motion.button>
      </MagneticWrapper>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 overflow-hidden z-50"
          >
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <div className="p-4 border-b border-slate-100">
              <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user.email || "Thành viên SkyLink"}</p>
              <div className="mt-2.5 flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 rounded-xl px-2.5 py-1.5">
                <Star size={12} weight="fill" className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-700">SkyClub Premium Gold</span>
              </div>
            </div>

            <div className="p-2 space-y-0.5">
              {[
                { icon: UserCircle, label: "Hồ sơ của tôi", href: "/profile" },
                { icon: Ticket, label: "Chuyến bay của tôi", href: "/my-bookings" },
                { icon: CreditCard, label: "Thanh toán", href: "/payment" },
                { icon: Star, label: "SkyClub", href: "/skyclub" },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => { navigate(item.href); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-700 transition-all cursor-pointer"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <item.icon size={16} weight="bold" className="text-slate-400" />
                  {item.label}
                </motion.button>
              ))}

              <div className="border-t border-slate-100 mt-1 pt-1">
                <motion.button
                  onClick={() => { onLogout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-rose-50 text-xs font-bold text-rose-600 transition-all cursor-pointer"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <SignOut size={16} weight="bold" />
                  Đăng xuất
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [scrollY, setScrollY] = useState(0);
  const [logoutMsg, setLogoutMsg] = useState("");
  const megaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const matched = NAV_LINKS.find((l) => location.pathname.startsWith(l.href) && l.href !== "/");
    setActiveLink(matched?.label ?? null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setHoveredItem(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    ["access_token", "user"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    setUser(null);
    setLogoutMsg("Đã đăng xuất thành công.");
    setTimeout(() => { setLogoutMsg(""); navigate("/"); }, 1500);
  };

  const isElevated = scrollY > 20;

  return (
    <>
      {/* Floating Container Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-3 pointer-events-none">
        <motion.nav
          className="pointer-events-auto w-full max-w-7xl"
          animate={{ y: isElevated ? 0 : 0 }}
        >
          <motion.div
            animate={{
              boxShadow: isElevated
                ? "0 12px 40px -6px rgba(15,23,42,0.08), 0 4px 16px -2px rgba(59,130,246,0.06)"
                : "0 6px 30px -4px rgba(15,23,42,0.05), 0 2px 10px -2px rgba(59,130,246,0.04)",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-between h-[66px] px-5 sm:px-6 rounded-[24px] border border-blue-100/80 backdrop-blur-2xl"
          >
            {/* Top Light Accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

            {/* Left: SKYLINK AIRLINES Logo */}
            <MagneticWrapper strength={0.15}>
              <motion.button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer select-none group"
                whileTap={{ scale: 0.96 }}
              >
                {/* Blue-purple Squircle Logo Container */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0 transition-transform group-hover:scale-105">
                  <PaperPlaneTilt size={22} weight="fill" className="text-white transform -rotate-12" />
                </div>

                {/* Brand Typography */}
                <div className="flex flex-col text-left -space-y-0.5">
                  <span className="text-[19px] font-black tracking-tight text-slate-900 leading-none">
                    SKYLINK
                  </span>
                  <span className="text-[10px] font-extrabold tracking-[0.25em] text-blue-600 uppercase">
                    AIRLINES
                  </span>
                </div>
              </motion.button>
            </MagneticWrapper>

            {/* Center: Nav Navigation Links */}
            <div ref={megaRef} className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <NavLink
                    item={item}
                    isActive={activeLink === item.label}
                    onHover={setHoveredItem}
                    isHovered={hoveredItem === item.label}
                  />

                  {/* Mega Dropdown */}
                  <AnimatePresence>
                    {item.mega && hoveredItem === item.label && (
                      <MegaMenu key="mega" sections={item.sections} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right: Actions Section */}
            <div className="flex items-center gap-3">
              
              {/* Interactive Notification Menu */}
              <NotificationMenu />

              {user ? (
                <AvatarMenu user={user} onLogout={handleLogout} />
              ) : (
                <div className="flex items-center gap-2">
                  {/* User Profile Avatar Icon Dropdown */}
                  <GuestAccountMenu />

                  {/* Login Button */}
                  <MagneticWrapper>
                    <motion.button
                      onClick={() => navigate("/login")}
                      className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200/80 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Đăng nhập
                    </motion.button>
                  </MagneticWrapper>

                  {/* Register Button */}
                  <MagneticWrapper>
                    <motion.button
                      onClick={() => navigate("/register")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-5 py-2 rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Đăng ký
                    </motion.button>
                  </MagneticWrapper>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 text-slate-600 hover:text-blue-600 cursor-pointer"
              >
                {mobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
              </button>

            </div>

          </motion.div>
        </motion.nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200 p-6 shadow-2xl lg:hidden space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.href); setMobileMenuOpen(false); }}
                  className="text-left font-bold text-slate-800 hover:text-blue-600 py-2.5 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black bg-amber-400 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Toast */}
      <AnimatePresence>
        {logoutMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -16, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-24 left-1/2 z-[9999] bg-slate-900/95 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl border border-slate-800 flex items-center gap-2"
          >
            <span className="text-emerald-400 font-black">✓</span>
            {logoutMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

