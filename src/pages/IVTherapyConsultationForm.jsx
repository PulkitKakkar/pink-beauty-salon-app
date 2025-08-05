import { useState } from "react";
import { toast } from "react-hot-toast";

export default function IVTherapyConsultationForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    address: "",
    contactNumber: "",
    email: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    allergies: "",
    takingMedications: "",
    medicationsList: "",
    cardiovascular: false,
    kidney: false,
    liver: false,
    diabetes: false,
    hypertension: false,
    hypotension: false,
    otherConditions: "",
    fever: false,
    weightLoss: false,
    nausea: false,
    otherSymptoms: "",
    pregnant: false,
    breastfeeding: false,
    systolic: "",
    diastolic: "",
    patientSignature: "",
    patientDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form submitted!");
    console.log(form);
  };

  return (
    <div className="form-container">
      <h2>IV Therapy Consultation and Consent Form</h2>
      <form onSubmit={handleSubmit}>
        <h3>Patient Information</h3>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="emergencyContactName"
          placeholder="Emergency Contact Name"
          value={form.emergencyContactName}
          onChange={handleChange}
        />
        <input
          name="emergencyContactNumber"
          placeholder="Emergency Contact Number"
          value={form.emergencyContactNumber}
          onChange={handleChange}
        />

        <h3>Medical History</h3>
        <label>Known Allergies?</label>
        <input
          name="allergies"
          placeholder="Specify allergies"
          value={form.allergies}
          onChange={handleChange}
        />
        <label>Taking medications or supplements?</label>
        <input
          name="takingMedications"
          placeholder="Yes/No"
          value={form.takingMedications}
          onChange={handleChange}
        />
        <input
          name="medicationsList"
          placeholder="List medications"
          value={form.medicationsList}
          onChange={handleChange}
        />
        <label>Cardiovascular Disease</label>
        <input
          type="checkbox"
          name="cardiovascular"
          checked={form.cardiovascular}
          onChange={handleChange}
        />
        <label>Kidney Disease</label>
        <input
          type="checkbox"
          name="kidney"
          checked={form.kidney}
          onChange={handleChange}
        />
        <label>Liver Disease</label>
        <input
          type="checkbox"
          name="liver"
          checked={form.liver}
          onChange={handleChange}
        />
        <label>Diabetes</label>
        <input
          type="checkbox"
          name="diabetes"
          checked={form.diabetes}
          onChange={handleChange}
        />
        <label>Hypertension</label>
        <input
          type="checkbox"
          name="hypertension"
          checked={form.hypertension}
          onChange={handleChange}
        />
        <label>Hypotension</label>
        <input
          type="checkbox"
          name="hypotension"
          checked={form.hypotension}
          onChange={handleChange}
        />
        <input
          name="otherConditions"
          placeholder="Other significant conditions"
          value={form.otherConditions}
          onChange={handleChange}
        />
        <label>Fever or infection</label>
        <input
          type="checkbox"
          name="fever"
          checked={form.fever}
          onChange={handleChange}
        />
        <label>Weight loss</label>
        <input
          type="checkbox"
          name="weightLoss"
          checked={form.weightLoss}
          onChange={handleChange}
        />
        <label>Nausea or vomiting</label>
        <input
          type="checkbox"
          name="nausea"
          checked={form.nausea}
          onChange={handleChange}
        />
        <input
          name="otherSymptoms"
          placeholder="Other symptoms"
          value={form.otherSymptoms}
          onChange={handleChange}
        />
        <label>Pregnant</label>
        <input
          type="checkbox"
          name="pregnant"
          checked={form.pregnant}
          onChange={handleChange}
        />
        <label>Breastfeeding</label>
        <input
          type="checkbox"
          name="breastfeeding"
          checked={form.breastfeeding}
          onChange={handleChange}
        />

        <h3>Blood Pressure</h3>
        <input
          name="systolic"
          placeholder="Systolic (mmHg)"
          value={form.systolic}
          onChange={handleChange}
        />
        <input
          name="diastolic"
          placeholder="Diastolic (mmHg)"
          value={form.diastolic}
          onChange={handleChange}
        />

        <h3>Consent</h3>
        <input
          name="patientSignature"
          placeholder="Patient Signature"
          value={form.patientSignature}
          onChange={handleChange}
        />
        <input
          name="patientDate"
          type="date"
          placeholder="Date"
          value={form.patientDate}
          onChange={handleChange}
        />

        <button type="submit">Submit Form</button>
      </form>
    </div>
  );
}

import "../styles/IVTherapyConsultationForm.css";
