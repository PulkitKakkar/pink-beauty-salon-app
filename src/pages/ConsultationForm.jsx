import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const skinQuestions = [
  {
    question: "Colour of eyes",
    options: [
      { label: "Light blue, gray, green", score: 0 },
      { label: "Blue, gray or green", score: 1 },
      { label: "Blue hazel or light brown", score: 2 },
      { label: "Dark brown", score: 3 },
      { label: "Brownish black", score: 4 }
    ]
  },
  {
    question: "Natural hair colour",
    options: [
      { label: "Sandy red", score: 0 },
      { label: "Blonde", score: 1 },
      { label: "Chestnut or dark blonde", score: 2 },
      { label: "Dark brown", score: 3 },
      { label: "Black", score: 4 }
    ]
  },
  {
    question: "Skin colour on non exposed areas",
    options: [
      { label: "Reddish", score: 0 },
      { label: "Very pale", score: 1 },
      { label: "Pale with beige tint", score: 2 },
      { label: "Light brown", score: 3 },
      { label: "Dark brown", score: 4 }
    ]
  },
  {
    question: "Freckles on unexposed areas",
    options: [
      { label: "Many", score: 0 },
      { label: "Several", score: 1 },
      { label: "Few", score: 2 },
      { label: "Very few", score: 3 },
      { label: "None", score: 4 }
    ]
  },
  {
    question: "Reaction to sun exposure: Blistering",
    options: [
      { label: "Always burns, blisters, peels", score: 0 },
      { label: "Often burns, blisters, peels", score: 1 },
      { label: "Burns, sometimes blisters, peels", score: 2 },
      { label: "Rarely burns, never blisters", score: 3 },
      { label: "Never burns", score: 4 }
    ]
  },
  {
    question: "Reaction to sun exposure: Degree of tan",
    options: [
      { label: "Never tans", score: 0 },
      { label: "Seldom tans", score: 1 },
      { label: "Sometimes tans", score: 2 },
      { label: "Often tans", score: 3 },
      { label: "Always tans", score: 4 }
    ]
  },
  {
    question: "Reaction to sun exposure: Turning red",
    options: [
      { label: "Painful redness, blistering, peeling", score: 0 },
      { label: "Moderate redness, sometimes blisters, peels", score: 1 },
      { label: "Mild redness, rarely blisters", score: 2 },
      { label: "Rarely red", score: 3 },
      { label: "Never red", score: 4 }
    ]
  },
  {
    question: "Face reaction to sun",
    options: [
      { label: "Very sensitive", score: 0 },
      { label: "Sensitive", score: 1 },
      { label: "Normal", score: 2 },
      { label: "Very resistant", score: 3 },
      { label: "Never had a problem", score: 4 }
    ]
  },
  {
    question: "When did the area last receive a tan?",
    options: [
      { label: "More than 3 months ago", score: 0 },
      { label: "2–3 months ago", score: 1 },
      { label: "1–2 months ago", score: 2 },
      { label: "Less than a month ago", score: 3 },
      { label: "Less than 2 weeks ago", score: 4 }
    ]
  },
  {
    question: "How often is this area exposed to the sun?",
    options: [
      { label: "Hardly ever", score: 0 },
      { label: "Occasionally", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Always", score: 4 }
    ]
  }
];

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "4px",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "16px",
  lineHeight: "1.4",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
};

