"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { PassportProps } from "./types";

export default function PageQR({ passport }: PassportProps) {
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(passport.qrCode, {
      width: 300,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (active) {
          setQrImage(url);
        }
      })
      .catch(() => {
        if (active) {
          setQrImage("");
        }
      });

    return () => {
      active = false;
    };
  }, [passport.qrCode]);

  return (
    <div className="passport-page passport-qr-page">
      <div className="passport-security-pattern" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          className="passport-emblem"
          style={{
            width: 58,
            height: 58,
            marginBottom: 14,
          }}
        >
          Н
        </div>

        <div className="passport-qr-title">
          FEDERAL REPUBLIC OF
        </div>

        <div className="passport-qr-country">
          NICHEGONIA
        </div>

        <div className="passport-qr-divider" />

        <div className="passport-qr-label">
          ПРОВЕРКА ПАСПОРТА
        </div>

        {qrImage ? (
          <div className="passport-qr-box">
            <img
              src={qrImage}
              alt="QR-код для проверки паспорта"
            />
          </div>
        ) : (
          <div className="passport-qr-box">
            <span>Загрузка...</span>
          </div>
        )}

        <div className="passport-qr-number">
          {passport.passportNumber}
        </div>

        <div className="passport-qr-description">
          Отсканируйте QR-код, чтобы открыть
          официальную страницу проверки документа.
        </div>
      </div>
    </div>
  );
}