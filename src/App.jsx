import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUserRole } from "./utils/getUserRole";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ConsultationForm from "./pages/ConsultationForm";
import AdminRoute from "./components/AdminRoute";
import Disclaimer from "./pages/Disclaimer";
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/consultation"
          element={
            <AdminRoute role={role}>
              <ConsultationForm />
            </AdminRoute>
          }
        />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
