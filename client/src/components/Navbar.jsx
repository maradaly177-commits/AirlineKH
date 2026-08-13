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
    badge: "Premium",
  },
];



// ─── Magnetic Button Hook ─────────────────────────────────────────────────────

function useMagnetic(strength = 0.3) {
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
        className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer select-none"
        whileTap={{ scale: 0.97 }}
      >
        {/* Active / Hover Background */}
        <AnimatePresence>
          {(isActive || localHovered) && (
            <motion.span
              layoutId="navHighlight"
              className={`absolute inset-0 rounded-xl ${isActive ? "bg-blue-600/10 border border-blue-200/60" : "bg-zinc-100/80"}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </AnimatePresence>

        <span className={`relative z-10 ${isActive ? "text-blue-600" : "text-zinc-700"}`}>
          {item.label}
        </span>

        {item.badge && (
          <span className="relative z-10 text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            {item.badge}
          </span>
        )}

        {item.mega && (
          <motion.span
            animate={{ rotate: localHovered ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <CaretDown size={12} weight="bold" className={isActive ? "text-blue-500" : "text-zinc-400"} />
          </motion.span>
        )}

        {/* Underline */}
        {!item.mega && (
          <motion.span
            className="absolute bottom-1 left-3.5 right-3.5 h-[2px] rounded-full bg-blue-500"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </motion.button>
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
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/90 border-l border-t border-zinc-200/60 rounded-tl-sm" />

      <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl border border-zinc-200/60 shadow-2xl shadow-zinc-900/10 overflow-hidden p-6">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-sky-400" />

        <div className="grid grid-cols-3 gap-6">
          {sections.map((section, si) => (
            <div key={si}>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item, ii) => (
                  <motion.button
                    key={ii}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 transition-all duration-150 group cursor-pointer text-left"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <item.icon size={16} weight="duotone" className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 group-hover:text-blue-700 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">Khám phá tất cả dịch vụ cao cấp của SkyLink</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/services")}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Xem tất cả →
          </motion.button>
        </div>
      </div>
    </motion.div>
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
          className="flex items-center gap-2.5 h-10 pl-1 pr-3.5 bg-zinc-100/80 hover:bg-zinc-200/60 border border-zinc-200/60 rounded-full cursor-pointer transition-all"
          whileTap={{ scale: 0.96 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
            {initials}
          </div>
          <span className="text-sm font-semibold text-zinc-700 hidden md:block max-w-[80px] truncate">
            {user.name?.split(" ").pop()}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <CaretDown size={11} weight="bold" className="text-zinc-400" />
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
            className="absolute right-0 top-full mt-3 w-52 bg-white/95 backdrop-blur-2xl rounded-2xl border border-zinc-200/60 shadow-2xl shadow-zinc-900/10 overflow-hidden z-50"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-sky-400" />

            <div className="p-4 border-b border-zinc-100">
              <p className="text-xs font-black text-zinc-900 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{user.email || "Thành viên SkyLink"}</p>
              <div className="mt-2.5 flex items-center gap-1.5 bg-amber-50 rounded-lg px-2.5 py-1.5">
                <Star size={11} weight="fill" className="text-amber-500" />
                <span className="text-[10px] font-bold text-amber-700">SkyClub Gold Member</span>
              </div>
            </div>

            <div className="p-2">
              {[
                { icon: UserCircle, label: "Hồ sơ của tôi", href: "/profile" },
                { icon: Ticket, label: "Chuyến của tôi", href: "/my-bookings" },
                { icon: CreditCard, label: "Thanh toán", href: "/payment" },
                { icon: Star, label: "SkyClub", href: "/skyclub" },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => { navigate(item.href); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-sm font-medium text-zinc-700 hover:text-blue-700 transition-all cursor-pointer"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <item.icon size={15} weight="duotone" className="text-zinc-400" />
                  {item.label}
                </motion.button>
              ))}

              <div className="border-t border-zinc-100 mt-1 pt-1">
                <motion.button
                  onClick={() => { onLogout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-medium text-red-500 hover:text-red-600 transition-all cursor-pointer"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <SignOut size={15} weight="duotone" />
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

/**
 * SkyLink World-Class Floating Pill Navbar
 *
 * Architecture:
 *  - Floating pill with glassmorphism (Apple/Linear-inspired)
 *  - Magnetic hover (Stripe-inspired micro-interaction)
 *  - Mega dropdown menu for "Dịch vụ"
 *  - Expandable search bar with spring animation
 *  - Notification panel with badge
 *  - Avatar menu with user context
 *  - Scroll-aware elevation via shadow/blur transitions
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
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

  // Close mega menu on outside click
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
    setTimeout(() => { setLogoutMsg(""); navigate("/"); }, 2000);
  };

  // Compute pill elevation on scroll
  const isElevated = scrollY > 20;

  return (
    <>
      {/* ── Navbar Container ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
        <motion.nav
          className="pointer-events-auto w-full max-w-6xl"
          animate={{
            y: isElevated ? 0 : 0,
          }}
        >
          <motion.div
            animate={{
              boxShadow: isElevated
                ? "0 8px 40px -4px rgba(0,0,0,0.14), 0 2px 12px -2px rgba(0,0,0,0.08)"
                : "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 8px -1px rgba(0,0,0,0.04)",
                backgroundColor: isElevated ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.65)",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex items-center justify-between h-[60px] px-4 rounded-2xl border border-slate-200/40 backdrop-blur-[28px]"
          >
            {/* ── Gradient Top Shimmer ── */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* ── Logo ── */}
            <MagneticWrapper strength={0.2}>
              <motion.button
                onClick={() => navigate("/")}
                className="flex items-center gap-2.5 cursor-pointer select-none"
                whileTap={{ scale: 0.96 }}
              >
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <PaperPlaneTilt size={20} weight="fill" className="text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-base font-black tracking-tight text-zinc-900 leading-none">SKYLINK</span>
                  <span className="text-[8px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Airlines</span>
                </div>
              </motion.button>
            </MagneticWrapper>

            {/* ── Nav Links ── */}
            <div
              ref={megaRef}
              className="hidden md:flex items-center gap-0.5"
            >
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

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {item.mega && hoveredItem === item.label && (
                      <MegaMenu key="mega" sections={item.sections} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-2">

              {user ? (
                <AvatarMenu user={user} onLogout={handleLogout} />
              ) : (
                <div className="flex items-center gap-2">
                  <MagneticWrapper>
                    <motion.button
                      onClick={() => navigate("/login")}
                      className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Đăng nhập
                    </motion.button>
                  </MagneticWrapper>

                  <MagneticWrapper>
                    <motion.button
                      onClick={() => navigate("/register")}
                      className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      whileHover={{ scale: 1.04, boxShadow: "0 6px 20px -2px rgba(99,102,241,0.4)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Đăng ký
                    </motion.button>
                  </MagneticWrapper>
                </div>
              )}
            </div>
          </motion.div>
        </motion.nav>
      </div>

      {/* ── Logout Toast ── */}
      <AnimatePresence>
        {logoutMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -16, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-24 left-1/2 z-[9999] bg-zinc-900/95 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl border border-zinc-800/50 flex items-center gap-2"
          >
            <span className="text-emerald-400">✓</span>
            {logoutMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
