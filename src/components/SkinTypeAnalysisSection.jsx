export default function SkinTypeAnalysisSection({
  skinQuestions,
  skinAnswers,
  handleSkinAnswer,
  skinScore,
  getFitzpatrickType,
}) {
  return (
    <div>
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
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
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

        <div style={{ marginTop: "18px", fontWeight: "600", fontSize: "16px" }}>
          Total Score: <span style={{ color: "#d63384" }}>{skinScore}</span>
          <br />
          Fitzpatrick Type:{" "}
          <span style={{ color: "#c02675" }}>
            {getFitzpatrickType(skinScore)}
          </span>
        </div>
      </div>
    </div>
  );
}
