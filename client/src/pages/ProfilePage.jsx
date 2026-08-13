import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { UserCircle, EnvelopeSimple, LockKey, CheckCircle, WarningCircle, Eye, EyeSlash } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setEmail(parsedUser.email || "");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          email: email !== user.email ? email : undefined,
          new_password: newPassword || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage(data.message);
        setUser(data.data);
        
        // Update local storage
        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(data.data));
        } else if (sessionStorage.getItem("user")) {
          sessionStorage.setItem("user", JSON.stringify(data.data));
        }

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Có lỗi xảy ra khi cập nhật hồ sơ.");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />

      <div className="pt-32 pb-24 max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-inner">
            <UserCircle size={32} weight="duotone" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3">
            Hồ sơ của tôi
          </h1>
          <p className="text-zinc-500 font-medium">
            Quản lý thông tin bảo mật tài khoản SkyLink của bạn
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: "auto", mb: 24 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3"
              >
                <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: "auto", mb: 24 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-start gap-3"
              >
                <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                <EnvelopeSimple size={18} weight="duotone" className="text-blue-500" /> Thông tin liên hệ
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 ml-1">Địa chỉ Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder="Nhập email mới..."
                />
              </div>
            </div>

            <hr className="border-zinc-100" />

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                <LockKey size={18} weight="duotone" className="text-blue-500" /> Thay đổi mật khẩu
              </h3>
              <p className="text-xs text-zinc-500 font-medium mb-4">Để trống nếu bạn không muốn thay đổi mật khẩu.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 ml-1">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium pr-10"
                      placeholder="Nhập mật khẩu mới..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showNewPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 ml-1">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium pr-10"
                      placeholder="Nhập lại mật khẩu mới..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-100">
              <div className="bg-blue-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
                <label className="block text-sm font-bold text-zinc-900 mb-2">
                  Xác nhận thay đổi
                </label>
                <p className="text-xs text-zinc-500 mb-4 font-medium">
                  Vui lòng nhập <strong className="text-zinc-700">mật khẩu hiện tại</strong> để lưu các thay đổi trên.
                </p>
                
                <div className="relative mb-5">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium pr-10 shadow-sm"
                    placeholder="Nhập mật khẩu hiện tại..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !currentPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Lưu thay đổi"
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
