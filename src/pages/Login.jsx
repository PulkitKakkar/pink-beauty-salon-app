import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1️⃣ Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Fetch role from Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const role = snap.data().role;

        // 3️⃣ Redirect based on role
        if (role === "admin") {
          navigate("/consultation");
        } else if (role === "staff") {
          navigate("/dashboard");
        } else {
          alert("🚫 No valid role found for this user");
        }
      } else {
        alert("🚫 User has no role assigned in Firestore");
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffe4ec 0%, #fff5fa 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Pink Beauty Salon Header */}
        <h1
          style={{
            color: "#d63384",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Pink Beauty Salon
        </h1>
        <p style={{ marginBottom: "25px", color: "#666" }}>Staff Login</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: "#444",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: "#444",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#d63384",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(214, 51, 132, 0.3)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c02675")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d63384")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