export default function ConsultationForm() {
  const sigPad = useRef({});
  const [signatureURL, setSignatureURL] = useState("");

  const [skinAnswers, setSkinAnswers] = useState({});
  const [skinScore, setSkinScore] = useState(0);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    clientName: "",
    dob: "",
    address: "",
    occupation: "",
    homeTelephone: "",
    mobile: "",
    hearAboutUs: "",
    areasToBeTreated: "",
    phone: "",
    email: "",
    doctorCare: "",
    doctorCareForWhat: "",
    hormoneMedication: "",
    hormoneMedicationDetails: "",
    allMedications: "",
    medications: "",
    surgery: "",
    surgeryExplain: "",
    sensitiveSoaps: "",
    skinIrritated: "",
    sunExposure6Weeks: "",
    waxedAreasMonth: "",
    allergies: "",
    tanning: "",
    tattoos: "",
    pregnant: "",
    treatments: "",
    skinTypeScore: "",
    disclaimerAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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

    if (!form.disclaimerAccepted) {
      alert("⚠️ Please accept the disclaimer before submitting.");
      return;
    }

    await addDoc(collection(db, "consultations"), {
      ...form,
      signature: signatureURL,
      createdAt: new Date(),
    });

    alert("✅ Consultation Form Saved!");
    setForm({});
    setSignatureURL("");
    sigPad.current.clear();
  };

  const handleSkinAnswer = (question, score) => {
    setSkinAnswers((prev) => {
      const updated = { ...prev, [question]: score };

      // Calculate total score
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setSkinScore(total);

      return updated;
    });
  };

  // Helper function: get Fitzpatrick label
  const getFitzpatrickType = (score) => {
    if (score <= 7) return "Type I (Very fair)";
    if (score <= 16) return "Type II (Fair)";
    if (score <= 24) return "Type III (Medium)";
    if (score <= 30) return "Type IV (Olive/Brown)";
    if (score <= 35) return "Type V (Dark brown)";
    return "Type VI (Deeply pigmented dark brown to black)";
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "95%",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "#fff0f5",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2
        style={{ color: "#d63384", textAlign: "center", marginBottom: "20px" }}
      >
        Pink Beauty Salon - Client Consultation Form
      </h2>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: Client Details */}
        <h3 style={{ color: "#c02675" }}>Client Details</h3>
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="date">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={form.date}
            readOnly
            style={{
              ...inputStyle,
              backgroundColor: "#f4f4f4",
              cursor: "not-allowed",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="clientName">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            value={form.clientName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="dob">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            id="dob"
            value={form.dob}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="address">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={form.address}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* SECTION 2: Medical Background */}
        <h3 style={{ color: "#c02675", marginTop: "20px" }}>
          Medical Background
        </h3>
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="doctorCare">
            Are you under a doctor's care?
          </label>
          <select
            name="doctorCare"
            id="doctorCare"
            value={form.doctorCare}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="doctorCareForWhat">
            If yes, for what?
          </label>
          <textarea
            name="doctorCareForWhat"
            id="doctorCareForWhat"
            value={form.doctorCareForWhat}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "48px", resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="hormoneMedication">
            Have you been treated with hormone medication?
          </label>
          <select
            name="hormoneMedication"
            id="hormoneMedication"
            value={form.hormoneMedication}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="hormoneMedicationDetails">
            If yes, indicate the specific hormone medication
          </label>
          <textarea
            name="hormoneMedicationDetails"
            id="hormoneMedicationDetails"
            value={form.hormoneMedicationDetails}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "48px", resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="allMedications">
            Please list any prescription and non-prescription medication you are
            taking including anything topical or herbal
          </label>
          <textarea
            name="allMedications"
            id="allMedications"
            value={form.allMedications}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="surgery">
            Have you had any surgery in the last 6 months?
          </label>
          <select
            name="surgery"
            id="surgery"
            value={form.surgery}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="surgeryExplain">
            If yes, please explain
          </label>
          <textarea
            name="surgeryExplain"
            id="surgeryExplain"
            value={form.surgeryExplain}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "48px", resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="sensitiveSoaps">
            Are you sensitive to any soaps or lotions?
          </label>
          <select
            name="sensitiveSoaps"
            id="sensitiveSoaps"
            value={form.sensitiveSoaps}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="skinIrritated">
            Does your skin get blotchy, red or irritated easily?
          </label>
          <select
            name="skinIrritated"
            id="skinIrritated"
            value={form.skinIrritated}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="sunExposure6Weeks">
            Have you had significant sun exposure in the last 6 weeks?
          </label>
          <select
            name="sunExposure6Weeks"
            id="sunExposure6Weeks"
            value={form.sunExposure6Weeks}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="waxedAreasMonth">
            Have you waxed the areas to be treated within the last month?
          </label>
          <select
            name="waxedAreasMonth"
            id="waxedAreasMonth"
            value={form.waxedAreasMonth}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="allergies">
            Do you have any allergies?
          </label>
          <textarea
            name="allergies"
            id="allergies"
            value={form.allergies}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
          />
        </div>

        {/* SECTION 3: Treatment History */}
        <h3 style={{ color: "#c02675", marginTop: "20px" }}>
          Treatment History
        </h3>
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="treatments">
            Have you had laser hair removal before?
          </label>
          <select
            name="treatments"
            id="treatments"
            value={form.treatments}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="tanning">
            Do you use sun beds or self-tanning products?
          </label>
          <select
            name="tanning"
            id="tanning"
            value={form.tanning}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="tattoos">
            Do you have tattoos or permanent makeup?
          </label>
          <select
            name="tattoos"
            id="tattoos"
            value={form.tattoos}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="pregnant">
            Are you pregnant or trying to conceive?
          </label>
          <select
            name="pregnant"
            id="pregnant"
            value={form.pregnant}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="roaccutane">
            Have you ever had Roaccutane?
          </label>
          <select
            name="roaccutane"
            id="roaccutane"
            value={form.roaccutane || ""}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="otherCosmeticProcedure">
            Any other cosmetic procedure?
          </label>
          <select
            name="otherCosmeticProcedure"
            id="otherCosmeticProcedure"
            value={form.otherCosmeticProcedure || ""}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="otherCosmeticProcedureDetails">
            If yes, please state
          </label>
          <textarea
            name="otherCosmeticProcedureDetails"
            id="otherCosmeticProcedureDetails"
            value={form.otherCosmeticProcedureDetails || ""}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "48px", resize: "vertical" }}
          />
        </div>

        {/* SECTION: Have you ever experienced or been treated with/for the following? */}
        <h4 style={{ color: "#c02675", marginTop: "20px", fontWeight: 600 }}>
          Have you ever experienced or been treated with/for the following?
        </h4>
        {[
          { key: "skinCancer", label: "Skin Cancer" },
          { key: "highBloodPressure", label: "High Blood Pressure" },
          { key: "polycysticOvaries", label: "Polycystic ovaries" },
          { key: "coldSores", label: "Cold sores" },
          { key: "haemophilia", label: "Haemophilia" },
          { key: "menopause", label: "Menopause" },
          { key: "epilepsy", label: "Epilepsy" },
          { key: "keloid", label: "Keloid" },
          { key: "antiInflammatoryDrugs", label: "Anti-inflammatory drugs" },
          { key: "irregularPeriods", label: "Irregular periods" },
          { key: "cancer", label: "Cancer" },
          { key: "heartProblems", label: "Heart Problems" },
          { key: "birthControlPill", label: "Birth control pill" },
          { key: "diabetes", label: "Diabetes" },
          { key: "antiCoagulant", label: "Anti coagulant" },
          { key: "thyroid", label: "Thyroid" },
          { key: "asprin", label: "Asprin" },
        ].map((item) => (
          <div style={{ marginBottom: "15px" }} key={item.key}>
            <label style={labelStyle} htmlFor={item.key}>
              {item.label}
            </label>
            <select
              name={item.key}
              id={item.key}
              value={form[item.key] || ""}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        ))}
        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle} htmlFor="medicalConditionDetails">
            If yes, to any of the above, please explain and include dates
          </label>
          <textarea
            name="medicalConditionDetails"
            id="medicalConditionDetails"
            value={form.medicalConditionDetails || ""}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
          />
        </div>

        {/* SECTION: Skin Type Analysis (Fitzpatrick) */}
        <h3 style={{ color: "#c02675", marginTop: "20px" }}>
          Skin Type Analysis
        </h3>
        <div
          style={{
            background: "#f8e1ec",
            padding: "18px",
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        >
          {skinQuestions.map((q, idx) => (
            <div key={q.question} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                {idx + 1}. {q.question}
              </label>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {q.options.map((opt, oidx) => (
                  <label
                    key={oidx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: "400",
                    }}
                  >
                    <input
                      type="radio"
                      name={`skin_${idx}`}
                      checked={skinAnswers[q.question] === opt.score}
                      onChange={() => handleSkinAnswer(q.question, opt.score)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div
            style={{ marginTop: "18px", fontWeight: "600", fontSize: "16px" }}
          >
            Total Score: <span style={{ color: "#d63384" }}>{skinScore}</span>
            <br />
            Fitzpatrick Type:{" "}
            <span style={{ color: "#c02675" }}>
              {getFitzpatrickType(skinScore)}
            </span>
          </div>
        </div>

        {/* SECTION 4: Disclaimer */}
        <h3 style={{ color: "#c02675", marginTop: "20px" }}>Disclaimer</h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Please read our full{" "}
          <Link
            to="/disclaimer"
            style={{ color: "#d63384", textDecoration: "underline" }}
          >
            Disclaimer
          </Link>{" "}
          before proceeding. I understand and acknowledge that all information
          provided is accurate to the best of my knowledge. I accept all
          possible risks associated with treatment and have been given aftercare
          instructions.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            name="disclaimerAccepted"
            checked={form.disclaimerAccepted}
            onChange={handleChange}
          />
          I accept the disclaimer
        </label>

        {/* SECTION 5: Digital Signature */}
        <h3 style={{ color: "#c02675", marginTop: "20px" }}>
          Digital Signature
        </h3>
        <SignaturePad
          ref={sigPad}
          penColor="#d63384"
          canvasProps={{
            style: {
              width: "100%",
              height: "150px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "white",
            },
          }}
        />
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={clearSignature}
            style={{
              backgroundColor: "#ccc",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              width: "100%",
              fontSize: "16px",
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={saveSignature}
            style={{
              backgroundColor: "#d63384",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              width: "100%",
              fontSize: "16px",
            }}
          >
            Save Signature
          </button>
        </div>

        {/* Submit Button */}
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