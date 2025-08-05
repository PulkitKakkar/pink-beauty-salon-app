import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import SignatureSection from "../components/SignatureSection";
import BackLink from "../components/BackLink";

export default function AntiWrinkleForm() {
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

    pregnantOrBreastfeeding: "",
    previousTreatment: "",
    previousTreatmentDetails: "",
    allergies: "",
    allergyDetails: "",
    medication: "",
    medicationDetails: "",
    neurologicalDisorders: "",
    heartConditions: "",
    autoimmuneDiseases: "",
    skinConditions: "",
    otherHealthConcerns: "",
    smokeOrAlcohol: "",
    specialEvents: "",
    specialEventsDetails: "",

    treatmentAreas: [],
    treatmentExpectations: "",

    consentUnderstanding: false,
    consentResultsMayVary: false,
    consentSideEffects: false,

    photoConsent: "",

    declarationAccepted: false,

    practitionerName: "",
    consultationDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "treatmentAreas") {
      const newAreas = [...form.treatmentAreas];
      if (checked) {
        if (!newAreas.includes(value)) newAreas.push(value);
      } else {
        const index = newAreas.indexOf(value);
        if (index > -1) newAreas.splice(index, 1);
      }
      setForm({
        ...form,
        treatmentAreas: newAreas,
      });
    } else if (type === "checkbox") {
      setForm({
        ...form,
        [name]: checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
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
    if (!form.contactNumber) errors.contactNumber = "Contact number is required";
    if (!form.declarationAccepted)
      errors.declarationAccepted = "You must accept the declaration";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      await addDoc(collection(db, "antiWrinkleConsultations"), {
        ...form,
        signature: signatureURL,
        createdAt: new Date(),
      });
      toast.success("✅ Form submitted successfully!");
      setForm({
        fullName: "",
        dateOfBirth: "",
        contactNumber: "",
        email: "",
        address: "",
        emergencyContact: "",
        gpDetails: "",

        pregnantOrBreastfeeding: "",
        previousTreatment: "",
        previousTreatmentDetails: "",
        allergies: "",
        allergyDetails: "",
        medication: "",
        medicationDetails: "",
        neurologicalDisorders: "",
        heartConditions: "",
        autoimmuneDiseases: "",
        skinConditions: "",
        otherHealthConcerns: "",
        smokeOrAlcohol: "",
        specialEvents: "",
        specialEventsDetails: "",

        treatmentAreas: [],
        treatmentExpectations: "",

        consentUnderstanding: false,
        consentResultsMayVary: false,
        consentSideEffects: false,

        photoConsent: "",

        declarationAccepted: false,

        practitionerName: "",
        consultationDate: "",
        notes: "",
      });
      setSignatureURL("");
      sigPad.current.clear();
      setFormErrors({});
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        background: "#fff0f5",
        borderRadius: "12px",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <BackLink />
      <h2 style={{ color: "#d63384", textAlign: "center" }}>
        Anti-Wrinkle Treatment Consultation
      </h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
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
          type="text"
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
          type="text"
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>GP Details</label>
        <textarea
          name="gpDetails"
          value={form.gpDetails}
          onChange={handleChange}
          style={inputStyle}
        />

        <h4 style={{ marginTop: "20px", color: "#d63384" }}>Medical History</h4>

        <div style={{ marginBottom: "12px" }}>
          <label>Are you pregnant or breastfeeding?</label>
          <div>
            <label>
              <input
                type="radio"
                name="pregnantOrBreastfeeding"
                value="Yes"
                checked={form.pregnantOrBreastfeeding === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="pregnantOrBreastfeeding"
                value="No"
                checked={form.pregnantOrBreastfeeding === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Have you had previous anti-wrinkle treatment?</label>
          <div>
            <label>
              <input
                type="radio"
                name="previousTreatment"
                value="Yes"
                checked={form.previousTreatment === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="previousTreatment"
                value="No"
                checked={form.previousTreatment === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
          {form.previousTreatment === "Yes" && (
            <>
              <label>Please provide details of previous treatment</label>
              <textarea
                name="previousTreatmentDetails"
                value={form.previousTreatmentDetails}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any allergies?</label>
          <div>
            <label>
              <input
                type="radio"
                name="allergies"
                value="Yes"
                checked={form.allergies === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="allergies"
                value="No"
                checked={form.allergies === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
          {form.allergies === "Yes" && (
            <>
              <label>Please specify allergies</label>
              <textarea
                name="allergyDetails"
                value={form.allergyDetails}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Are you currently taking any medication?</label>
          <div>
            <label>
              <input
                type="radio"
                name="medication"
                value="Yes"
                checked={form.medication === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="medication"
                value="No"
                checked={form.medication === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
          {form.medication === "Yes" && (
            <>
              <label>Please specify medication</label>
              <textarea
                name="medicationDetails"
                value={form.medicationDetails}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any neurological disorders?</label>
          <div>
            <label>
              <input
                type="radio"
                name="neurologicalDisorders"
                value="Yes"
                checked={form.neurologicalDisorders === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="neurologicalDisorders"
                value="No"
                checked={form.neurologicalDisorders === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any heart conditions?</label>
          <div>
            <label>
              <input
                type="radio"
                name="heartConditions"
                value="Yes"
                checked={form.heartConditions === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="heartConditions"
                value="No"
                checked={form.heartConditions === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any autoimmune diseases?</label>
          <div>
            <label>
              <input
                type="radio"
                name="autoimmuneDiseases"
                value="Yes"
                checked={form.autoimmuneDiseases === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="autoimmuneDiseases"
                value="No"
                checked={form.autoimmuneDiseases === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any skin conditions?</label>
          <div>
            <label>
              <input
                type="radio"
                name="skinConditions"
                value="Yes"
                checked={form.skinConditions === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="skinConditions"
                value="No"
                checked={form.skinConditions === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Other health concerns?</label>
          <textarea
            name="otherHealthConcerns"
            value={form.otherHealthConcerns}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you smoke or consume alcohol?</label>
          <div>
            <label>
              <input
                type="radio"
                name="smokeOrAlcohol"
                value="Yes"
                checked={form.smokeOrAlcohol === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="smokeOrAlcohol"
                value="No"
                checked={form.smokeOrAlcohol === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Do you have any special events coming up?</label>
          <div>
            <label>
              <input
                type="radio"
                name="specialEvents"
                value="Yes"
                checked={form.specialEvents === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="specialEvents"
                value="No"
                checked={form.specialEvents === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
          {form.specialEvents === "Yes" && (
            <>
              <label>Please specify details</label>
              <textarea
                name="specialEventsDetails"
                value={form.specialEventsDetails}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}
        </div>

        <h4 style={{ marginTop: "20px", color: "#d63384" }}>Treatment Areas</h4>
        <div style={{ marginBottom: "12px" }}>
          {["Forehead", "Frown lines", "Crow’s feet", "Other"].map((area) => (
            <label key={area} style={{ display: "block", marginBottom: "6px" }}>
              <input
                type="checkbox"
                name="treatmentAreas"
                value={area}
                checked={form.treatmentAreas.includes(area)}
                onChange={handleChange}
              />{" "}
              {area}
            </label>
          ))}
        </div>

        <label>Treatment Expectations</label>
        <textarea
          name="treatmentExpectations"
          value={form.treatmentExpectations}
          onChange={handleChange}
          style={inputStyle}
        />

        <h4 style={{ marginTop: "20px", color: "#d63384" }}>Consent</h4>
        <label>
          <input
            type="checkbox"
            name="consentUnderstanding"
            checked={form.consentUnderstanding}
            onChange={handleChange}
          />
          I understand the nature of the anti-wrinkle treatment.
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="consentResultsMayVary"
            checked={form.consentResultsMayVary}
            onChange={handleChange}
          />
          I understand that results may vary.
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="consentSideEffects"
            checked={form.consentSideEffects}
            onChange={handleChange}
          />
          I am aware of potential side effects.
        </label>

        <h4 style={{ marginTop: "20px", color: "#d63384" }}>Photography Consent</h4>
        <div style={{ marginBottom: "12px" }}>
          <label>Do you consent to before and after photographs?</label>
          <div>
            <label>
              <input
                type="radio"
                name="photoConsent"
                value="Yes"
                checked={form.photoConsent === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>{" "}
            <label>
              <input
                type="radio"
                name="photoConsent"
                value="No"
                checked={form.photoConsent === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <SignatureSection
          sigPad={sigPad}
          clearSignature={clearSignature}
          saveSignature={saveSignature}
        />

        <label style={{ marginTop: "12px", display: "block" }}>
          Date of Signature
        </label>
        <input
          type="date"
          name="consultationDate"
          value={form.consultationDate}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ marginTop: "20px" }}>
          <input
            type="checkbox"
            name="declarationAccepted"
            checked={form.declarationAccepted}
            onChange={handleChange}
          />
          I declare that the information I have provided is accurate and complete to the best of my knowledge.
        </label>
        {formErrors.declarationAccepted && (
          <p className="error-text">{formErrors.declarationAccepted}</p>
        )}

        <h4 style={{ marginTop: "20px", color: "#d63384" }}>Practitioner Details</h4>
        <label>Practitioner Name</label>
        <input
          type="text"
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

        <button type="submit" style={submitBtnStyle}>
          Submit
        </button>
      </form>
    </div>
  );
}

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

const submitBtnStyle = {
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
};
