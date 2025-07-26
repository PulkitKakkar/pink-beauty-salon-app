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
        <ClientDetailsSection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        />
        <MedicalBackgroundSection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        />
        <TreatmentHistorySection
          form={form}
          handleChange={handleChange}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          formErrors={formErrors}
        />
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