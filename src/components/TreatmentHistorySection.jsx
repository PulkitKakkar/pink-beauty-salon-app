export default function TreatmentHistorySection({
  form,
  handleChange,
  inputStyle,
  labelStyle,
}) {
  return (
    <div>
      <h3 style={{ color: "#c02675", marginTop: "20px" }}>Treatment History</h3>

      {/* Laser Hair Removal */}
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

      {/* Tanning */}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle} htmlFor="tanning">
          Do you use tanning products?
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

      {/* Tattoos */}
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
    </div>
  );
}
