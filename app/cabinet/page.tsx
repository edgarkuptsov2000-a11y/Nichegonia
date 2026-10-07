"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
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
    const pages = Array.from(
      passportBookRef.current.querySelectorAll<HTMLElement>(
        ".passport-page"
      )
    );

    if (!pages.length) {
      throw new Error("Страницы паспорта не найдены.");
    }

    // Размер одной страницы паспорта.
    // Соотношение 360 × 520 сохраняем 1:1.
    const pageWidth = 180;
    const pageHeight = 260;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
      compress: true,
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      const dataUrl = await toPng(page, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#f7f2e8",
      });

      if (i > 0) {
        pdf.addPage([pageWidth, pageHeight], "portrait");
      }

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );
    }

    const passportNumber =
      application.passport_number ||
      application.application_number;

    pdf.save(`passport-${passportNumber}.pdf`);
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
    <main className="
      min-h-[100dvh]
      bg-[#F7F6F3]
      text-[#111111]
      px-4
      py-8
      sm:py-12
    ">

      <div className="w-full max-w-3xl mx-auto">

        {/* Основная карточка кабинета */}
        <div className="
          bg-white
          rounded-3xl
          border
          border-[#E5E1D8]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          overflow-hidden
        ">

          {/* Шапка */}
          <div className="
            px-6
            sm:px-10
            pt-8
            sm:pt-10
            pb-7
            text-center
            border-b
            border-[#E8E4DC]
          ">

            <div className="
              mx-auto
              w-20
              h-20
              rounded-full
              bg-[#F7F6F3]
              border
              border-[#C9A646]
              flex
              items-center
              justify-center
              mb-5
            ">
              <span className="text-3xl">
                ♛
              </span>
            </div>

            <p className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#8A6A18]
              font-bold
              mb-2
            ">
              Федеральная Республика
            </p>

            <h1 className="
              text-3xl
              sm:text-4xl
              font-black
              tracking-tight
            ">
              НИЧЕГОНИЯ
            </h1>

            <div className="
              w-12
              h-[2px]
              bg-[#C9A646]
              mx-auto
              my-4
            " />

            <p className="
              text-lg
              sm:text-xl
              font-bold
            ">
              Личный кабинет
            </p>

            <p className="
              mt-2
              text-sm
              text-gray-500
            ">
              Официальная информация гражданина
            </p>

          </div>


          {/* Информация о гражданине */}
          <div className="
            px-6
            sm:px-10
            py-8
            sm:py-10
          ">

            {/* Гражданин */}
            <div className="mb-8">

              <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-[#8A6A18]
                font-bold
                mb-2
              ">
                Гражданин
              </p>

              <h2 className="
                text-2xl
                sm:text-3xl
                font-black
                leading-tight
              ">
                {application.full_name}
              </h2>

              <p className="
                mt-2
                text-gray-500
                font-medium
              ">
                {application.country}
              </p>

            </div>


            {/* Основная информация */}
            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              mb-6
            ">

              {/* Паспорт */}
              <div className="
                rounded-2xl
                border
                border-[#E5E1D8]
                bg-[#FAF9F6]
                p-5
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.15em]
                  text-gray-500
                  font-bold
                  mb-2
                ">
                  Паспорт
                </p>

                <p className="
                  text-2xl
                  font-black
                  tracking-wide
                ">
                  {passportNumber}
                </p>

              </div>


              {/* Статус */}
              <div className="
                rounded-2xl
                border
                border-[#C9A646]
                bg-[#FFF9E8]
                p-5
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.15em]
                  text-[#8A6A18]
                  font-bold
                  mb-2
                ">
                  Статус
                </p>

                <p className="
                  text-base
                  sm:text-lg
                  font-black
                  leading-snug
                ">
                  {citizenDisplayStatus}
                </p>

              </div>

            </div>


            {/* Дата выдачи */}
            <div className="
              rounded-2xl
              border
              border-[#E5E1D8]
              bg-[#FAF9F6]
              p-5
              mb-8
            ">

              <p className="
                text-xs
                uppercase
                tracking-[0.15em]
                text-gray-500
                font-bold
                mb-2
              ">
                Дата выдачи паспорта
              </p>

              <p className="
                text-lg
                font-bold
              ">
                {issueDate}
              </p>

            </div>


            {/* Кнопка паспорта */}
            {application.status === "Одобрено" && (
              <button
                onClick={() => setShowPassport(true)}
                className="
                  w-full
                  h-14
                  rounded-xl
                  bg-[#111111]
                  text-white
                  font-bold
                  tracking-wide
                  transition
                  hover:bg-[#C9A646]
                  hover:text-[#111111]
                  active:scale-[0.99]
                "
              >
                ОТКРЫТЬ ПАСПОРТ
              </button>
            )}


            {/* Выйти */}
            <button
              onClick={() => setApplication(null)}
              className="
                w-full
                h-14
                mt-3
                rounded-xl
                border-2
                border-[#D9D5CC]
                bg-white
                text-[#111111]
                font-bold
                transition
                hover:border-[#111111]
                hover:bg-[#111111]
                hover:text-white
              "
            >
              ВЫЙТИ ИЗ КАБИНЕТА
            </button>

          </div>

        </div>


        {/* Подпись */}
        <p className="
          text-center
          text-xs
          text-gray-400
          mt-5
        ">
          Официальный портал Ничегонии
        </p>

      </div>


      {/* Модальное окно паспорта */}
      {showPassport && (
        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          p-4
        ">

          {/* Затемнение */}
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={() => setShowPassport(false)}
          />

          {/* Паспорт */}
          <div className="
            relative
            z-10
            max-w-full
            max-h-[92vh]
            flex
            flex-col
            items-center
          ">

            {/* Панель кнопок */}
            <div className="
              w-full
              flex
              justify-between
              gap-3
              mb-3
            ">

              <button
                onClick={() => setShowPassport(false)}
                className="
                  bg-white
                  text-[#111111]
                  px-5
                  py-3
                  rounded-xl
                  font-bold
                  shadow-lg
                  hover:bg-[#F7F6F3]
                  transition
                "
              >
                Закрыть
              </button>

              <button
                onClick={downloadPassportBook}
                className="
                  bg-[#C9A646]
                  text-[#111111]
                  px-5
                  py-3
                  rounded-xl
                  font-bold
                  shadow-lg
                  hover:bg-[#111111]
                  hover:text-white
                  transition
                "
              >
                Скачать
              </button>

            </div>

            <div
              ref={passportBookRef}
              className="
                max-w-full
                max-h-[82vh]
                overflow-auto
                rounded-xl
              "
            >
              <PassportBook
                passport={passport}
              />
            </div>

          </div>

        </div>
      )}

    </main>
  );
}

  return (
  <main className="min-h-[100dvh] bg-[#F7F6F3] text-[#111111] flex items-center justify-center px-4 py-10">

    <div className="w-full max-w-md">

      {/* Карточка входа */}
      <div className="
        bg-white
        rounded-3xl
        border
        border-[#E5E1D8]
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        overflow-hidden
      ">

        {/* Верхняя часть */}
        <div className="text-center px-6 sm:px-10 pt-8 sm:pt-10">

          <div className="
            mx-auto
            w-20
            h-20
            rounded-full
            bg-[#F7F6F3]
            border
            border-[#C9A646]
            flex
            items-center
            justify-center
            mb-6
          ">
            <span className="text-3xl">♛</span>
          </div>

          <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-[#8A6A18]
            font-bold
            mb-3
          ">
            Федеральная Республика
          </p>

          <h1 className="
            text-3xl
            sm:text-4xl
            font-black
            tracking-tight
          ">
            НИЧЕГОНИЯ
          </h1>

          <div className="w-12 h-[2px] bg-[#C9A646] mx-auto my-5" />

          <h2 className="
            text-xl
            sm:text-2xl
            font-bold
          ">
            Личный кабинет
          </h2>

          <p className="
            mt-3
            text-sm
            sm:text-base
            text-gray-500
            leading-relaxed
          ">
            Войдите в свой кабинет гражданина
            Ничегонии
          </p>

        </div>

        {/* Форма */}
        <div className="px-6 sm:px-10 pt-8 pb-9">

          <div className="space-y-5">

            {/* Номер заявки */}
            <div>

              <label className="
                block
                text-xs
                uppercase
                tracking-[0.15em]
                font-bold
                text-gray-700
                mb-2
              ">
                Номер заявки
              </label>

              <input
                type="text"
                placeholder="Например, НЧ-000001"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  border
                  border-[#D9D5CC]
                  bg-[#FAF9F6]
                  text-[#111111]
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-[#C9A646]
                  focus:ring-2
                  focus:ring-[#C9A646]/20
                "
              />

            </div>

            {/* Код доступа */}
            <div>

              <label className="
                block
                text-xs
                uppercase
                tracking-[0.15em]
                font-bold
                text-gray-700
                mb-2
              ">
                Код доступа
              </label>

              <input
                type="password"
                placeholder="Введите код доступа"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  border
                  border-[#D9D5CC]
                  bg-[#FAF9F6]
                  text-[#111111]
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-[#C9A646]
                  focus:ring-2
                  focus:ring-[#C9A646]/20
                "
              />

            </div>

            {/* Ошибка */}
            {error && (
              <div className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              ">
                {error}
              </div>
            )}

            {/* Кнопка */}
            <button
              onClick={() => login()}
              className="
                w-full
                h-14
                rounded-xl
                bg-[#111111]
                text-white
                font-bold
                tracking-wide
                transition
                hover:bg-[#C9A646]
                hover:text-[#111111]
                active:scale-[0.99]
              "
            >
              ВОЙТИ В КАБИНЕТ
            </button>

          </div>

          {/* Нижняя часть */}
          <div className="mt-7 text-center">

            <a
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-gray-500
                hover:text-[#111111]
                transition
              "
            >
              <span>←</span>
              Вернуться на главную
            </a>

          </div>

        </div>

      </div>

      <p className="
        text-center
        text-xs
        text-gray-400
        mt-5
      ">
        Официальный портал Ничегонии
      </p>

    </div>

  </main>
);
}