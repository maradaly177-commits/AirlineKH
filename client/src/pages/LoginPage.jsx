import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaperPlaneTilt, WarningCircle, CheckCircle } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    const getRedirectTarget = (isAdmin) => {
      if (isAdmin) return "/admin";
      const redirectParam = searchParams.get("redirect") || sessionStorage.getItem("auth_redirect");
      if (redirectParam) {
        sessionStorage.removeItem("auth_redirect");
        return redirectParam;
      }
      const savedFlights = JSON.parse(localStorage.getItem("selected_flights") || "[]");
      if (savedFlights.length > 0 && savedFlights[0]?.id) {
        return `/seat-selection?flight_id=${encodeURIComponent(savedFlights[0].id)}`;
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
        setError(event.data.message || "Đăng nhập Google không thành công.");
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
        } catch (e) {}
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
      "/api/auth/google?mode=login",
      "google_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
    );
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    });

    const data = await response.json();

    if (data.status === "success") {
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", data.access_token);
      storage.setItem("user", JSON.stringify(data.user));

      const isAdmin =
        data.user.role === 1 ||
        data.user.role === "1" ||
        data.user.roles?.some(r => r.name === "admin");

      setSuccess(`Chào mừng ${data.user.name}`);

      const redirectParam = searchParams.get("redirect") || sessionStorage.getItem("auth_redirect");
      let target = isAdmin ? "/admin" : "/";
      if (!isAdmin) {
        if (redirectParam) {
          sessionStorage.removeItem("auth_redirect");
          target = redirectParam;
        } else {
          const savedFlights = JSON.parse(localStorage.getItem("selected_flights") || "[]");
          if (savedFlights.length > 0 && savedFlights[0]?.id) {
            target = `/seat-selection?flight_id=${encodeURIComponent(savedFlights[0].id)}`;
          }
        }
      }

      setTimeout(() => {
        window.location.href = target;
      }, 800);
    } else {
      setError(data.message || "Đăng nhập thất bại");
    }
  } catch (err) {
    setError("Không thể kết nối tới máy chủ");
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
      className="min-h-[100dvh] flex bg-zinc-50 font-sans text-zinc-900 selection:bg-blue-600 selection:text-white"
    >
      
      {/* Left: Form Side */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24">
        
        <div 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold tracking-tighter text-zinc-900 cursor-pointer flex items-center gap-2 mb-16"
        >
          <PaperPlaneTilt weight="fill" className="text-blue-600" />
          SKYLINK
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Đăng nhập</h1>
          <p className="text-zinc-500 mb-8 font-medium">Truy cập tài khoản Skylink của bạn.</p>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
              <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
              <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">{success}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Mật khẩu</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group pt-2 pb-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 transition-colors"
              />
              <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
                Ghi nhớ thiết bị này
              </span>
            </label>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-50 px-3 text-zinc-400 font-semibold tracking-wider">Hoặc</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100/80 text-zinc-800 font-semibold py-3.5 px-4 rounded-xl border border-zinc-200/90 transition-all active:scale-[0.98] shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          <p className="text-zinc-500 text-sm mt-8 font-medium">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Đăng ký ngay
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right: Image Side */}
      <div className="hidden lg:block w-[55%] p-4">
        <div 
          className="w-full h-full rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}
        >
        </div>
      </div>

    </motion.div>
  );
}