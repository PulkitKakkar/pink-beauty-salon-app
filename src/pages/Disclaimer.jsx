import React from "react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#fff0f5",
        minHeight: "100vh",
      }}
    >
      {/* Sticky Back Button */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff0f5",
          padding: "10px 0",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#d63384",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ⬅ Back
        </button>
      </div>

      <h2
        style={{ color: "#d63384", textAlign: "center", marginBottom: "20px" }}
      >
        Full Disclaimer
      </h2>

      <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
        I, the named client, duly authorise staff of Pink Beauty Salon to
        perform laser hair removal procedures using state-of-the-art 4
        wavelength system utilizing 755nm, 808nm, 940nm and 1064nm. I understand
        that this is a relatively new aesthetic/cosmetic procedure and that
        long-term studies are ongoing. Past studies indicate this is an
        alternative method to removing unwanted hair and that results cannot
        permanently damage the skin or bodily parts. All results can vary
        according to hair type as well as the medical condition of the client. I
        am aware that multiple treatments may be necessary to achieve
        satisfactory results.
      </p>

      <ul
        style={{
          fontSize: "14px",
          color: "#333",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <li>The treatment may not produce permanent hair removal.</li>
        <li>
          Due to the nature of this treatment an exact result cannot be
          predicted and I acknowledge that no guarantees have been made to me as
          to the results that may be obtained.
        </li>
        <li>
          Possible side effects of the area can include mild discomfort,
          swelling, redness, itching, possible blistering and colour changes may
          develop.
        </li>
        <li>
          Colour changes such as hyperpigmentation (brown/red discolouration) or
          hypopigmentation (skin lightening) may occur in treated skin. This may
          take several months to return to normal.
        </li>
        <li>
          Skin must be protected from the sun for several weeks before and after
          treatment. Unprotected sun exposure in the weeks following treatment
          may worsen a condition that has hyper or hypo pigmentation.
        </li>
        <li>
          If the client has used oral isotretinoin (Accutane) (acne treatment)
          they must wait six months after this treatment ends before starting
          laser treatments.
        </li>
        <li>
          Blistering and mild crusting of the skin may occur. Scarring is a rare
          possibility but it has occurred in less than 1% of the treatment
          population.
        </li>
        <li>
          Cold sores (Herpes simplex virus) may become active due to high light
          exposure in those prone to them. It is recommended that Valtrex or
          Zovirax be taken as prescribed to avoid an outbreak.
        </li>
        <li>
          Client must use proper eye protection as recommended provided by the
          practitioner.
        </li>
        <li>
          My questions regarding this procedure have been answered to my
          satisfaction.
        </li>
        <li>I accept all risks of treatment.</li>
        <li>I have been provided with aftercare as directed by this clinic.</li>
        <li>
          I understand a patch test is required and 72h must be left before any
          treatment can be booked in.
        </li>
        <li>
          I have spoken about expectations and satisfied with all answers given
          by the practitioner.
        </li>
        <li>All reasonable care and skill has been conducted.</li>
        <li>
          All procedures and manners are carried out to 100% satisfaction.
        </li>
        <li>
          No loss or damages on his/her bodily parts for the process of laser
          hair removal treatments.
        </li>
        <li>Patch tests are advised and followed at client’s discretion.</li>
      </ul>

      <p style={{ fontSize: "14px", color: "#333", marginTop: "10px" }}>
        I consent to photographs for the purpose of monitoring, response to
        therapy and advertising. By signing this page I accept and understand
        all of the above notes mentioned.
      </p>
    </div>
  );
}
