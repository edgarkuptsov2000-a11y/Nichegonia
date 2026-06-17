"use client";

import { forwardRef } from "react";
import { FIRST_UNION_TITLE, isFirstUnionNumber } from "@/lib/first-union";

type Application = {
  full_name: string;
  country: string;
  application_number: string;
  status: string;
  approved_at?: string | null;
  photo_url?: string | null;
};

type FullPassportProps = {
  application: Application;
  passportNumber: string;
  issueDate: string;
};

const FullPassport = forwardRef<HTMLDivElement, FullPassportProps>(
  function FullPassport({ application, passportNumber, issueDate }, ref) {
    const nameParts = application.full_name.trim().split(" ");
    const surname = nameParts[0] || application.full_name;
    const firstName = nameParts.slice(1).join(" ") || "Гражданин";

    const initials = application.full_name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const photoUrl = application.photo_url ?? "";
    const passportPrefix = passportNumber.split("-")[0] || "НЧ";
    const isFirstUnionCitizen = isFirstUnionNumber(passportNumber);

    return (
      <div ref={ref} className="w-full bg-[#111111] p-4 rounded-[36px] text-[#111111]">
        <div className="grid grid-cols-1 xl:grid-cols-[0.85fr_1fr_1.25fr] gap-4">
          <section className="min-h-[520px] rounded-[28px] bg-[#10151C] border border-[#C9A646] text-[#C9A646] p-10 flex flex-col items-center justify-center text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#F5D77A] mb-6">
              Федеральная Республика
            </p>

            <h2 className="text-5xl font-black tracking-[0.18em] mb-10">
              НИЧЕГОНИЯ
            </h2>

            <div className="w-44 h-44 rounded-full border-4 border-[#C9A646] flex items-center justify-center text-7xl font-black mb-10">
              Н
            </div>

            <p className="text-5xl font-black tracking-[0.16em] mb-4">
              ПАСПОРТ
            </p>

            <p className="text-lg uppercase tracking-[0.25em] text-[#F5D77A]">
              гражданина Ничегонии
            </p>

            <div className="mt-10 border border-[#C9A646] rounded-full px-6 py-2 text-sm tracking-[0.18em]">
              Ничего. Но стабильно.
            </div>
          </section>

          <section className="min-h-[520px] rounded-[28px] bg-[#F4EBDD] border border-[#D8C8A8] p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,#111111_1px,transparent_1px)] bg-[length:12px_12px]" />

            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500 font-bold text-center">
                Паспорт
              </p>

              <h3 className="text-4xl font-black text-center tracking-[0.15em] mt-2 mb-10">
                НИЧЕГОНИЯ
              </h3>

              <div className="w-40 h-40 rounded-full border-4 border-[#C9A646] mx-auto flex items-center justify-center text-6xl font-black text-[#111111] opacity-70 mb-10">
                Н
              </div>

              <div className="space-y-6 text-lg">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Тип документа
                  </p>
                  <p className="font-black">Паспорт гражданина</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Серия
                  </p>
                  <p className="font-black">{passportPrefix}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Номер
                  </p>
                  <p className="text-2xl font-black">{passportNumber}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Дата выдачи
                  </p>
                  <p className="font-black">{issueDate}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Орган выдачи
                  </p>
                  <p className="font-black">Министерство Ничего</p>
                </div>
              </div>

              <div className="mt-10 border-4 border-blue-700 text-blue-700 inline-block px-6 py-3 rotate-[-8deg] font-black uppercase text-xl">
                Одобрено
              </div>
            </div>
          </section>

          <section className="min-h-[520px] rounded-[28px] bg-[#F8F3E8] border border-[#D8C8A8] p-10 relative overflow-hidden">
            <div className="absolute right-10 top-10 text-[220px] leading-none font-black text-[#111111] opacity-5 pointer-events-none">
              Н
            </div>

            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500 font-bold mb-3">
                Данные гражданина
              </p>

              <h3 className="text-4xl font-black mb-8">
                Личное дело
              </h3>

              {isFirstUnionCitizen && (
                <div className="mb-8 rounded-2xl border-2 border-[#C9A646] bg-[#FFF7D6] p-5 text-center shadow-lg">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#7A5C12] font-black mb-2">
                    Почётный статус
                  </p>
                  <p className="text-2xl font-black text-[#111111]">
                    👑 {FIRST_UNION_TITLE}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-[1fr_170px] gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Фамилия</p>
                    <p className="text-2xl font-black">{surname}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Имя</p>
                    <p className="text-2xl font-black">{firstName}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Гражданство</p>
                    <p className="text-2xl font-black">{isFirstUnionCitizen ? FIRST_UNION_TITLE : "Ничегошка"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Место проживания</p>
                    <p className="text-2xl font-black">{application.country}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Статус</p>
                    <p className={`text-2xl font-black ${isFirstUnionCitizen ? "text-[#7A5C12]" : "text-green-700"}`}>
                      {isFirstUnionCitizen ? `👑 ${FIRST_UNION_TITLE}` : "Активный ничегошка"}
                    </p>
                  </div>
                </div>

                <div>
                  {photoUrl ? (
                    <img
  src={photoUrl}
  alt="Фото гражданина"
  className="
    w-[160px]
    aspect-[3/4]
    object-cover
    object-center
    rounded-xl
    border
    border-[#D8C8A8]
    bg-[#E8DFCF]
  "
/>
                  ) : (
                    <div className="
  w-[160px]
  aspect-[3/4]
  rounded-xl
  bg-[#E8DFCF]
  border
  border-[#D8C8A8]
  flex
  items-center
  justify-center
  text-5xl
  font-black
  text-[#111111]
">
  {initials}
</div>
                  )}

                  <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-500 mt-4 font-bold">
                    Фото гражданина
                  </p>
                </div>
              </div>

              <div className="mt-10 border-t border-[#D8C8A8] pt-6 flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-bold">Подпись владельца</p>
                  <p className="text-3xl italic mt-2 border-b border-[#111111] px-6 pb-1">
                    {surname} {firstName[0]}.
                  </p>
                </div>

                <div className="w-24 h-24 rounded-full border-2 border-[#C9A646] flex items-center justify-center font-black text-[#C9A646]">
                  {passportPrefix}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4 mt-4">
          <section className="rounded-[28px] bg-[#F8F3E8] border border-[#D8C8A8] p-10 min-h-[360px]">
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] mb-8">
              Особые отметки
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-lg font-semibold">
                <p>✓ Имеет право на отдых</p>
                <p>✓ Ознакомлен с Конституцией Ничегонии</p>
                <p>✓ Может пользоваться Ничегометром</p>
                <p>✓ Считается ничегошкой на территории Ничегонии</p>
                <p>✓ Разрешено откладывать дела на потом</p>
                {isFirstUnionCitizen && <p>✓ Внесён в список Ничегошек Первого Союза</p>}
              </div>

              <div className="flex items-center justify-center">
                <div className="border-4 border-blue-700 text-blue-700 rounded-xl px-10 py-6 rotate-[-6deg] text-center font-black uppercase text-2xl">
                  Одобрено
                  <br />
                  <span className="text-sm">Ничегометр всегда прав</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#F8F3E8] border border-[#D8C8A8] p-10 min-h-[360px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] mb-6">
                  Права гражданина
                </h3>

                <div className="space-y-4 text-lg font-semibold">
                  <p>• отдыхать</p>
                  <p>• откладывать дела на потом</p>
                  <p>• пользоваться Ничегометром</p>
                  <p>• праздновать День основания Ничегонии</p>
                  <p>• ссылаться на Конституцию в споре</p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#D8C8A8] bg-[#EFE8D8] p-6 flex flex-col items-center justify-center text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">
                  Ничегония
                </p>

                <div className="w-full h-40 rounded-[45%_55%_50%_50%] border-4 border-dashed border-[#111111] flex items-center justify-center relative">
                  <div className="w-8 h-8 rounded-full bg-[#C9A646]" />

                  <span className="absolute left-8 top-8 text-xs font-black">
                    столица
                  </span>

                  <span className="absolute right-8 bottom-8 text-xs font-black">
                    лень-поле
                  </span>
                </div>

                <p className="mt-6 text-2xl font-black tracking-[0.25em] text-[#9A3B2F]">
                  {passportNumber}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
);

export default FullPassport;
