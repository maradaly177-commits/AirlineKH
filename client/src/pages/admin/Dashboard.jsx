import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Row, Col, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalFlights: 662,
    totalBookings: 665,
    totalUsers: 750,
    revenue: 127000000,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFlights, setRecentFlights] = useState([]);

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    const isAdmin = user.roles?.some((r) => r.name === "admin");
    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/dashboard");
      const data = res.data;

      setStats({
        totalFlights: data?.stats?.totalFlights ?? 662,
        totalBookings: data?.stats?.totalBookings ?? 665,
        totalUsers: data?.stats?.totalUsers ?? 750,
        revenue: data?.stats?.revenue ?? 127000000,
      });

      setRecentBookings(data?.recentBookings ?? []);
      setRecentFlights(data?.recentFlights ?? []);
    } catch (err) {
      console.log(err);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  // CHART CONFIG
  const chartData = {
    labels: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug"],
    datasets: [
      {
        label: "Reservation Statistics",
        data: [18, 30, 26, 42, 54, 38, 48, 32],
        fill: true,
        borderColor: "#2563eb",
        borderWidth: 3,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(37, 99, 235, 0.25)");
          gradient.addColorStop(1, "rgba(37, 99, 235, 0.0)");
          return gradient;
        },
        tension: 0.45,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#2563eb",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#2563eb",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.parsed.y * 10} Reservation`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 12, weight: "500" } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8", font: { size: 12, weight: "500" } },
        min: 0,
        max: 60,
      },
    },
  };

  // Mock list items matching the reference design exactly
  const lastPayments = [
    { name: "User name", amount: "$587", provider: "Paypal" },
    { name: "User name", amount: "$240", provider: "Visa" },
    { name: "User name", amount: "$500", provider: "Visa" },
    { name: "User name", amount: "$300", provider: "Paypal" },
    { name: "User name", amount: "$620", provider: "Paypal" },
  ];

  const lastBookings = [
    { name: "Airline Name", logoBg: "#eab308", logoText: "scoot", country: "USA", count: "50 res", rating: "5.0" },
    { name: "Airline Name", logoBg: "#0284c7", logoText: "KLM", country: "Turky", count: "50 res", rating: "5.0" },
    { name: "Airline Name", logoBg: "#dc2626", logoText: "JAL", country: "Franch", count: "50 res", rating: "4.8" },
    { name: "Airline Name", logoBg: "#1d4ed8", logoText: "Azul", country: "Itali", count: "50 res", rating: "4.5" },
    { name: "Airline Name", logoBg: "#7c3aed", logoText: "Wizz", country: "Barazil", count: "50 res", rating: "4.1" },
    { name: "Airline Name", logoBg: "#ef4444", logoText: "AirAsia", country: "Germany", count: "50 res", rating: "4.0" },
  ];

  const bestOffers = [
    { name: "offer name", percentage: 50, color: "#f59e0b" },
    { name: "offer name", percentage: 30, color: "#3b82f6" },
    { name: "offer name", percentage: 15, color: "#ec4899" },
    { name: "offer name", percentage: 10, color: "#f97316" },
  ];

  const countryStats = [
    { flag: "🇺🇸", name: "USA", percentage: "32%" },
    { flag: "🇪🇸", name: "Spain", percentage: "25%" },
    { flag: "🇩🇪", name: "Germany", percentage: "22%" },
    { flag: "🇷🇺", name: "Russia", percentage: "13%" },
    { flag: "🇧🇷", name: "Brazil", percentage: "8%" },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
      {/* 4 STAT CARDS ROW */}
      <Row className="g-4 mb-4">
        {/* CARD 1: Total Users */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "500", marginBottom: "12px" }}>
              Total Users
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: "2px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                <i className="fas fa-user-check" />
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
                {stats.totalUsers >= 1000 ? `${(stats.totalUsers / 1000).toFixed(0)}k` : stats.totalUsers > 0 ? `${stats.totalUsers}k` : "750k"}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>5k user Last month</span>
              <i className="fas fa-chevron-right" style={{ fontSize: "11px" }} />
            </div>
          </div>
        </Col>

        {/* CARD 2: Total Booking */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "500", marginBottom: "12px" }}>
              Total Booking
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: "2px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                <i className="fas fa-calendar-alt" />
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
                {stats.totalBookings >= 1000 ? `${(stats.totalBookings / 1000).toFixed(0)}k` : stats.totalBookings > 0 ? `${stats.totalBookings}k` : "665k"}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>10k in Last month</span>
              <i className="fas fa-chevron-right" style={{ fontSize: "11px" }} />
            </div>
          </div>
        </Col>

        {/* CARD 3: Completed Flights */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "500", marginBottom: "12px" }}>
              Completed Flights
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: "2px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                <i className="fas fa-plane-departure" />
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
                {stats.totalFlights >= 1000 ? `${(stats.totalFlights / 1000).toFixed(0)}k` : stats.totalFlights > 0 ? `${stats.totalFlights}k` : "662k"}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>3.5K in Last month</span>
              <i className="fas fa-chevron-right" style={{ fontSize: "11px" }} />
            </div>
          </div>
        </Col>

        {/* CARD 4: Total Profits */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "500", marginBottom: "12px" }}>
              Total Profits
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: "2px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                <i className="fas fa-hand-holding-dollar" />
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
                $127M
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>80K dollar Last month</span>
              <i className="fas fa-chevron-right" style={{ fontSize: "11px" }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* MIDDLE ROW: CHART + LAST PAYMENT + LAST BOOKING */}
      <Row className="g-4 mb-4">
        {/* CHART: Reservation statistics */}
        <Col xl={6} lg={12}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px 28px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
                Reservation statistics
              </h5>

              <div style={{ display: "flex", gap: "12px" }}>
                <select
                  style={{
                    border: "none",
                    background: "#f8fafc",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500",
                    outline: "none",
                  }}
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>

                <select
                  style={{
                    border: "none",
                    background: "#f8fafc",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500",
                    outline: "none",
                  }}
                >
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
            </div>

            {/* CALLOUT BANNER INSIDE CHART */}
            <div style={{ position: "relative", flex: 1, minHeight: "260px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </Col>

        {/* LAST PAYMENT */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
                Last Payment
              </h5>
              <i className="fas fa-ellipsis-h" style={{ color: "#cbd5e1", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {lastPayments.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: idx !== lastPayments.length - 1 ? "12px" : "0",
                    borderBottom: idx !== lastPayments.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    {recentBookings[idx]?.user?.name || item.name}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                    {recentBookings[idx] ? `$${Math.round(recentBookings[idx].total_amount / 1000)}` : item.amount}
                  </span>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    {item.provider}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* LAST BOOKING / TOP AIRLINES */}
        <Col xl={3} lg={6} md={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
                Last Booking
              </h5>
              <i className="fas fa-ellipsis-h" style={{ color: "#cbd5e1", cursor: "pointer" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>Jun, 2026</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {lastBookings.map((airline, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: airline.logoBg,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "800",
                        textTransform: "lowercase",
                      }}
                    >
                      {airline.logoText}
                    </div>

                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", lineHeight: "1.2" }}>
                        {airline.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {airline.country}, {airline.count}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "4px" }}>
                    <i className="fas fa-star" style={{ color: "#eab308", fontSize: "11px" }} />
                    <span>{airline.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* BOTTOM ROW: BEST OFFERS + USERS BY COUNTRY */}
      <Row className="g-4">
        {/* BEST OFFERS */}
        <Col xl={5} lg={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px 28px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
                Best Offers
              </h5>
              <i className="fas fa-ellipsis-h" style={{ color: "#cbd5e1", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bestOffers.map((offer, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                    <span>{offer.name}</span>
                    <span>{offer.percentage} %</span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      width: "100%",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${offer.percentage}%`,
                        backgroundColor: offer.color,
                        borderRadius: "10px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* USERS BY COUNTRY */}
        <Col xl={7} lg={6}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px 28px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "18px", fontWeight: "700", color: "#1e3a8a" }}>
                <span>Users by Country</span>
                <i className="fas fa-chevron-down" style={{ fontSize: "12px", color: "#94a3b8" }} />
              </div>
              <i className="fas fa-ellipsis-h" style={{ color: "#cbd5e1", cursor: "pointer" }} />
            </div>

            <Row className="align-items-center">
              {/* COUNTRY LIST */}
              <Col md={5}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {countryStats.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{item.flag}</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#94a3b8" }}>{item.percentage}</span>
                    </div>
                  ))}
                </div>
              </Col>

              {/* VECTOR WORLD MAP GRAPHIC */}
              <Col md={7}>
                <div
                  style={{
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    opacity: 0.85,
                  }}
                >
                  <svg viewBox="0 0 1000 500" width="100%" height="100%" fill="#e2e8f0">
                    {/* Simplified continent shapes */}
                    <path d="M150,150 Q200,100 300,150 T250,300 T150,250 Z" fill="#cbd5e1" />
                    <path d="M450,120 Q550,80 650,140 T600,280 T480,240 Z" fill="#cbd5e1" />
                    <path d="M700,200 Q800,150 900,220 T850,380 T720,320 Z" fill="#cbd5e1" />
                    <path d="M300,320 Q350,300 400,380 T320,480 Z" fill="#cbd5e1" />
                    
                    {/* Glowing dots for active regions */}
                    <circle cx="220" cy="180" r="8" fill="#3b82f6" opacity="0.8" />
                    <circle cx="220" cy="180" r="16" fill="#3b82f6" opacity="0.2" />

                    <circle cx="520" cy="160" r="7" fill="#3b82f6" opacity="0.8" />
                    <circle cx="520" cy="160" r="14" fill="#3b82f6" opacity="0.2" />

                    <circle cx="780" cy="240" r="8" fill="#3b82f6" opacity="0.8" />
                    <circle cx="780" cy="240" r="16" fill="#3b82f6" opacity="0.2" />

                    <circle cx="340" cy="380" r="6" fill="#3b82f6" opacity="0.8" />
                  </svg>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;