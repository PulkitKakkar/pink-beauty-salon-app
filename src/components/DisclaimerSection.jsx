import { Link } from "react-router-dom";

export default function DisclaimerSection({ form, handleChange, formErrors }) {
  return (
    <div>
      <h3 style={{ color: "#c02675", marginTop: "20px" }}>Disclaimer</h3>
      <p style={{ fontSize: "14px", color: "#555" }}>
        Please read our full{" "}
        <Link
          to="/disclaimer"
          style={{ color: "#d63384", textDecoration: "underline" }}
        >
          Disclaimer
        </Link>{" "}
        before proceeding.
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
      {formErrors?.disclaimerAccepted && !form.disclaimerAccepted && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {formErrors.disclaimerAccepted}
        </p>
      )}
    </div>
  );
}
