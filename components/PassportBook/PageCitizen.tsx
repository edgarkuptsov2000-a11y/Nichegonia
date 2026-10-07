import { PassportProps } from "./types";

export default function PageCitizen({ passport }: PassportProps) {
  const citizenTitle =
    passport.citizenTitle || "Гражданин Ничегонии";

  return (
    <div className="passport-page">
      <div className="passport-security-pattern" />

      <div className="passport-inner">
        <div className="passport-header">
          <div>
            <div className="passport-country-small">
              CITIZENSHIP
            </div>

            <div className="passport-country">
              НИЧЕГОНИЯ
            </div>

            <div className="passport-type">
              CITIZEN RECORD
            </div>
          </div>

          <div className="passport-emblem">
            Н
          </div>
        </div>

        <div
          className="passport-info-block"
          style={{ marginTop: 18 }}
        >
          <div className="passport-info-title">
            ГРАЖДАНИН
          </div>

          <div
            style={{
              fontSize: 21,
              fontWeight: 700,
              lineHeight: 1.2,
              marginTop: 8,
            }}
          >
            {passport.surname} {passport.givenName}
          </div>
        </div>

        <div
          className="passport-status"
          style={{ marginTop: 16 }}
        >
          <div className="passport-status-label">
            СТАТУС ГРАЖДАНИНА
          </div>

          <div className="passport-status-value">
            {citizenTitle}
          </div>
        </div>

        <div
          className="passport-info-block"
          style={{ marginTop: 16 }}
        >
          <div className="passport-info-title">
            СВЕДЕНИЯ
          </div>

          <div className="passport-info-text">
            <strong>Номер паспорта:</strong>
            <br />
            {passport.passportNumber}
          </div>

          <div
            className="passport-info-text"
            style={{ marginTop: 12 }}
          >
            <strong>Страна происхождения:</strong>
            <br />
            {passport.country}
          </div>

          <div
            className="passport-info-text"
            style={{ marginTop: 12 }}
          >
            <strong>Дата выдачи:</strong>
            <br />
            {passport.issueDate}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 18,
            borderTop: "1px solid #d5ccb9",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#777",
            }}
          >
            ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Ничего. Но стабильно.
          </div>
        </div>
      </div>
    </div>
  );
}