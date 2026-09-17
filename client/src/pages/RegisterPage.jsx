import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaperPlaneTilt, WarningCircle, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRedirectTarget = (isAdmin) => {
      if (isAdmin) return "/admin";
      const redirectParam = searchParams.get("redirect") || sessionStorage.getItem("auth_redirect");
      if (redirectParam) {
        sessionStorage.removeItem("auth_redirect");
        return redirectParam;
      }
      return "/";
    };

    // Lắng nghe kết quả trả về từ Popup Google OAuth
    const handleAuthMessage = (event) => {
      if (
        event.origin !== window.location.origin &&
        !event.origin.includes("localhost") &&
        !event.origin.includes("127.0.0.1")
      ) {
        return;
      }

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        const { token, user } = event.data;
        if (token && user) {
          localStorage.setItem("access_token", token);
          localStorage.setItem("user", JSON.stringify(user));

          const isAdmin =
            user.role === 1 ||
            user.role === "1" ||
            user.roles?.some((r) => r.name === "admin");

          setSuccess(`Chào mừng ${user.name || "bạn"}`);
          setTimeout(() => {
            window.location.href = getRedirectTarget(isAdmin);
          }, 600);
        }
      } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        setError(event.data.message || "Đăng ký Google không thành công.");
      }
    };

    // Kiểm tra nếu popup đã lưu token khi focus lại
    const handleWindowFocus = () => {
      const token = localStorage.getItem("access_token");
      const userRaw = localStorage.getItem("user");
      if (token && userRaw) {
        try {
          const user = JSON.parse(userRaw);
          const isAdmin =
            user.role === 1 ||
            user.role === "1" ||
            user.roles?.some((r) => r.name === "admin");
          window.location.href = getRedirectTarget(isAdmin);
        } catch (e) { }
      }
    };

    window.addEventListener("message", handleAuthMessage);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("message", handleAuthMessage);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      "/api/auth/google?mode=register",
      "google_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (regPassword !== regPasswordConfirm) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          password_confirmation: regPasswordConfirm
        })
      });

      const data = await response.json();

      if (data.status === "success") {
        if (data.access_token && data.user) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setSuccess("Đăng ký thành công! Đang chuyển tiếp...");
          const redirectParam = searchParams.get("redirect") || sessionStorage.getItem("auth_redirect");
          let target = "/";
          if (redirectParam) {
            sessionStorage.removeItem("auth_redirect");
            target = redirectParam;
          }
          setTimeout(() => { window.location.href = target; }, 1000);
        } else {
          setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
          setTimeout(() => navigate("/login"), 1500);
        }
      } else {
        if (data.errors) {
          const errorMsg = Object.values(data.errors).flat().join(" ");
          setError(errorMsg);
        } else {
          setError(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] flex flex-row-reverse bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white"
    >
      {/* Right: Background Scenery Image Column */}
      <div className="hidden lg:block w-[50%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('https://q4.itc.cn/images01/20241210/b2567eed8b1d4ee5a6881a7739d62312.jpeg')" }}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />
        </div>

        {/* Floating Brand Badge */}
        <div className="absolute top-10 right-10 z-10">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg cursor-pointer hover:bg-white transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <PaperPlaneTilt size={20} weight="fill" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              SkyLink Airlines
            </span>
          </div>
        </div>

        {/* Hero Quote Card at bottom right */}
        <div className="absolute bottom-12 right-10 left-16 z-10 text-white space-y-2 text-right">
          <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Gia nhập hội viên
          </span>
          <h2 className="text-3xl font-extrabold leading-snug drop-shadow-md">
            Trở thành hội viên SkyClub để nhận ngàn ưu đãi độc quyền
          </h2>
          <p className="text-slate-200 text-sm font-medium opacity-90">
            Tích điểm đổi vé, nâng hạng ghế VIP và tận hưởng dịch vụ ưu tiên tại mọi sân bay.
          </p>
        </div>
      </div>

      {/* Left: Form Column */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 py-12 bg-white">

        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <PaperPlaneTilt size={20} weight="fill" />
          </div>
          <span className="text-xl font-black text-slate-900">SKYLINK AIRLINES</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md space-y-5 text-center"
        >
          {/* Header titles */}
          <div className="space-y-1">
            <p className="text-slate-600 text-base font-medium">Create Your Account</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a2542] tracking-tight">
              Start Your Journey
            </h1>
          </div>

          {error && (
            <div className="text-left flex items-start gap-3 p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-200/80 text-sm">
              <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-red-600" />
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="text-left flex items-start gap-3 p-3.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/80 text-sm">
              <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="font-medium leading-relaxed">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 text-left pt-1">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-normal"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-normal"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password (min 6 chars)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-normal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="space-y-1 pb-2">
              <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-normal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e52db] hover:bg-[#1846c2] text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm cursor-pointer mt-1"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-slate-400 font-medium">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-lg border border-slate-300 transition-all text-sm shadow-xs cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign-in with Google</span>
          </button>

          <p className="text-slate-600 text-xs sm:text-sm pt-1 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#1e52db] hover:text-[#1846c2] font-semibold transition-colors cursor-pointer ml-1"
            >
              Login here
            </button>
          </p>

        </motion.div>
      </div>

    </motion.div>
  );
}
