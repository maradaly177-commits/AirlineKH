import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
import Airports from "./pages/admin/Airports";
import Users from "./pages/admin/Users";
import Bookings from "./pages/admin/Bookings";
import Profile from "./pages/admin/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/flights" element={<FlightResults />} />
        <Route path="/search" element={<FlightResults />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/services" element={<ServiceSelection />} />
        
        {/* NEW DUMMY SERVICE PAGES */}
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
            <Route path="airports" element={<Airports />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;