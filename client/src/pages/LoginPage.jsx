import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaperPlaneTilt, WarningCircle, CheckCircle } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
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

      setTimeout(() => {
        navigate(isAdmin ? "/admin" : "/");
      }, 1000);
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
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

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