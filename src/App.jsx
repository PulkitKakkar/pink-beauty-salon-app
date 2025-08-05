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
import AdminDashboard from "./pages/AdminDashboard";
import CustomersList from "./pages/CustomersList"; 
import CalendarPage from "./pages/CalendarPage";
import AntiWrinkleForm from "./pages/AntiWrinkleForm"; 
import DermalFillerForm from "./pages/DermalFillerForm";
import LemonBottleForm from "./pages/LemonBottleForm";
import IVTherapyConsultationForm from "./pages/IVTherapyConsultationForm";

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
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customers" element={<CustomersList />} />{" "}
        {/* placeholder */}
        <Route path="/consultation" element={<ConsultationForm />} />
        <Route path="/calendar" element={<CalendarPage />} />{" "}
        {/* placeholder */}
        <Route path="/anti-wrinkle" element={<AntiWrinkleForm />} />
        <Route path="/derma-filler" element={<DermalFillerForm />} />
        <Route path="/lemon-bottle" element={<LemonBottleForm />} />
        <Route path="/iv-therapy" element={<IVTherapyConsultationForm />} />
        <Route path="/lemon-bottle" element={<LemonBottleForm />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
