import { useState } from "react";
import BackLink from "../components/BackLink";
import { toast } from "react-hot-toast";

export default function LemonBottleForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    contact: "",
    email: "",
    address: "",
    emergencyContact: "",
    gp: "",
    pregnant: "",
    previousFatDissolving: "",
    previousFatDissolvingDetails: "",
    allergies: "",
    allergyDetails: "",
    medication: "",
    medicationList: "",
    liverKidney: "",
    autoimmune: "",
    heart: "",
    diabetes: "",
    skinCondition: "",
    otherConditions: "",
    recentSurgery: "",
    scarringHistory: "",
    smokeOrAlcohol: "",
    specialEvents: "",
    specialEventsDetails: "",
    treatmentAreas: [],
    otherArea: "",
    pastComplications: "",
    complicationsDetails: "",
    expectations: "",
    consent1: false,
    consent2: false,
    consent3: false,
    consent4: false,
    consent5: false,
    photoConsent: "",
    practitionerName: "",
    consultationDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "treatmentAreas") {
      setForm((prev) => {
        const updated = prev.treatmentAreas.includes(value)
          ? prev.treatmentAreas.filter((v) => v !== value)
          : [...prev.treatmentAreas, value];
        return { ...prev, treatmentAreas: updated };
      });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("✅ Form submitted successfully (mock)");
    console.log(form);
  };

  return (
    <div className="form-container">
      <BackLink />
      <h2 className="form-heading">
        Lemon Bottle (Fat Dissolving) Consultation
      </h2>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {/* Client Details */}
        <label>Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} />

        <label>Emergency Contact</label>
        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
        />

        <label>GP Name & Address</label>
        <textarea name="gp" value={form.gp} onChange={handleChange} />

        {/* Medical History */}
        <h4>Medical History</h4>
        {[
          ["pregnant", "Are you pregnant or breastfeeding?"],
          [
            "previousFatDissolving",
            "Have you had fat dissolving treatment before?",
          ],
          ["allergies", "Any known allergies (e.g., soy, lidocaine)?"],
          ["medication", "Currently taking any medications?"],
          ["liverKidney", "Liver or kidney disease?"],
          ["autoimmune", "Autoimmune disorder?"],
          ["heart", "Heart condition?"],
          ["diabetes", "Diabetes?"],
          ["skinCondition", "Skin conditions (e.g., eczema, psoriasis)?"],
          ["recentSurgery", "Major surgery in last 12 months?"],
          ["scarringHistory", "History of keloid/hypertrophic scarring?"],
        ].map(([key, label]) => (
          <div key={key}>
            <label>{label}</label>
            <select
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        ))}

        {form.previousFatDissolving === "Yes" && (
          <>
            <label>Please specify previous treatment</label>
            <textarea
              name="previousFatDissolvingDetails"
              value={form.previousFatDissolvingDetails}
              onChange={handleChange}
            />
          </>
        )}
        {form.allergies === "Yes" && (
          <>
            <label>Please specify allergy</label>
            <textarea
              name="allergyDetails"
              value={form.allergyDetails}
              onChange={handleChange}
            />
          </>
        )}
        {form.medication === "Yes" && (
          <>
            <label>List of Medications</label>
            <textarea
              name="medicationList"
              value={form.medicationList}
              onChange={handleChange}
            />
          </>
        )}
        <label>Other medical conditions</label>
        <textarea
          name="otherConditions"
          value={form.otherConditions}
          onChange={handleChange}
        />

        {/* Lifestyle & Expectations */}
        <h4>Lifestyle & Expectations</h4>
        <label>Do you smoke or drink regularly?</label>
        <select
          name="smokeOrAlcohol"
          value={form.smokeOrAlcohol}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <label>Any special event in 2 weeks?</label>
        <select
          name="specialEvents"
          value={form.specialEvents}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        {form.specialEvents === "Yes" && (
          <>
            <label>Please specify event</label>
            <textarea
              name="specialEventsDetails"
              value={form.specialEventsDetails}
              onChange={handleChange}
            />
          </>
        )}

        <label>Areas for treatment</label>
        {["Chin", "Abdomen", "Thighs", "Arms", "Flanks"].map((area) => (
          <div key={area}>
            <input
              type="checkbox"
              name="treatmentAreas"
              value={area}
              checked={form.treatmentAreas.includes(area)}
              onChange={handleChange}
            />
            <label>{area}</label>
          </div>
        ))}
        <input
          name="otherArea"
          value={form.otherArea}
          onChange={handleChange}
          placeholder="Other..."
        />

        <label>Past cosmetic complications?</label>
        <select
          name="pastComplications"
          value={form.pastComplications}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        {form.pastComplications === "Yes" && (
          <>
            <label>Complication details</label>
            <textarea
              name="complicationsDetails"
              value={form.complicationsDetails}
              onChange={handleChange}
            />
          </>
        )}

        <label>What are your expectations?</label>
        <textarea
          name="expectations"
          value={form.expectations}
          onChange={handleChange}
        />

        {/* Consent */}
        <h4>Consent for Treatment</h4>
        {[
          [
            "consent1",
            "I have been informed about Lemon Bottle treatment and possible risks.",
          ],
          [
            "consent2",
            "I understand results may vary and multiple sessions might be needed.",
          ],
          ["consent3", "I have had a chance to ask questions."],
          ["consent4", "I agree to follow post-care instructions."],
          ["consent5", "I understand outcomes may not meet expectations."],
        ].map(([key, label]) => (
          <div key={key}>
            <input
              type="checkbox"
              name={key}
              checked={form[key]}
              onChange={handleChange}
            />
            <label>{label}</label>
          </div>
        ))}

        <label>Photography & Advertising Consent</label>
        <select
          name="photoConsent"
          value={form.photoConsent}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option>Yes, I agree</option>
          <option>No, I do not agree</option>
        </select>

        {/* Practitioner Section */}
        <label>Practitioner Name</label>
        <input
          name="practitionerName"
          value={form.practitionerName}
          onChange={handleChange}
        />

        <label>Date of Consultation</label>
        <input
          type="date"
          name="consultationDate"
          value={form.consultationDate}
          onChange={handleChange}
        />

        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        <button type="submit" className="submit-btn">
          Submit Form
        </button>
      </form>
    </div>
  );
}
import "../styles/LemonBottleForm.css"; 
