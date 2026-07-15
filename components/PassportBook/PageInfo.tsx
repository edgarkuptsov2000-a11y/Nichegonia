import { PassportProps } from "./types";

export default function PageInfo({ passport }: PassportProps) {
  return (
    <div className="passport-page">
      <div className="passport-inner">

        <div className="passport-header">
          <div>
            <div className="passport-country-small">
              FEDERAL REPUBLIC OF
            </div>

            <div className="passport-country">
              NICHEGONIA
            </div>

            <div className="passport-type">
              PASSPORT
            </div>
          </div>

          <div className="passport-emblem">
            Н
          </div>
        </div>

        <div className="passport-content">

          <div className="passport-photo">
            {passport.photoUrl ? (
              <img
                src={passport.photoUrl}
                alt=""
              />
            ) : (
              <div className="passport-photo-placeholder">
                PHOTO
              </div>
            )}
          </div>

          <div className="passport-fields">

            <div className="field">
              <span className="field-label">Passport No.</span>
              <span className="field-value">{passport.passportNumber}</span>
            </div>

            <div className="field">
              <span className="field-label">Surname</span>
              <span className="field-value">{passport.surname}</span>
            </div>

            <div className="field">
              <span className="field-label">Given names</span>
              <span className="field-value">{passport.givenName}</span>
            </div>

            <div className="field">
              <span className="field-label">Nationality</span>
              <span className="field-value">{passport.nationality}</span>
            </div>

            <div className="field">
              <span className="field-label">Birth date</span>
              <span className="field-value">
                {passport.birthDate || "—"}
              </span>
            </div>

            <div className="field">
              <span className="field-label">Sex</span>
              <span className="field-value">
                {passport.sex || "—"}
              </span>
            </div>

            <div className="field">
              <span className="field-label">Place of birth</span>
              <span className="field-value">
                {passport.birthPlace || passport.country}
              </span>
            </div>

            <div className="field">
              <span className="field-label">Date of issue</span>
              <span className="field-value">
                {passport.issueDate}
              </span>
            </div>

          </div>

        </div>

        <div className="passport-sign">

          <div className="sign-line" />

          <span>Holder signature</span>

        </div>

        <div className="mrz">
          P&lt;NGN{passport.surname.toUpperCase()}&lt;&lt;{passport.givenName.toUpperCase().replace(/ /g, "<")}
          <br />
          {passport.passportNumber.replace(/-/g, "")}
          &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>

      </div>
    </div>
  );
}