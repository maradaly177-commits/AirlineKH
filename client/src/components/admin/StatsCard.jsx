export default function StatsCard({ title, value, icon, color = "#2563eb" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "0.2s",
        cursor: "pointer",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-3px)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {/* LEFT */}
      <div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
            color: "#111827",
          }}
        >
          {value}
        </h2>

        <p
          style={{
            marginTop: "6px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {title}
        </p>
      </div>

      {/* ICON */}
      {icon && (
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "18px",
          }}
        >
          <i className={`fas fa-${icon}`}></i>
        </div>
      )}
    </div>
  );
}