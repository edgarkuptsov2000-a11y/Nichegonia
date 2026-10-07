import { PassportProps } from "./types";

export default function PageRights({ passport }: PassportProps) {
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
              CITIZEN RIGHTS
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
            ОСНОВНЫЕ ПОЛОЖЕНИЯ
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: "#444",
              marginTop: 7,
            }}
          >
            Каждый гражданин Ничегонии обладает
            следующими основными правами.
          </div>
        </div>

        <div
          className="passport-rights"
          style={{ marginTop: 18 }}
        >
          <div className="passport-right">
            <div className="passport-right-number">
              01
            </div>

            <div className="passport-right-text">
              <strong>Право на гражданство</strong>
              <br />
              Гражданин имеет право сохранять свой
              статус гражданина Ничегонии.
            </div>
          </div>

          <div className="passport-right">
            <div className="passport-right-number">
              02
            </div>

            <div className="passport-right-text">
              <strong>Право на официальный документ</strong>
              <br />
              Каждый гражданин может иметь документ,
              подтверждающий его статус.
            </div>
          </div>

          <div className="passport-right">
            <div className="passport-right-number">
              03
            </div>

            <div className="passport-right-text">
              <strong>Право на обращение</strong>
              <br />
              Гражданин может обращаться к официальным
              сервисам и представителям Ничегонии.
            </div>
          </div>

          <div className="passport-right">
            <div className="passport-right-number">
              04
            </div>

            <div className="passport-right-text">
              <strong>Право на сохранение данных</strong>
              <br />
              Персональные сведения гражданина должны
              использоваться только в предусмотренных целях.
            </div>
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
              lineHeight: 1.4,
              color: "#777",
            }}
          >
            Данный раздел содержит основные положения
            гражданского статуса Ничегонии.
          </div>

          <div
            style={{
              marginTop: 7,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            НИЧЕГО. НО СТАБИЛЬНО.
          </div>
        </div>
      </div>
    </div>
  );
}