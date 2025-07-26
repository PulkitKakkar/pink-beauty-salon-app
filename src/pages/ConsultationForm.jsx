import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ConsultationForm() {
  const [form, setForm] = useState({
    date: "",
    clientName: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    doctorCare: "",
    medications: "",
    surgery: "",
    tattoos: "",
    pregnant: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "consultations"), form);
    alert("✅ Consultation form saved successfully!");
    setForm({});
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#fff0f5",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#d63384", textAlign: "center" }}>
        Consultation Form
      </h2>

      <form onSubmit={handleSubmit}>
        <label>Date</label>
        <input type="date" name="date" onChange={handleChange} />

        <label>Client Name</label>
        <input type="text" name="clientName" onChange={handleChange} />

        <label>Date of Birth</label>
        <input type="date" name="dob" onChange={handleChange} />

        <label>Address</label>
        <input type="text" name="address" onChange={handleChange} />

        <label>Phone</label>
        <input type="text" name="phone" onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} />

        <label>Are you under doctor’s care?</label>
        <select name="doctorCare" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Medications</label>
        <textarea name="medications" onChange={handleChange} />

        <label>Recent Surgery</label>
        <select name="surgery" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Tattoos / Permanent Makeup</label>
        <select name="tattoos" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Are you pregnant or trying to conceive?</label>
        <select name="pregnant" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Notes</label>
        <textarea name="notes" onChange={handleChange} />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            backgroundColor: "#d63384",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Save Consultation
        </button>
      </form>
    </div>
  );
}
