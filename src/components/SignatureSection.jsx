import SignaturePad from "react-signature-canvas";

export default function SignatureSection({
  sigPad,
  saveSignature,
  clearSignature,
}) {
  return (
    <div>
      <h3 style={{ color: "#c02675", marginTop: "20px" }}>Digital Signature</h3>
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
    </div>
  );
}
