export default function MedicalBackgroundSection({
  form,
  handleChange,
  inputStyle,
  labelStyle,
}) {
  return (
    <div>
      <h3 style={{ color: "#c02675", marginTop: "20px" }}>
        Medical Background
      </h3>

      {/* Doctor care */}
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

      {/* Doctor care for what */}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle} htmlFor="doctorCareForWhat">
          If yes, for what?
        </label>
        <textarea
          name="doctorCareForWhat"
          id="doctorCareForWhat"
          value={form.doctorCareForWhat}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "48px" }}
        />
      </div>

      {/* Hormone Medication */}
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

      {/* Hormone medication details */}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle} htmlFor="hormoneMedicationDetails">
          If yes, indicate the specific hormone medication
        </label>
        <textarea
          name="hormoneMedicationDetails"
          id="hormoneMedicationDetails"
          value={form.hormoneMedicationDetails}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "48px" }}
        />
      </div>

      {/* Medications */}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle} htmlFor="allMedications">
          Please list any medications (prescription or non-prescription)
        </label>
        <textarea
          name="allMedications"
          id="allMedications"
          value={form.allMedications}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "60px" }}
        />
      </div>
    </div>
  );
}
