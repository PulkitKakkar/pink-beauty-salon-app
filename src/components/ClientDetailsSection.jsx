export default function ClientDetailsSection({
  form,
  handleChange,
  inputStyle,
  labelStyle,
}) {
  return (
    <div>
      <h3 style={{ color: "#c02675" }}>Client Details</h3>

      {/* Date (read-only) */}
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

      {/* Client Name */}
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

      {/* DOB */}
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

      {/* Address */}
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

      {/* Phone */}
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

      {/* Email */}
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
    </div>
  );
}
