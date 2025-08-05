import { useState } from "react";
import { toast } from "react-hot-toast";
import BackLink from "../components/BackLink";

export default function SPMConsultationForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    address: "",
    contact: "",
    treatmentArea: "",
    medicalHistory: "",
    allergies: "",
    medications: "",
    skinConditions: "",
    consent: false,
    signedBy: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.fullName) errors.fullName = "Full name is required.";
    if (!form.consent) errors.consent = "Consent is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please complete all required fields.");
      return;
    }

    toast.success("✅ SPM Consultation Form submitted.");
    setForm({
      fullName: "",
      dob: "",
      address: "",
      contact: "",
      treatmentArea: "",
      medicalHistory: "",
      allergies: "",
      medications: "",
      skinConditions: "",
      consent: false,
      signedBy: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="form-container">
      <BackLink />
      <h2 className="form-title">SPM Consultation Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Full Name
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          {formErrors.fullName && (
            <span className="error">{formErrors.fullName}</span>
          )}
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Number
          <input name="contact" value={form.contact} onChange={handleChange} />
        </label>

        <label>
          Area to be Treated
          <input
            name="treatmentArea"
            value={form.treatmentArea}
            onChange={handleChange}
          />
        </label>

        <label>
          Medical History
          <textarea
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
          />
        </label>

        <label>
          Allergies
          <textarea
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
          />
        </label>

        <label>
          Current Medications
          <textarea
            name="medications"
            value={form.medications}
            onChange={handleChange}
          />
        </label>

        <label>
          Skin Conditions
          <textarea
            name="skinConditions"
            value={form.skinConditions}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
          />
          I confirm I have read and understood the consent information.
        </label>
        {formErrors.consent && (
          <span className="error">{formErrors.consent}</span>
        )}

        <label>
          Signed by (Patient)
          <input
            name="signedBy"
            value={form.signedBy}
            onChange={handleChange}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="submit-btn">
          Submit Form
        </button>
      </form>
    </div>
  );
}
