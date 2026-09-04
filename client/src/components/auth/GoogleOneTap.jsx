import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleOneTap() {
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu đã đăng nhập thì không hiện One Tap
    const token = localStorage.getItem("access_token");
    if (token) return;

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      ""; // Lấy từ env

    if (!clientId) return;

    // Load Google Identity Services script
    const loadGsiScript = () => {
      if (document.getElementById("google-gsi-script")) {
        initOneTap();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initOneTap();
      };
      document.body.appendChild(script);
    };

    const initOneTap = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleOneTapResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Hiển thị One Tap prompt ở góc trên bên phải
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          // One tap không hiển thị (do cookie hoặc người dùng đã tắt)
        }
      });
    };

    const handleGoogleOneTapResponse = async (response) => {
      if (!response.credential) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/google/one-tap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        });

        const data = await res.json();

        if (data.status === "success" && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Dispatch event để Navbar/Header cập nhật trạng thái user ngay lập tức
          window.dispatchEvent(new Event("storage"));

          const isAdmin =
            data.user.role === 1 ||
            data.user.role === "1" ||
            data.user.roles?.some((r) => r.name === "admin");

          if (isAdmin) {
            navigate("/admin");
          } else {
            // Reload nhẹ để đồng bộ toàn bộ app
            window.location.reload();
          }
        }
      } catch (err) {
        console.error("Google One Tap Error:", err);
      }
    };

    loadGsiScript();
  }, [navigate]);

  return null; // Component chạy ngầm, không render thẻ DOM cố định
}
