import { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import ClientDetailsSection from "../components/ClientDetailsSection";
import MedicalBackgroundSection from "../components/MedicalBackgroundSection";
import TreatmentHistorySection from "../components/TreatmentHistorySection";
import SkinTypeAnalysisSection from "../components/SkinTypeAnalysisSection";
import DisclaimerSection from "../components/DisclaimerSection";
import SignatureSection from "../components/SignatureSection";
import BackLink from "../components/BackLink";

const skinQuestions = [
  {
    question: "Colour of eyes",
    options: [
      { label: "Light blue, gray, green", score: 0 },
      { label: "Blue, gray or green", score: 1 },
      { label: "Blue hazel or light brown", score: 2 },
      { label: "Dark brown", score: 3 },
      { label: "Brownish black", score: 4 },
    ],
  },
  {
    question: "Natural hair colour",
    options: [
      { label: "Sandy red", score: 0 },
      { label: "Blonde", score: 1 },
      { label: "Chestnut or dark blonde", score: 2 },
      { label: "Dark brown", score: 3 },
      { label: "Black", score: 4 },
    ],
  },
  {
    question: "Skin colour on non exposed areas",
    options: [
      { label: "Reddish", score: 0 },
      { label: "Very pale", score: 1 },
      { label: "Pale with beige tint", score: 2 },
      { label: "Light brown", score: 3 },
      { label: "Dark brown", score: 4 },
    ],
  },
  {
    question: "Freckles on unexposed areas",
    options: [
      { label: "Many", score: 0 },
      { label: "Several", score: 1 },
      { label: "Few", score: 2 },
      { label: "Very few", score: 3 },
      { label: "None", score: 4 },
    ],
  },
  {
    question: "Reaction to sun exposure: Blistering",
    options: [
      { label: "Always burns, blisters, peels", score: 0 },
      { label: "Often burns, blisters, peels", score: 1 },
      { label: "Burns, sometimes blisters, peels", score: 2 },
      { label: "Rarely burns, never blisters", score: 3 },
      { label: "Never burns", score: 4 },
    ],
  },
  {
    question: "Reaction to sun exposure: Degree of tan",
    options: [
      { label: "Never tans", score: 0 },
      { label: "Seldom tans", score: 1 },
      { label: "Sometimes tans", score: 2 },
      { label: "Often tans", score: 3 },
      { label: "Always tans", score: 4 },
    ],
  },
  {
    question: "Reaction to sun exposure: Turning red",
    options: [
      { label: "Painful redness, blistering, peeling", score: 0 },
      { label: "Moderate redness, sometimes blisters, peels", score: 1 },
      { label: "Mild redness, rarely blisters", score: 2 },
      { label: "Rarely red", score: 3 },
      { label: "Never red", score: 4 },
    ],
  },
  {
    question: "Face reaction to sun",
    options: [
      { label: "Very sensitive", score: 0 },
      { label: "Sensitive", score: 1 },
      { label: "Normal", score: 2 },
      { label: "Very resistant", score: 3 },
      { label: "Never had a problem", score: 4 },
    ],
  },
  {
    question: "When did the area last receive a tan?",
    options: [
      { label: "More than 3 months ago", score: 0 },
      { label: "2–3 months ago", score: 1 },
      { label: "1–2 months ago", score: 2 },
      { label: "Less than a month ago", score: 3 },
      { label: "Less than 2 weeks ago", score: 4 },
    ],
  },
  {
    question: "How often is this area exposed to the sun?",
    options: [
      { label: "Hardly ever", score: 0 },
      { label: "Occasionally", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Always", score: 4 },
    ],
  },
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
    surgeryInLast6Months: "",
    hadLaserHairRemovalBefore: "",
    additionalMedications: "",
    useSunbedsOrTanningProducts: "",
    tattoosOrPermanentMakeup: "",
    currentlyPregnantOrTryingToConceive: "",
    usedRoaccutaneInLast6Months: "",
    anyOtherCosmeticProcedure: "",
    anyOtherCosmeticProcedureDetails: "",
    // Medical History fields
    skin_cancer: "",
    high_blood_pressure: "",
    polycystic_ovaries: "",
    cold_sores: "",
    haemophilia: "",
    menopause: "",
    epilepsy: "",
    keloid: "",
    anti_inflammatory_drugs: "",
    irregular_periods: "",
    cancer: "",
    heart_problems: "",
    birth_control_pill: "",
    diabetes: "",
    anti_coagulant: "",
    thyroid: "",
    asprin: "",
    medicalHistoryDetails: "",
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

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Clear previous errors
    setFormErrors({});

    let errors = {};

    // ✅ Inline validation for disclaimer
    if (!form.disclaimerAccepted) {
      errors.disclaimerAccepted =
        "Please accept the disclaimer before submitting.";
    }

    // ✅ Inline validation for required fields (you can add more)
    if (!form.clientName) errors.clientName = "Client name is required.";
    if (!form.phone) errors.phone = "Phone number is required.";

    // --- Add validation for new fields ---
    if (!form.usedRoaccutaneInLast6Months)
      errors.usedRoaccutaneInLast6Months = "Please answer this question.";
    if (!form.anyOtherCosmeticProcedure)
      errors.anyOtherCosmeticProcedure = "Please answer this question.";
    if (
      form.anyOtherCosmeticProcedure === "yes" &&
      !form.anyOtherCosmeticProcedureDetails
    ) {
      errors.anyOtherCosmeticProcedureDetails =
        "Please list the procedures and dates.";
    }

    // ✅ If errors exist, stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    try {
      await addDoc(collection(db, "consultations"), {
        ...form,
        signature: signatureURL,
        createdAt: new Date(),
      });

      toast.success("✅ Consultation Form Saved!");

      // ✅ Reset form (after successful save)
      setForm({
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
        surgeryInLast6Months: "",
        hadLaserHairRemovalBefore: "",
        additionalMedications: "",
        useSunbedsOrTanningProducts: "",
        tattoosOrPermanentMakeup: "",
        currentlyPregnantOrTryingToConceive: "",
        usedRoaccutaneInLast6Months: "",
        anyOtherCosmeticProcedure: "",
        anyOtherCosmeticProcedureDetails: "",
        // Medical History fields
        skin_cancer: "",
        high_blood_pressure: "",
        polycystic_ovaries: "",
        cold_sores: "",
        haemophilia: "",
        menopause: "",
        epilepsy: "",
        keloid: "",
        anti_inflammatory_drugs: "",
        irregular_periods: "",
        cancer: "",
        heart_problems: "",
        birth_control_pill: "",
        diabetes: "",
        anti_coagulant: "",
        thyroid: "",
        asprin: "",
        medicalHistoryDetails: "",
      });
      setSkinAnswers({});
      setSkinScore(0);
      setSignatureURL("");
      sigPad.current.clear();
    } catch (error) {
      toast.error("❌ Something went wrong while saving.");
      console.error(error);
    }
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
        margin: "20px auto",
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "#fff0f5",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <BackLink />
      <h2
        style={{ color: "#d63384", textAlign: "center", marginBottom: "20px" }}
      >
        Laser Treatment Consultation Form
      </h2>

      <form onSubmit={handleSubmit}>
        <ClientDetailsSection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        />
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Areas to be treated
            <textarea
              name="areasToBeTreated"
              value={form.areasToBeTreated}
              onChange={handleChange}
              style={inputStyle}
              rows={3}
              placeholder="e.g. Face, underarms, bikini line"
            />
          </label>
          {formErrors.areasToBeTreated && (
            <p style={{ color: "red", marginTop: "4px" }}>
              {formErrors.areasToBeTreated}
            </p>
          )}
        </div>

        <MedicalBackgroundSection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        />
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Have you had surgery in the last 6 months?
            <select
              name="surgeryInLast6Months"
              value={form.surgeryInLast6Months}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Have you had laser hair removal before?
            <select
              name="hadLaserHairRemovalBefore"
              value={form.hadLaserHairRemovalBefore}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Do you use sun beds or self-tanning products?
            <select
              name="useSunbedsOrTanningProducts"
              value={form.useSunbedsOrTanningProducts}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Do you have tattoos or permanent makeup in areas to be treated?
            <select
              name="tattoosOrPermanentMakeup"
              value={form.tattoosOrPermanentMakeup}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Are you currently pregnant or trying to conceive?
            <select
              name="currentlyPregnantOrTryingToConceive"
              value={form.currentlyPregnantOrTryingToConceive}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Additional Medications or Notes
            <textarea
              name="additionalMedications"
              value={form.additionalMedications}
              onChange={handleChange}
              style={inputStyle}
              rows={3}
              placeholder="e.g. Any other medications or important notes"
            />
          </label>
        </div>

        {/* --- Missing medical questions from PDF (added) --- */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Are you sensitive to any soaps or lotions?
            <select
              name="sensitiveSoaps"
              value={form.sensitiveSoaps}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {formErrors.sensitiveSoaps && (
            <p style={{ color: "red", marginTop: "6px" }}>
              {formErrors.sensitiveSoaps}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Does your skin get blotchy, red or irritated easily?
            <select
              name="skinIrritated"
              value={form.skinIrritated}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {formErrors.skinIrritated && (
            <p style={{ color: "red", marginTop: "6px" }}>
              {formErrors.skinIrritated}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Have you had significant sun exposure in the last 6 weeks?
            <select
              name="sunExposure6Weeks"
              value={form.sunExposure6Weeks}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {formErrors.sunExposure6Weeks && (
            <p style={{ color: "red", marginTop: "6px" }}>
              {formErrors.sunExposure6Weeks}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Have you waxed the areas to be treated within the last month?
            <select
              name="waxedAreasMonth"
              value={form.waxedAreasMonth}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {formErrors.waxedAreasMonth && (
            <p style={{ color: "red", marginTop: "6px" }}>
              {formErrors.waxedAreasMonth}
            </p>
          )}
        </div>
        {/* --- end added fields --- */}

        {/* ---------------- Page 2 (PDF) — Previous meds & procedures ---------------- */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              Have you used Roaccutane (isotretinoin) within the last 6 months?
              <select
                name="usedRoaccutaneInLast6Months"
                value={form.usedRoaccutaneInLast6Months}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            {formErrors.usedRoaccutaneInLast6Months && (
              <p style={{ color: "red", marginTop: "6px" }}>
                {formErrors.usedRoaccutaneInLast6Months}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              Have you had any other cosmetic procedure(s) previously?
              <select
                name="anyOtherCosmeticProcedure"
                value={form.anyOtherCosmeticProcedure}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            {formErrors.anyOtherCosmeticProcedure && (
              <p style={{ color: "red", marginTop: "6px" }}>
                {formErrors.anyOtherCosmeticProcedure}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              If yes, please state which procedure(s) and approximate date(s)
              <textarea
                name="anyOtherCosmeticProcedureDetails"
                value={form.anyOtherCosmeticProcedureDetails}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "86px" }}
                placeholder="e.g. Botox (Jan 2024) — Forehead; Filler (Mar 2023) — Lips"
              />
            </label>
            {formErrors.anyOtherCosmeticProcedureDetails && (
              <p style={{ color: "red", marginTop: "6px" }}>
                {formErrors.anyOtherCosmeticProcedureDetails}
              </p>
            )}
          </div>
        </div>
        {/* ---------------- end Page 2 block ---------------- */}

        {/* ---------------- Medical History (from PDF) ---------------- */}
        <div style={{ marginBottom: "18px" }}>
          <h3 style={{ color: "#d63384", marginBottom: "10px" }}>
            Medical History
          </h3>

          {[
            "Skin Cancer",
            "High Blood Pressure",
            "Polycystic ovaries",
            "Cold sores",
            "Haemophilia",
            "Menopause",
            "Epilepsy",
            "Keloid",
            "Anti-inflammatory drugs",
            "Irregular periods",
            "Cancer",
            "Heart Problems",
            "Birth control pill",
            "Diabetes",
            "Anti coagulant",
            "Thyroid",
            "Asprin",
          ].map((condition) => (
            <div key={condition} style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>
                {condition}
                <select
                  name={condition.replace(/\s+/g, "_").toLowerCase()}
                  value={
                    form[condition.replace(/\s+/g, "_").toLowerCase()] || ""
                  }
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>
          ))}

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              If yes to any of the above, please explain and include dates
              <textarea
                name="medicalHistoryDetails"
                value={form.medicalHistoryDetails || ""}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "80px" }}
                placeholder="Please explain details here..."
              />
            </label>
          </div>
        </div>
        {/* ---------------- end Medical History block ---------------- */}

        {/* <TreatmentHistorySection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        /> */}
        <SkinTypeAnalysisSection
          skinQuestions={skinQuestions}
          skinAnswers={skinAnswers}
          handleSkinAnswer={handleSkinAnswer}
          skinScore={skinScore}
          getFitzpatrickType={getFitzpatrickType}
        />
        <DisclaimerSection
          form={form}
          handleChange={handleChange}
          formErrors={formErrors}
        />

        <SignatureSection
          sigPad={sigPad}
          clearSignature={clearSignature}
          saveSignature={saveSignature}
        />
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
