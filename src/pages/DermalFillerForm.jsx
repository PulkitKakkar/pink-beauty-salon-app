import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import SignatureSection from "../components/SignatureSection";
import BackLink from "../components/BackLink";

export default function DermalFillerForm() {
  const sigPad = useRef(null);
  const [signatureURL, setSignatureURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
    address: "",
    emergencyContact: "",
    gpDetails: "",

    // Medical History
    pregnant: "",
    previousFillers: "",
    previousFillersDetails: "",
    allergies: "",
    allergyDetails: "",
    medications: "",
    medicationList: "",
    autoimmune: "",
    heartConditions: "",
    diabetes: "",
    skinConditions: "",
    otherConditions: "",

    // Lifestyle
    smokerAlcohol: "",
    specialEvents: "",
    specialEventsDetails: "",
    fillerAreas: [],
    otherFillerArea: "",
    pastComplications: "",
    pastComplicationDetails: "",
    expectations: "",

    // Consent
    understandsRisks: false,
    awareOfDuration: false,
    askedQuestions: false,
    resultsMayVary: false,
    followAftercare: false,

    // Photography
    photoConsent: "",

    // Practitioner
    practitionerName: "",
    consultationDate: "",
    notes: "",

    disclaimerAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMultiSelect = (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (prev.fillerAreas.includes(value)) {
        return {
          ...prev,
          fillerAreas: prev.fillerAreas.filter((area) => area !== value),
        };
      } else {
        return {
          ...prev,
          fillerAreas: [...prev.fillerAreas, value],
        };
      }
    });
  };

  const clearSignature = () => {
    sigPad.current.clear();
    setSignatureURL("");
  };

  const saveSignature = () => {
    setSignatureURL(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.fullName) errors.fullName = "Full name is required";
    if (!form.contactNumber) errors.contactNumber = "Phone number is required";
    if (!form.disclaimerAccepted)
      errors.disclaimerAccepted = "You must accept the declaration";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      await addDoc(collection(db, "dermalFillerConsultations"), {
        ...form,
        signature: signatureURL,
        createdAt: new Date(),
      });
      toast.success("✅ Form submitted successfully!");
      setFormErrors({});
      setSignatureURL("");
      sigPad.current.clear();
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    fontSize: "16px",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "20px auto",
        background: "#fff0f5",
        borderRadius: "12px",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <BackLink />
      <h2
        style={{ color: "#d63384", textAlign: "center", marginBottom: "20px" }}
      >
        Dermal Fillers Consultation Form
      </h2>

      <form onSubmit={handleSubmit}>
        {/* CLIENT DETAILS */}
        <label>Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          style={inputStyle}
        />
        {formErrors.fullName && (
          <p className="error-text">{formErrors.fullName}</p>
        )}

        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Contact Number</label>
        <input
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
          style={inputStyle}
        />
        {formErrors.contactNumber && (
          <p className="error-text">{formErrors.contactNumber}</p>
        )}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Emergency Contact</label>
        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>GP Name & Address</label>
        <textarea
          name="gpDetails"
          value={form.gpDetails}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* MEDICAL HISTORY */}
        <h4 style={{ color: "#d63384", marginTop: "25px" }}>Medical History</h4>
        {[
          { label: "Are you pregnant or breastfeeding?", name: "pregnant" },
          {
            label: "Previous dermal fillers or procedures?",
            name: "previousFillers",
          },
          { label: "Allergies (e.g. lidocaine)?", name: "allergies" },
          { label: "Current medications?", name: "medications" },
          { label: "Autoimmune disorders?", name: "autoimmune" },
          { label: "Heart conditions?", name: "heartConditions" },
          { label: "Diabetes?", name: "diabetes" },
          { label: "Skin conditions?", name: "skinConditions" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label>{label}</label>
            <select
              name={name}
              value={form[name]}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        ))}

        <label>
          If yes, specify (Fillers/Allergies/Medication/Other Conditions)
        </label>
        <textarea
          name="previousFillersDetails"
          value={form.previousFillersDetails}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Describe past fillers or reactions..."
        />
        <textarea
          name="allergyDetails"
          value={form.allergyDetails}
          onChange={handleChange}
          style={inputStyle}
          placeholder="List allergens..."
        />
        <textarea
          name="medicationList"
          value={form.medicationList}
          onChange={handleChange}
          style={inputStyle}
          placeholder="List medications..."
        />
        <textarea
          name="otherConditions"
          value={form.otherConditions}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Other medical conditions..."
        />

        {/* LIFESTYLE & EXPECTATIONS */}
        <h4 style={{ color: "#d63384", marginTop: "25px" }}>
          Lifestyle & Expectations
        </h4>
        <label>Do you smoke or drink alcohol regularly?</label>
        <select
          name="smokerAlcohol"
          value={form.smokerAlcohol}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <label>Any special events in the next 2 weeks?</label>
        <select
          name="specialEvents"
          value={form.specialEvents}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <textarea
          name="specialEventsDetails"
          value={form.specialEventsDetails}
          onChange={handleChange}
          style={inputStyle}
          placeholder="e.g. Wedding, photoshoot, etc."
        />

        <label>Areas for filler treatment</label>
        {["Lips", "Cheeks", "Nasolabial folds", "Jawline"].map((area) => (
          <div key={area}>
            <label>
              <input
                type="checkbox"
                value={area}
                checked={form.fillerAreas.includes(area)}
                onChange={handleMultiSelect}
              />
              {area}
            </label>
          </div>
        ))}
        <input
          name="otherFillerArea"
          value={form.otherFillerArea}
          onChange={handleChange}
          placeholder="Other area..."
          style={inputStyle}
        />

        <label>Previous complications?</label>
        <select
          name="pastComplications"
          value={form.pastComplications}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <textarea
          name="pastComplicationDetails"
          value={form.pastComplicationDetails}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Describe any complications..."
        />

        <label>What are your expectations?</label>
        <textarea
          name="expectations"
          value={form.expectations}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* CONSENT */}
        <h4 style={{ color: "#d63384", marginTop: "25px" }}>Consent</h4>
        {[
          {
            name: "understandsRisks",
            label:
              "I have been informed about the nature and risks of dermal fillers.",
          },
          {
            name: "awareOfDuration",
            label: "I understand the effects are temporary (6–18 months).",
          },
          {
            name: "askedQuestions",
            label: "I’ve had the opportunity to ask questions.",
          },
          { name: "resultsMayVary", label: "I understand results may vary." },
          {
            name: "followAftercare",
            label: "I agree to follow aftercare instructions.",
          },
        ].map(({ name, label }) => (
          <div key={name}>
            <label>
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
              />
              {label}
            </label>
          </div>
        ))}

        {/* PHOTOGRAPHY CONSENT */}
        <label>Photography & Advertising Consent</label>
        <select
          name="photoConsent"
          value={form.photoConsent}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select</option>
          <option>Yes, I agree</option>
          <option>No, I do not agree</option>
        </select>

        {/* PRACTITIONER DETAILS */}
        <label>Practitioner Name</label>
        <input
          name="practitionerName"
          value={form.practitionerName}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Date of Consultation</label>
        <input
          type="date"
          name="consultationDate"
          value={form.consultationDate}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>
          <input
            type="checkbox"
            name="disclaimerAccepted"
            checked={form.disclaimerAccepted}
            onChange={handleChange}
          />
          I confirm all provided information is accurate and I consent to
          proceed with the treatment.
        </label>
        {formErrors.disclaimerAccepted && (
          <p className="error-text">{formErrors.disclaimerAccepted}</p>
        )}

        <SignatureSection
          sigPad={sigPad}
          clearSignature={clearSignature}
          saveSignature={saveSignature}
        />

        <button
          type="submit"
          style={{
            marginTop: "20px",
            backgroundColor: "#d63384",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit Consultation Form
        </button>
      </form>
    </div>
  );
}
