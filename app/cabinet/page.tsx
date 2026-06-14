"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";

type Application = {
  full_name: string;
  country: string;
  application_number: string;
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

  const passportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const savedApplicationNumber = localStorage.getItem("application_number");
    const savedAccessCode = localStorage.getItem("access_code");

    if (savedApplicationNumber && savedAccessCode) {
      setApplicationNumber(savedApplicationNumber);
      setAccessCode(savedAccessCode);

      login(savedApplicationNumber, savedAccessCode);
    } else {
      setCheckingSavedLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .single();

    if (error || !data) {
      localStorage.removeItem("application_number");
      localStorage.removeItem("access_code");

      setError("Неверный номер заявки или код доступа.");
      setCheckingSavedLogin(false);
      return;
    }

    localStorage.setItem("application_number", finalApplicationNumber);
    localStorage.setItem("access_code", finalAccessCode);

    setApplication(data);
    setCheckingSavedLogin(false);
  }

  async function downloadPassportImage() {
    if (!passportRef.current || !application) {
      return;
    }

    try {
      const dataUrl = await toPng(passportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#EFE8D8"
      });

      const link = document.createElement("a");
      link.download = `passport-${application.application_number}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.log("PASSPORT DOWNLOAD ERROR:", error);
      alert("Не удалось скачать паспорт. Попробуйте ещё раз.");
    }
  }

  async function downloadPassportPdf() {
    if (!passportRef.current || !application) {
      return;
    }

    try {
      const dataUrl = await toPng(passportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#EFE8D8"
      });

      const image = new Image();
      image.src = dataUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject();
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const imageRatio = image.width / image.height;

      let renderWidth = maxWidth;
      let renderHeight = renderWidth / imageRatio;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = renderHeight * imageRatio;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`passport-${application.application_number}.pdf`);
    } catch (error) {
      console.log("PASSPORT PDF ERROR:", error);
      alert("Не удалось скачать паспорт PDF. Попробуйте ещё раз.");
    }
  }

  if (checkingSavedLogin) {
    return (
      <main className="
        min-h-[100dvh]
        bg-[#F7F6F3]
        flex
        items-center
        justify-center
        px-4 sm:px-6
        text-[#111111]
      ">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-5
          sm:p-10
          text-center
          border
          border-gray-200
        ">
          <p className="text-xl sm:text-2xl font-black text-[#111111]">
            Загрузка личного кабинета...
          </p>
        </div>
      </main>
    );
  }

  if (application) {
    const passportNumber = application.application_number;

    const issueDate = application.approved_at
      ? new Date(application.approved_at).toLocaleDateString("ru-RU")
      : "Не указана";

      const verifyUrl = origin
  ? `${origin}/verify?number=${encodeURIComponent(application.application_number)}`
  : application.application_number;

    const photoUrl = application.photo_url || "";

    const initials = application.full_name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <main className="
        min-h-[100dvh]
        bg-[#F7F6F3]
        flex
        items-center
        justify-center
        px-4 sm:px-6
        py-6 sm:py-10
        text-[#111111]
      ">
        <div className="
          bg-white
          max-w-2xl
          w-full
          rounded-3xl
          shadow-2xl
          p-5
          sm:p-10
          border
          border-gray-200
        ">
          <h1 className="
            text-3xl sm:text-4xl
            font-black
            mb-8
            text-center
            text-[#111111]
          ">
            Личный кабинет Ничегонии
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#111111]">
            <div className="
              bg-[#F7F6F3]
              rounded-2xl
              p-4
            sm:p-5
              border
              border-gray-200
            ">
              <p className="text-gray-500 text-sm mb-1">
                Имя
              </p>

              <p className="font-bold text-[#111111]">
                {application.full_name}
              </p>
            </div>

            <div className="
              bg-[#F7F6F3]
              rounded-2xl
              p-4
            sm:p-5
              border
              border-gray-200
            ">
              <p className="text-gray-500 text-sm mb-1">
                Страна
              </p>

              <p className="font-bold text-[#111111]">
                {application.country}
              </p>
            </div>

            <div className="
              bg-[#F7F6F3]
              rounded-2xl
              p-4
            sm:p-5
              border
              border-gray-200
            ">
              <p className="text-gray-500 text-sm mb-1">
                Номер заявки
              </p>

              <p className="font-black text-[#111111]">
                {application.application_number}
              </p>
            </div>

            <div className="
              bg-yellow-50
              rounded-2xl
              p-4
            sm:p-5
              border
              border-yellow-200
            ">
              
              <p className="text-yellow-700 text-sm mb-1">
                Статус
              </p>
              

              <p className="font-black text-yellow-800">
                {application.status === "На рассмотрении" && "🟡 На рассмотрении"}
                {application.status === "Одобрено" && "🟢 Одобрено"}
                {application.status === "Отклонено" && "🔴 Отклонено"}
              </p>
            </div>
          </div>

          {application.status === "Одобрено" && (
            <button
              onClick={() => setShowPassport(true)}
              className="
                w-full
                mt-8
                bg-[#111111]
                text-white
                py-4
                rounded-xl
                font-black
                hover:opacity-90
                transition
              "
            >
              Паспорт гражданина Ничегонии
            </button>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("application_number");
              localStorage.removeItem("access_code");

              setApplication(null);
              setApplicationNumber("");
              setAccessCode("");
              setShowPassport(false);
            }}
            className="
              w-full
              mt-4
              bg-[#111111]
              text-white
              py-4
              rounded-xl
              font-bold
              hover:opacity-90
              transition
            "
          >
            Выйти
          </button>
        </div>

        {showPassport && (
          <div className="
            fixed
            inset-0
            z-50
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          ">
            <div className="
              relative
              w-full
              max-w-6xl
              max-h-[92dvh]
              overflow-y-auto
            ">
              <div className="
                sticky
                top-0
                z-20
                mb-3
                flex
                justify-end
                gap-2
                sm:gap-3
              ">
                <button
                  onClick={downloadPassportImage}
                  className="
                    h-10
                    sm:h-12
                    px-4
                    sm:px-5
                    text-sm
                    sm:text-base
                    rounded-full
                    bg-white
                    text-[#111111]
                    font-black
                    shadow-lg
                    hover:bg-gray-100
                    transition
                  "
                >
                  PNG
                </button>

                <button
                  onClick={downloadPassportPdf}
                  className="
                    h-10
                    sm:h-12
                    px-4
                    sm:px-5
                    text-sm
                    sm:text-base
                    rounded-full
                    bg-white
                    text-[#111111]
                    font-black
                    shadow-lg
                    hover:bg-gray-100
                    transition
                  "
                >
                  PDF
                </button>

                <button
                  onClick={() => setShowPassport(false)}
                  className="
                    w-10
                    h-10
                    sm:w-12
                    sm:h-12
                    rounded-full
                    bg-white
                    text-[#111111]
                    font-black
                    text-xl sm:text-2xl
                    shadow-lg
                    hover:bg-gray-100
                    transition
                  "
                >
                  ×
                </button>
              </div>

              <div
                ref={passportRef}
                className="
                  overflow-hidden
                  rounded-2xl
                  sm:rounded-[32px]
                  border-2
                  border-[#C9A646]
                  bg-[#EFE8D8]
                  shadow-2xl
                  text-[#111111]
                "
              >
                <div className="
                  grid
                  grid-cols-1
                  lg:grid-cols-[0.8fr_1.2fr]
                  min-h-0
                  lg:min-h-[620px]
                ">
                  <div className="
                    bg-[#111111]
                    text-[#C9A646]
                    p-4
            sm:p-5
          sm:p-10
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    border-r
                    border-[#C9A646]
                  ">
                    <p className="
                      text-sm
                      uppercase
                      tracking-[0.35em]
                      mb-6
                      text-[#F5D77A]
                    ">
                      Федеральная Республика
                    </p>

                    <h2 className="
                      text-3xl sm:text-5xl
                      font-black
                      tracking-[0.2em]
                      mb-10
                    ">
                      НИЧЕГОНИЯ
                    </h2>

                    <div className="
                      w-28
                      h-28
                      sm:w-44
                      sm:h-44
                      rounded-full
                      border-4
                      border-[#C9A646]
                      flex
                      items-center
                      justify-center
                      text-5xl sm:text-7xl
                      font-black
                      mb-10
                      shadow-2xl
                    ">
                      Н
                    </div>

                    <p className="
                      text-3xl sm:text-5xl
                      font-black
                      tracking-[0.2em]
                      mb-4
                    ">
                      ПАСПОРТ
                    </p>

                    <p className="
                      text-base sm:text-lg
                      tracking-[0.25em]
                      uppercase
                      text-[#F5D77A]
                    ">
                      гражданина Ничегонии
                    </p>

                    <div className="
                      mt-10
                      border
                      border-[#C9A646]
                      rounded-full
                      px-4 sm:px-6
                      py-2
                      text-sm
                      tracking-[0.2em]
                    ">
                      Ничего. Но стабильно.
                    </div>
                  </div>

                  <div className="
                    bg-[#F8F3E8]
                    p-4
            sm:p-5
          sm:p-10
                    relative
                    overflow-hidden
                  ">
                    <div className="
                      absolute
                      right-10
                      top-10
                      hidden
                      sm:block
                      sm:text-[220px]
                      leading-none
                      font-black
                      text-[#111111]
                      opacity-5
                      pointer-events-none
                    ">
                      Н
                    </div>

                    <div className="
                      border-b
                      border-[#D8C8A8]
                      pb-6
                      mb-8
                    ">
                      <p className="
                        text-sm
                        uppercase
                        tracking-[0.35em]
                        text-gray-500
                        font-bold
                        mb-3
                      ">
                        Паспорт гражданина
                      </p>

                      <h3 className="
                        text-3xl sm:text-4xl
                        font-black
                        text-[#111111]
                      ">
                        Федерация Ничегонии
                      </h3>
                    </div>

                    <div className="
                      mb-8
                      flex
                      flex-col
                      md:flex-row
                      gap-8
                      items-start
                    ">
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-2">
                          Фото гражданина
                        </p>

                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Фото гражданина"
                            className="
                              w-[140px]
                              h-[175px]
                              sm:w-[170px]
                              sm:h-[210px]
                              rounded-2xl
                              object-cover
                              border
                              border-[#D8C8A8]
                              bg-[#E8DFCF]
                              shadow-lg
                            "
                          />
                        ) : (
                          <div className="
                            w-[140px]
                            h-[175px]
                            sm:w-[170px]
                            sm:h-[210px]
                            rounded-2xl
                            bg-[#E8DFCF]
                            border
                            border-[#D8C8A8]
                            flex
                            items-center
                            justify-center
                            text-3xl sm:text-5xl
                            font-black
                            text-[#111111]
                            shadow-lg
                          ">
                            {initials}
                          </div>
                        )}
                      </div>

                      <div className="
                        flex-1
                        bg-[#EFE8D8]
                        rounded-2xl
                        border
                        border-[#D8C8A8]
                        p-4
            sm:p-5
                      ">
                        <p className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          text-gray-500
                          font-bold
                          mb-3
                        ">
                          Данные владельца
                        </p>

                        <p className="text-base sm:text-lg font-semibold text-[#111111]">
                          Настоящий документ подтверждает статус гражданина
                          Федеральной Республики Ничегония.
                        </p>
                      </div>
                    </div>

                    <div className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-x-10
                      gap-y-7
                    ">
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          ФИО
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#111111]">
                          {application.full_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          Гражданство
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#111111]">
                          Ничегошка
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          Номер паспорта
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#111111]">
                          {passportNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          Дата выдачи
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#111111]">
                          {issueDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          Страна проживания
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-[#111111]">
                          {application.country}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                          Статус
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-green-700">
                          Активный ничегошка
                        </p>
                      </div>
                    </div>

                    <div className="
                      mt-10
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-6
                      border-t
                      border-[#D8C8A8]
                      pt-8
                    ">
                      <div>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-2">
                          Орган выдачи
                        </p>
                        <p className="text-base sm:text-lg font-black text-[#111111]">
                          Администрация Президента Ничегонии
                        </p>
                      </div>

                      <div className="
                        flex
                        items-center
                        justify-start
                        md:justify-end
                      ">
                        <div className="
                          rotate-[-8deg]
                          border-4
                          border-blue-700
                          text-blue-700
                          px-4 sm:px-6
                          py-3
                          rounded-md
                          font-black
                          uppercase
                          text-xl
                        ">
                          Одобрено
                        </div>
                      </div>
                    </div>

                    <div className="
  mt-10
  bg-white
  rounded-2xl
  border
  border-[#D8C8A8]
  p-5
  flex
  flex-col
  sm:flex-row
  sm:items-center
  gap-4
  sm:gap-5
">
  <div className="
    bg-white
    p-3
    rounded-xl
    border
    border-[#D8C8A8]
  ">
    <QRCodeSVG
      value={verifyUrl}
      size={120}
      bgColor="#ffffff"
      fgColor="#111111"
      level="M"
    />
  </div>

  <div>
    <p className="
      text-xs
      uppercase
      tracking-[0.25em]
      text-gray-500
      font-bold
      mb-2
    ">
      Проверка паспорта
    </p>

    <p className="text-base sm:text-lg font-black text-[#111111]">
      Отсканируйте QR-код
    </p>

    <p className="text-sm text-gray-600 break-all mt-2">
      {verifyUrl}
    </p>
  </div>
</div>

                    <div className="
                      mt-10
                      bg-[#EFE8D8]
                      rounded-2xl
                      border
                      border-[#D8C8A8]
                      p-4
            sm:p-6
                    ">
                      <p className="
                        text-sm
                        uppercase
                        tracking-[0.25em]
                        text-gray-500
                        font-bold
                        mb-4
                      ">
                        Права гражданина Ничегонии
                      </p>

                      <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-3
                        text-[#111111]
                        font-semibold
                      ">
                        <p>✓ Имеет право на отдых</p>
                        <p>✓ Может пользоваться Ничегометром</p>
                        <p>✓ Может откладывать дела на потом</p>
                        <p>✓ Считается ничегошкой</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="
      min-h-[100dvh]
      bg-[#F7F6F3]
      flex
      items-center
      justify-center
      px-4 sm:px-6
      text-[#111111]
    ">
      <div className="
        bg-white
        max-w-md
        w-full
        rounded-3xl
        shadow-2xl
        p-5
        sm:p-10
        border
        border-gray-200
      ">
        <h1 className="
          text-3xl sm:text-4xl
          font-black
          text-center
          mb-8
          text-[#111111]
        ">
          Личный кабинет
        </h1>

        <label className="
          block
          mb-2
          font-semibold
          text-[#111111]
        ">
          Номер заявки
        </label>

        <input
          type="text"
          placeholder="Например: НЧ-000001"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          className="
            w-full
            border-2
            border-gray-300
            rounded-xl
            p-4
            mb-5
            bg-white
            text-[#111111]
            placeholder:text-gray-400
            outline-none
            focus:border-[#111111]
          "
        />

        <label className="
          block
          mb-2
          font-semibold
          text-[#111111]
        ">
          Код доступа
        </label>

        <input
          type="text"
          placeholder="Например: A7K9P2"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="
            w-full
            border-2
            border-gray-300
            rounded-xl
            p-4
            mb-6
            bg-white
            text-[#111111]
            placeholder:text-gray-400
            outline-none
            focus:border-[#111111]
          "
        />

        {error && (
          <div className="
            bg-red-50
            border
            border-red-300
            text-red-700
            rounded-xl
            p-4
            mb-5
            text-center
            font-semibold
          ">
            {error}
          </div>
        )}

        <button
          onClick={() => login()}
          className="
            w-full
            bg-[#111111]
            text-white
            py-4
            rounded-xl
            font-bold
            hover:opacity-90
            transition
          "
        >
          Войти
        </button>

        <a
          href="/"
          className="
            block
            text-center
            mt-5
            text-gray-600
            hover:text-[#111111]
            transition
          "
        >
          Вернуться на главную
        </a>
      </div>
    </main>
  );
}
