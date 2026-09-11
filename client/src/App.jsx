import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";
import HomePage from "./pages/HomePage";
import FlightResults from "./pages/FlightResults";
import ServiceSelection from "./pages/ServiceSelection";
import SeatSelection from "./pages/SeatSelection";
import Promotions from "./pages/Promotions";
import Support from "./pages/Support";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import SkyClub from "./pages/SkyClub";
import PaymentRetry from "./pages/PaymentRetry";
import CheckInPage from "./pages/CheckInPage";
import ProfilePage from "./pages/ProfilePage";

import AirportTransfer from "./pages/services/AirportTransfer";
import SpecialMeals from "./pages/services/SpecialMeals";
import TravelInsurance from "./pages/services/TravelInsurance";
import VisaSupport from "./pages/services/VisaSupport";
import CorporateGifts from "./pages/services/CorporateGifts";

import RequireAdmin from "./components/admin/RequireAdmin";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Flights from "./pages/admin/Flights";
import Airports from "./pages/admin/airports";
import Users from "./pages/admin/Users";
import Bookings from "./pages/admin/Bookings";
import Payments from "./pages/admin/Payments";
import Profits from "./pages/admin/Profits";
import Offers from "./pages/admin/Offers";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";
import ChatWidget from "./components/ai/ChatWidget";
import GoogleOneTap from "./components/auth/GoogleOneTap";
import { ChatProvider } from "./store/ChatProvider";

/**
 * Dynamic Page Title Updater based on active route
 */
function PageTitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "SkyLink Airlines - Đặt Vé Máy Bay Trực Tuyến Chuẩn 5 Sao",
      "/login": "Đăng nhập - SkyLink Airlines",
      "/register": "Đăng ký tài khoản - SkyLink Airlines",
      "/auth/callback": "Xác thực tài khoản - SkyLink Airlines",
      "/flights": "Tìm kiếm chuyến bay - SkyLink Airlines",
      "/search": "Tìm kiếm chuyến bay - SkyLink Airlines",
      "/seat-selection": "Chọn chỗ ngồi - SkyLink Airlines",
      "/services": "Dịch vụ & Tiện ích chuyến bay - SkyLink Airlines",
      "/services/transfer": "Dịch vụ đưa đón sân bay - SkyLink Airlines",
      "/services/meals": "Suất ăn đặc biệt trên máy bay - SkyLink Airlines",
      "/services/insurance": "Bảo hiểm du lịch toàn diện - SkyLink Airlines",
      "/services/visa": "Dịch vụ hỗ trợ Visa - SkyLink Airlines",
      "/services/corporate": "Quà tặng doanh nghiệp - SkyLink Airlines",
      "/promotions": "Ưu đãi & Khuyến mãi chuyến bay - SkyLink Airlines",
      "/support": "Trung tâm hỗ trợ khách hàng - SkyLink Airlines",
      "/checkout": "Thanh toán đặt vé máy bay - SkyLink Airlines",
      "/payment": "Thanh toán chuyến bay - SkyLink Airlines",
      "/check-in": "Làm thủ tục trực tuyến (Online Check-in) - SkyLink Airlines",
      "/my-bookings": "Tra cứu vé & Chuyến bay của tôi - SkyLink Airlines",
      "/skyclub": "Chương trình hội viên SkyClub - SkyLink Airlines",
      "/profile": "Hồ sơ cá nhân - SkyLink Airlines",
      "/admin": "Bảng điều khiển quản trị - SkyLink Admin",
      "/admin/flights": "Quản lý chuyến bay - SkyLink Admin",
      "/admin/users": "Quản lý người dùng - SkyLink Admin",
      "/admin/bookings": "Quản lý đặt vé - SkyLink Admin",
      "/admin/payments": "Quản lý giao dịch thanh toán - SkyLink Admin",
      "/admin/profits": "Thống kê doanh thu & Lợi nhuận - SkyLink Admin",
      "/admin/offers": "Quản lý chương trình khuyến mãi - SkyLink Admin",
      "/admin/reports": "Báo cáo tổng hợp - SkyLink Admin",
      "/admin/airports": "Quản lý danh mục sân bay - SkyLink Admin",
      "/admin/profile": "Thông tin quản trị viên - SkyLink Admin",
    };

    const pathname = location.pathname;
    let title = titles[pathname];
    if (!title) {
      if (pathname.startsWith("/payment-retry")) {
        title = "Thanh toán lại chuyến bay - SkyLink Airlines";
      } else if (pathname.startsWith("/admin")) {
        title = "Hệ thống quản trị - SkyLink Admin";
      } else {
        title = "SkyLink Airlines - Đẳng cấp hàng không 5 sao";
      }
    }
    document.title = title;
  }, [location]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <ChatProvider>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/flights" element={<FlightResults />} />
          <Route path="/search" element={<FlightResults />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/services" element={<ServiceSelection />} />

          {/* SERVICE PAGES */}
          <Route path="/services/transfer" element={<AirportTransfer />} />
          <Route path="/services/meals" element={<SpecialMeals />} />
          <Route path="/services/insurance" element={<TravelInsurance />} />
          <Route path="/services/visa" element={<VisaSupport />} />
          <Route path="/services/corporate" element={<CorporateGifts />} />

          <Route path="/promotions" element={<Promotions />} />
          <Route path="/support" element={<Support />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<PaymentRetry />} />
          <Route path="/payment-retry/:bookingId" element={<PaymentRetry />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/skyclub" element={<SkyClub />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* ADMIN ROUTES */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="flights" element={<Flights />} />
              <Route path="users" element={<Users />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="payments" element={<Payments />} />
              <Route path="profits" element={<Profits />} />
              <Route path="offers" element={<Offers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="airports" element={<Airports />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

        </Routes>

        <ChatWidget />
        <GoogleOneTap />
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;