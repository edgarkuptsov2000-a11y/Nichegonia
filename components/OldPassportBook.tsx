"use client";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  application: any;
  passportNumber: string;
  issueDate: string;
  isFirstUnionCitizen: boolean;
};

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

      <div
        className="
          bg-[#111111]
          rounded-[30px]
          text-[#d4af37]
          p-10
          flex
          flex-col
          justify-between
        "
      >
        <div>
          <p className="text-center text-xl">
            ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
          </p>

          <h1 className="text-center text-5xl font-black mt-4">
            НИЧЕГОНИЯ
          </h1>
        </div>

        <div className="text-center text-8xl">
          Н
        </div>

        <div>
          <h2 className="text-center text-5xl font-black">
            ПАСПОРТ
          </h2>

          <p className="text-center text-2xl mt-4">
            ГРАЖДАНИНА НИЧЕГОНИИ
          </p>
        </div>
      </div>

      {/* СТРАНИЦА 2 */}

      <div
        className="
          bg-[#f8f3e8]
          rounded-[30px]
          p-10
        "
      >
        <h2 className="text-5xl font-black">
          ПАСПОРТ
        </h2>

        <p className="text-xl">
          ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ
        </p>

        <div className="mt-14 space-y-6 text-2xl">
          <p>
            Тип документа:
            <br />
            Паспорт гражданина
          </p>

          <p>
            Серия:
            <br />
            НЧ
          </p>

          <p>
            Номер:
            <br />
            {passportNumber}
          </p>

          <p>
            Дата выдачи:
            <br />
            {issueDate}
          </p>

          <p>
            Орган выдачи:
            <br />
            Администрация Президента Ничегонии
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