import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaperPlaneTilt, WarningCircle, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        if (!isAdmin && redirectParam) {
          sessionStorage.removeItem("auth_redirect");
          target = redirectParam;
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] flex bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white"
    >
      {/* Left: Background Scenery Image Column */}
      <div className="hidden lg:block w-[50%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              "url('https://haycafe.vn/wp-content/uploads/2021/12/Hinh-anh-may-bay-tren-bau-troi-dep-1.jpg')"
          }}
        >
          {/* Overlay Gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>

        {/* Floating Brand Badge */}
        <div className="absolute top-10 left-10 z-10">
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

        {/* Hero Quote Card at bottom left */}
        <div className="absolute bottom-12 left-10 right-16 z-10 text-white space-y-2">
          <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Bay cùng SkyLink
          </span>
          <h2 className="text-3xl font-extrabold leading-snug drop-shadow-md">
            Khám phá thế giới rộng lớn với trải nghiệm 5 sao quốc tế
          </h2>
          <p className="text-slate-200 text-sm font-medium opacity-90">
            Hàng triệu hành trình đáng nhớ được khởi đầu từ chiếc vé của bạn.
          </p>
        </div>
      </div>

      {/* Right: Modern Card Form Column matching the User Screenshot */}
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
          className="w-full max-w-md space-y-6 text-center"
        >
          {/* Header titles matching the model image */}
          <div className="space-y-1">
            <p className="text-slate-600 text-base font-medium">Welcome Back!</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a2542] tracking-tight">
              Journey Begins Here
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

          <form onSubmit={handleLogin} className="space-y-4 text-left pt-2">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-normal text-sm"
                required
              />
            </div>

            {/* Password Field with Eye Toggle Icon */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-normal text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlash size={20} weight="regular" />
                  ) : (
                    <Eye size={20} weight="regular" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <span className="text-xs font-medium text-slate-600">Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">Quên mật khẩu?</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e52db] hover:bg-[#1846c2] active:bg-[#133aa8] text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm cursor-pointer mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider "or" */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-slate-400 font-medium">or</span>
            </div>
          </div>

          {/* Google Sign-in Button matching screenshot */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-lg border border-slate-300 transition-all text-sm shadow-xs cursor-pointer"
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
            <span>Sign-in with Google</span>
          </button>

          {/* Footer Registration Link */}
          <p className="text-slate-600 text-xs sm:text-sm pt-2 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#1e52db] hover:text-[#1846c2] font-semibold transition-colors cursor-pointer ml-1"
            >
              Register here
            </button>
          </p>

        </motion.div>
      </div>

    </motion.div>
  );
}