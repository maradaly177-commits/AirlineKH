import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaperPlaneTilt, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
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
        setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000);
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] flex flex-row-reverse bg-zinc-50 font-sans text-zinc-900 selection:bg-blue-600 selection:text-white"
    >
      
      {/* Right: Form Side (Reversed for Variance) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24">
        
        <div 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold tracking-tighter text-zinc-900 cursor-pointer flex items-center gap-2 mb-12"
        >
          <PaperPlaneTilt weight="fill" className="text-blue-600" />
          SKYLINK
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Tạo tài khoản</h1>
          <p className="text-zinc-500 mb-8 font-medium">Bắt đầu hành trình cùng Skylink.</p>

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

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Mật khẩu</label>
              <input 
                type="password" 
                placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1.5 pb-4">
              <label className="text-sm font-semibold text-zinc-700">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                placeholder="Nhập lại mật khẩu"
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
                className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm mt-8 font-medium">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Đăng nhập
            </button>
          </p>
        </motion.div>
      </div>

      {/* Left: Image Side */}
      <div className="hidden lg:block w-[55%] p-4">
        <div 
          className="w-full h-full rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop')" }}
        >
        </div>
      </div>

    </motion.div>
  );
}
