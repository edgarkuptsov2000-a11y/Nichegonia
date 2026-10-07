import { PassportProps } from "./types";

export default function PageEnd({ passport }: PassportProps) {
  return (
    <div className="passport-page">
      <div className="passport-security-pattern" />

      <div className="passport-inner passport-end">
        <div className="passport-end-emblem">
          Н
        </div>

        <div className="passport-end-title">
          НИЧЕГОНИЯ
        </div>

        <div className="passport-end-subtitle">
          ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
        </div>

        <div className="passport-end-divider" />

        <div className="passport-end-motto">
          Ничего.
          <br />
          Но стабильно.
        </div>

        <div
          style={{
            marginTop: "auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "1.5px",
              color: "#777",
              textTransform: "uppercase",
            }}
          >
            Паспорт гражданина
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {passport.passportNumber}
          </div>
        </div>
      </div>
    </div>
  );
}