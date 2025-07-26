import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffe4ec 0%, #fff5fa 100%)",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#d63384", marginBottom: "30px" }}>
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <button style={buttonStyle} onClick={() => navigate("/customers")}>
          👥 View Customers Data
        </button>

        <button style={buttonStyle} onClick={() => navigate("/consultation")}>
          📝 Consultation Form
        </button>

        <button style={buttonStyle} onClick={() => navigate("/calendar")}>
          📅 Calendar
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#d63384",
  color: "#fff",
  padding: "16px",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(214, 51, 132, 0.3)",
  transition: "background-color 0.3s ease",
};
