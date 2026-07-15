"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";
import { FIRST_UNION_TITLE, getCitizenDisplayStatus, isFirstUnionNumber } from "@/lib/first-union";
import PassportBook from "@/components/PassportBook/index";

type Application = {
  id: number;
  full_name: string;
  country: string;
  application_number: string;
  passport_number?: string | null;
  status: string;
  approved_at?: string | null;
  photo_url?: string | null;
};

export default function CabinetPage() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState("");
  const [checkingSavedLogin, setCheckingSavedLogin] = useState(true);
  const [showPassport, setShowPassport] = useState(false);
  const [origin, setOrigin] = useState("");

  const passportBookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCheckingSavedLogin(false);
  }, []);

  async function login(savedNumber?: string, savedCode?: string) {
    setError("");

    const finalApplicationNumber = savedNumber || applicationNumber.trim();
    const finalAccessCode = savedCode || accessCode.trim();

    if (!finalApplicationNumber || !finalAccessCode) {
      setError("Введите номер заявки и код доступа.");
      setCheckingSavedLogin(false);
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("application_number", finalApplicationNumber)
      .eq("access_code", finalAccessCode)
      .maybeSingle();

    if (error || !data) {
      setError("Неверный номер заявки или код доступа.");
      setCheckingSavedLogin(false);
      return;
    }

    let passportNumber = data.passport_number || data.application_number;

    setApplication({
      ...data,
      passport_number: passportNumber,
    });

    setCheckingSavedLogin(false);
  }

  async function downloadPassportBook() {
    if (!passportBookRef.current || !application) return;

    try {
      const dataUrl = await toPng(passportBookRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#efe9df",
      });

      const link = document.createElement("a");
      link.download = `passport-${application.passport_number || application.application_number}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Не удалось скачать паспорт.");
    }
  }

  if (checkingSavedLogin) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center">
        Загрузка...
      </main>
    );
  }

  if (application) {
    const passportNumber =
      application.passport_number || application.application_number;

    const issueDate = application.approved_at
      ? new Date(application.approved_at).toLocaleDateString("ru-RU")
      : "Не указана";

    const verifyUrl = origin
      ? `${origin}/verify?number=${encodeURIComponent(passportNumber)}`
      : passportNumber;

    const isFirstUnionCitizen = isFirstUnionNumber(passportNumber);
    const citizenDisplayStatus = getCitizenDisplayStatus(passportNumber);

    const nameParts = application.full_name.trim().split(/\s+/);

const passport = {
  surname: nameParts[0] || "",
  givenName: nameParts.slice(1).join(" ") || "",

  nationality: "НЕЧЕГОНИЯ",

  country: application.country,

  passportNumber,

  issueDate,

  photoUrl: application.photo_url || "",

  qrCode: verifyUrl,

  status: application.status,

  citizenTitle: citizenDisplayStatus,

  birthDate: "",
  birthPlace: "",
  sex: "",
};

    return (
      <main className="min-h-[100dvh] flex flex-col items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow-xl w-[420px]">
          <h1 className="text-xl font-bold mb-4">Личный кабинет</h1>

          <p><b>Имя:</b> {application.full_name}</p>
          <p><b>Страна:</b> {application.country}</p>
          <p><b>Паспорт:</b> {passportNumber}</p>
          <p><b>Статус:</b> {application.status}</p>

          {application.status === "Одобрено" && (
            <button
              onClick={() => setShowPassport(true)}
              className="mt-4 w-full bg-black text-white p-3 rounded"
            >
              Открыть паспорт
            </button>
          )}

          <button
            onClick={() => setApplication(null)}
            className="mt-2 w-full border p-3 rounded"
          >
            Выйти
          </button>
        </div>

        {showPassport && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="relative bg-white p-6 rounded-xl">

              <button
                onClick={downloadPassportBook}
                className="absolute -top-12 right-0 bg-white px-4 py-2 rounded"
              >
                Скачать
              </button>

              <button
                onClick={() => setShowPassport(false)}
                className="absolute -top-12 left-0 bg-white px-4 py-2 rounded"
              >
                Закрыть
              </button>

            </div>

              <div ref={passportBookRef}>
                <PassportBook
    passport={passport}
/>
              </div>

          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[100dvh]">
      <div className="p-6 bg-white rounded-xl w-[400px]">
        <input
          placeholder="Номер заявки"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Код доступа"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={() => login()}
          className="w-full bg-black text-white p-2 mt-2"
        >
          Войти
        </button>
      </div>
    </main>
  );
}