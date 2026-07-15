"use client";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  application: any;
  passportNumber: string;
  issueDate: string;
  isFirstUnionCitizen: boolean;
};

function PassportPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative
        bg-[#f6f0e3]
        rounded-[24px]
        overflow-hidden
        shadow-xl
        border
        border-[#d6c8a8]
        p-10
        min-h-[760px]
      "
    >
      {/* Водяной знак */}
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          opacity-[0.05]
          text-[170px]
          font-black
          text-[#b18b28]
          rotate-[-25deg]
        "
      >
        НИЧЕГОНИЯ
      </div>

      {children}
    </div>
  );
}

export default function PassportBook({
  application,
  passportNumber,
  issueDate,
  isFirstUnionCitizen
}: Props) {
  return (
    <div
      id="passport-book"
      className="
        w-[1600px]
        bg-[#efe9df]
        p-8
        grid
        grid-cols-4
        gap-6
      "
    >
      {/* ОБЛОЖКА */}

      {/* ================= ОБЛОЖКА ================= */}

<div
  className="
    relative
    overflow-hidden
    rounded-[34px]
    bg-[#171717]
    border
    border-[#6b5314]
    shadow-[0_20px_70px_rgba(0,0,0,.45)]
    p-12
    flex
    flex-col
    justify-between
    min-h-[900px]
  "
>

  {/* золотая рамка */}

  <div className="absolute inset-6 rounded-[22px] border border-[#b99128]/70"></div>

  <div className="absolute inset-10 rounded-[18px] border border-[#8d6a15]/40"></div>

  {/* декоративные уголки */}

  <div className="absolute top-10 left-10 text-[#c9a646] text-3xl">✦</div>
  <div className="absolute top-10 right-10 text-[#c9a646] text-3xl">✦</div>
  <div className="absolute bottom-10 left-10 text-[#c9a646] text-3xl">✦</div>
  <div className="absolute bottom-10 right-10 text-[#c9a646] text-3xl">✦</div>

  <div className="relative text-center">

    <div className="text-[90px] mb-8">
      🛡️
    </div>

    <p className="tracking-[8px] text-[#c9a646] text-xl font-semibold">
      ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
    </p>

    <h1 className="mt-5 text-[58px] font-black tracking-[4px] text-[#d4af37]">
      НИЧЕГОНИЯ
    </h1>

  </div>

  <div className="relative text-center">

    <div className="h-px bg-[#b99128] mb-8"></div>

    <h2 className="text-[64px] font-black tracking-[10px] text-[#d4af37]">
      ПАСПОРТ
    </h2>

    <p className="mt-5 text-[24px] tracking-[5px] text-[#c9a646]">
      ГРАЖДАНИНА ФЕДЕРАЛЬНОЙ
      РЕСПУБЛИКИ НИЧЕГОНИЯ
    </p>

    <div className="h-px bg-[#b99128] mt-8"></div>

  </div>

  <div className="relative text-center">

    <p className="text-[#8b6b1b] text-lg uppercase tracking-[6px]">
      Passport №
    </p>

    <p className="mt-3 text-[42px] font-black tracking-[6px] text-[#d4af37]">
      {passportNumber}
    </p>

  </div>

</div>

      {/* СТРАНИЦА 2 */}

      {/* ================= СТРАНИЦА 2 ================= */}

  
<div
  className="
    relative
    overflow-hidden
    rounded-[34px]
    bg-[#f9f3e8]
    border
    border-[#d9c7a5]
    p-12
    min-h-[900px]
    flex
    flex-col
  "
>

  {/* декоративный фон */}

  <div className="absolute inset-0 opacity-[0.04]">
    <div className="w-full h-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] bg-[length:24px_24px]" />
  </div>

  <div className="relative">

    <p className="text-sm tracking-[8px] text-gray-500 uppercase">
      Федеральная Республика
    </p>

    <h2 className="text-5xl font-black mt-3">
      НИЧЕГОНИЯ
    </h2>

    <div className="mt-8 h-[2px] bg-[#c9a646]" />

    <h3 className="mt-10 text-3xl font-black">
      Паспорт гражданина
    </h3>

    <div className="mt-12 space-y-7 text-xl">

      <div>
        <p className="text-gray-500 uppercase text-sm">
          Тип документа
        </p>

        <p className="font-bold">
          Passport
        </p>
      </div>

      <div>
        <p className="text-gray-500 uppercase text-sm">
          Серия
        </p>

        <p className="font-bold">
          ПС
        </p>
      </div>

      <div>
        <p className="text-gray-500 uppercase text-sm">
          Номер документа
        </p>

        <p className="font-black text-3xl tracking-[3px]">
          {passportNumber}
        </p>
      </div>

      <div>
        <p className="text-gray-500 uppercase text-sm">
          Дата выдачи
        </p>

        <p className="font-bold">
          {issueDate}
        </p>
      </div>

      <div>
        <p className="text-gray-500 uppercase text-sm">
          Орган выдачи
        </p>

        <p className="font-bold leading-8">
          Администрация Президента
          <br />
          Федеральной Республики
          <br />
          Ничегония
        </p>
      </div>

    </div>

  </div>

  <div className="mt-auto">

    <div className="h-[1px] bg-[#c9a646] mb-6" />

    <p className="text-gray-500 text-sm">
      Документ является собственностью
      Федеральной Республики Ничегония.
    </p>

  </div>

</div>

      {/* СТРАНИЦА 3 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
          flex
          justify-between
        "
      >
        <div className="space-y-8 text-2xl">
          <div>
            <p>ФИО</p>

            <h2 className="font-black">
              {application.full_name}
            </h2>
          </div>

          <div>
            <p>Гражданство</p>

            <h2 className="font-black">
              {isFirstUnionCitizen
                ? "Первый Союз"
                : "Ничегошка"}
            </h2>
          </div>

          <div>
            <p>Страна</p>

            <h2 className="font-black">
              {application.country}
            </h2>
          </div>

          <div>
            <p>Статус</p>

            <h2 className="font-black">
              Активный ничегошка
            </h2>
          </div>
        </div>

        <div>
          {application.photo_url ? (
            <img
              src={application.photo_url}
              className="
                w-[260px]
                h-[340px]
                object-cover
                rounded-xl
                border
              "
            />
          ) : (
            <div
              className="
                w-[260px]
                h-[340px]
                border
                rounded-xl
                flex
                items-center
                justify-center
              "
            >
              Нет фото
            </div>
          )}
        </div>
      </div>

      {/* СТРАНИЦА 4 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
          flex
          flex-col
          items-center
        "
      >
        <h2 className="text-5xl font-black">
          QR
        </h2>

        <QRCodeSVG
  value={`https://nichegonia.com/verify?number=${passportNumber}`}
  size={250}
/>

        <p className="text-2xl mt-8">
          Проверка паспорта
        </p>
      </div>

      {/* СТРАНИЦА 5 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
        "
      >
        <h2 className="text-4xl font-black">
          Особые отметки
        </h2>

        <div className="space-y-6 mt-12 text-2xl">
          <p>✓ Имеет право на отдых</p>
          <p>✓ Может пользоваться Ничегометром</p>
          <p>✓ Может откладывать дела на потом</p>
          <p>✓ Считается ничегошкой</p>

          {isFirstUnionCitizen && (
            <p>
              ✓ Входит в Первый Союз
            </p>
          )}
        </div>
      </div>

      {/* СТРАНИЦА 6 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
        "
      >
        <h2 className="text-4xl font-black">
          Права гражданина
        </h2>

        <div className="space-y-6 mt-12 text-2xl">
          <p>✓ Отдыхать</p>
          <p>✓ Откладывать дела на потом</p>
          <p>✓ Пользоваться Ничегометром</p>
          <p>✓ Праздновать День Ничегонии</p>
          <p>✓ Ссылаться на Конституцию</p>
        </div>
      </div>

      {/* СТРАНИЦА 7 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <h2 className="text-5xl font-black">
          НИЧЕГОНИЯ
        </h2>

        <p className="text-2xl mt-4">
          Страна, где главное — ничего.
        </p>

        <p className="text-3xl mt-16 font-black">
          {passportNumber}
        </p>
      </div>
    </div>
  );
}