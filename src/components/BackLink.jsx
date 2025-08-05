import { useNavigate } from "react-router-dom";

export default function BackLink({ to = "/admin" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        marginBottom: "1rem",
        background: "#E4007F",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      ← Back to Home
    </button>
  );
}
