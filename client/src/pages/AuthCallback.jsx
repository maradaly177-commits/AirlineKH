import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaperPlaneTilt, CheckCircle, WarningCircle, CircleNotch } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Đang xử lý đăng nhập Google...");

  useEffect(() => {
    const processAuth = () => {
      const error = searchParams.get("error");
      const token = searchParams.get("token");
      const userRaw = searchParams.get("user");

      // Nếu đang mở dưới dạng Popup Window (giống Booking.com)
      const isPopup = Boolean(window.opener && window.opener !== window);

      if (error) {
        const errorMsg = decodeURIComponent(error) || "Đăng nhập Google thất bại.";
        if (isPopup) {
          try {
            window.opener.postMessage(
              { type: "GOOGLE_AUTH_ERROR", message: errorMsg },
              window.location.origin
            );
            window.close();
            return;
          } catch (e) {
            // fallback
          }
        }
        setStatus("error");
        setMessage(errorMsg);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      if (token && userRaw) {
        try {
          const user = JSON.parse(decodeURIComponent(userRaw));

          // Lưu token vào localStorage ngay lập tức
          localStorage.setItem("access_token", token);
          localStorage.setItem("user", JSON.stringify(user));

          if (isPopup) {
            try {
              window.opener.postMessage(
                { type: "GOOGLE_AUTH_SUCCESS", token, user },
                "*"
              );
              window.close();
              return;
            } catch (e) {
              console.warn("Could not postMessage to opener:", e);
            }
          }

          setStatus("success");
          setMessage(`Đăng nhập thành công! Chào mừng ${user.name || "bạn"}`);

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
            navigate(target);
          }, 1000);
        } catch (e) {
          setStatus("error");
          setMessage("Dữ liệu xác thực không hợp lệ.");
          setTimeout(() => navigate("/login"), 2500);
        }
      } else {
        setStatus("error");
        setMessage("Không tìm thấy thông tin xác thực.");
        setTimeout(() => navigate("/login"), 2500);
      }
    };

    processAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xl shadow-zinc-200/50 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <PaperPlaneTilt weight="fill" className="text-blue-600 text-3xl" />
        </div>

        {status === "processing" && (
          <div>
            <CircleNotch className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Đang xác thực</h2>
            <p className="text-zinc-500 text-sm font-medium">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle weight="fill" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Xác thực thành công</h2>
            <p className="text-zinc-600 text-sm font-medium">{message}</p>
            <p className="text-xs text-zinc-400 mt-4">Đang chuyển hướng về trang chủ...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <WarningCircle weight="fill" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Xác thực không thành công</h2>
            <p className="text-red-600 text-sm font-medium">{message}</p>
            <p className="text-xs text-zinc-400 mt-4">Đang chuyển về trang đăng nhập...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
