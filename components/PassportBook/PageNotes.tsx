import { PassportProps } from "./types";

export default function PageNotes({ passport }: PassportProps) {
  return (
    <div className="passport-page">
      <div className="passport-security-pattern" />

      <div className="passport-inner">
        <div className="passport-header">
          <div>
            <div className="passport-country-small">
              FEDERAL REPUBLIC OF
            </div>

            <div className="passport-country">
              НИЧЕГОНИЯ
            </div>

            <div className="passport-type">
              OFFICIAL NOTES
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
            СЛУЖЕБНЫЕ ОТМЕТКИ
          </div>

          <div
            className="passport-info-text"
            style={{ marginTop: 7 }}
          >
            Дополнительные сведения и отметки,
            относящиеся к данному документу.
          </div>
        </div>

        <div
          className="passport-notes"
          style={{ marginTop: 20 }}
        >
          <div className="passport-note-line">
            <span>01</span>
          </div>

          <div className="passport-note-line">
            <span>02</span>
          </div>

          <div className="passport-note-line">
            <span>03</span>
          </div>

          <div className="passport-note-line">
            <span>04</span>
          </div>

          <div className="passport-note-line">
            <span>05</span>
          </div>

          <div className="passport-note-line">
            <span>06</span>
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
              fontSize: 9,
              color: "#777",
              lineHeight: 1.5,
            }}
          >
            Документ: {passport.passportNumber}
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 9,
              color: "#777",
            }}
          >
            Ничегония • Официальный документ
          </div>
        </div>
      </div>
    </div>
  );
}