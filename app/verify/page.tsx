"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FIRST_UNION_TITLE, getCitizenDisplayStatus, isFirstUnionNumber } from "@/lib/first-union";

type PassportRecord = {
  full_name: string;
  country: string;
  passport_number: string;
  status: string;
  approved_at?: string | null;
  photo_url?: string | null;
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const number = searchParams.get("number") || "";

  const [passport, setPassport] = useState<PassportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function checkPassport() {
      const normalizedNumber = number.trim();

      if (!normalizedNumber) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      const { data: citizen, error: citizenError } = await supabase
        .from("citizens")
        .select("application_id, full_name, country, citizen_number, status")
        .eq("citizen_number", normalizedNumber)
        .maybeSingle();

      if (!citizenError && citizen) {
        let approvedAt: string | null = null;
        let photoUrl: string | null = null;
        let applicationStatus: string | null = null;

        if (citizen.application_id) {
          const { data: application } = await supabase
            .from("applications")
            .select("approved_at, photo_url, status")
            .eq("id", citizen.application_id)
            .maybeSingle();

          approvedAt = application?.approved_at || null;
          photoUrl = application?.photo_url || null;
          applicationStatus = application?.status || null;
        }

        setPassport({
          full_name: citizen.full_name,
          country: citizen.country,
          passport_number: citizen.citizen_number,
          status: applicationStatus || citizen.status || "Одобрено",
          approved_at: approvedAt,
          photo_url: photoUrl
        });
        setNotFound(false);
        setLoading(false);
        return;
      }

      const { data: application, error: applicationError } = await supabase
        .from("applications")
        .select("full_name, country, application_number, status, approved_at, photo_url")
        .eq("application_number", normalizedNumber)
        .eq("status", "Одобрено")
        .maybeSingle();

      if (applicationError || !application) {
        setPassport(null);
        setNotFound(true);
      } else {
        setPassport({
          full_name: application.full_name,
          country: application.country,
          passport_number: application.application_number,
          status: application.status,
          approved_at: application.approved_at,
          photo_url: application.photo_url
        });
        setNotFound(false);
      }

      setLoading(false);
    }

    checkPassport();
  }, [number]);

  if (loading) {
    return (
      <main className="
        min-h-screen
        bg-[#F7F6F3]
        flex
        items-center
        justify-center
        px-6
        text-[#111111]
      ">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-10
          border
          border-gray-200
          text-center
        ">
          <p className="text-2xl font-black">
            Проверяем паспорт...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !passport) {
    return (
      <main className="
        min-h-screen
        bg-[#F7F6F3]
        flex
        items-center
        justify-center
        px-6
        text-[#111111]
      ">
        <div className="
          bg-white
          max-w-xl
          w-full
          rounded-3xl
          shadow-2xl
          p-10
          border
          border-red-200
          text-center
        ">
          <div className="text-6xl mb-6">
            ❌
          </div>

          <h1 className="
            text-4xl
            font-black
            mb-4
            text-red-700
          ">
            Паспорт не найден
          </h1>

          <p className="text-gray-600 text-lg">
            В реестре Ничегонии нет паспорта с таким номером.
          </p>

          <p className="
            mt-6
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-4
            font-black
            text-red-700
          ">
            {number || "Номер не указан"}
          </p>
        </div>
      </main>
    );
  }

  const isApproved = passport.status === "Одобрено" || passport.status === "active";
  const isFirstUnionCitizen = isFirstUnionNumber(passport.passport_number);
  const citizenDisplayStatus = getCitizenDisplayStatus(passport.passport_number);

  const issueDate = passport.approved_at
    ? new Date(passport.approved_at).toLocaleDateString("ru-RU")
    : "Не указана";

  return (
    <main className="
      min-h-screen
      bg-[#F7F6F3]
      flex
      items-center
      justify-center
      px-6
      py-10
      text-[#111111]
    ">
      <div className="
        bg-white
        max-w-2xl
        w-full
        rounded-3xl
        shadow-2xl
        p-10
        border
        border-gray-200
      ">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">
            {isApproved ? "✅" : "⚠️"}
          </div>

          <h1 className="
            text-4xl
            font-black
            mb-3
          ">
            {isApproved ? "Паспорт действителен" : "Паспорт не активен"}
          </h1>

          <p className="text-gray-600 text-lg">
            Федеральная Республика Ничегония
          </p>

          {isFirstUnionCitizen && (
            <div className="
              mt-6
              inline-flex
              flex-col
              items-center
              rounded-3xl
              border-2
              border-[#C9A646]
              bg-gradient-to-br
              from-[#FFF7D6]
              via-[#F6E7A9]
              to-[#E7C85D]
              px-6
              py-4
              shadow-xl
            ">
              <span className="text-xs uppercase tracking-[0.3em] text-[#7A5C12] font-black mb-1">
                Почётный статус
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#111111]">
                👑 {FIRST_UNION_TITLE}
              </span>
            </div>
          )}
        </div>

        {passport.photo_url && (
          <div className="flex justify-center mb-8">
            <img
              src={passport.photo_url}
              alt="Фото гражданина"
              className="
                w-40
                h-40
                rounded-2xl
                object-cover
                border-4
                border-[#C9A646]
                shadow-lg
              "
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="
            bg-[#F7F6F3]
            rounded-2xl
            p-5
            border
            border-gray-200
          ">
            <p className="text-gray-500 text-sm mb-1">
              Гражданин
            </p>

            <p className="text-2xl font-black">
              {passport.full_name}
            </p>
          </div>

          <div className="
            bg-[#F7F6F3]
            rounded-2xl
            p-5
            border
            border-gray-200
          ">
            <p className="text-gray-500 text-sm mb-1">
              Номер паспорта
            </p>

            <p className="text-2xl font-black">
              {passport.passport_number}
            </p>
          </div>

          <div className={`
            rounded-2xl
            p-5
            border
            ${
              isFirstUnionCitizen
                ? "bg-[#FFF7D6] border-[#C9A646]"
                : "bg-[#F7F6F3] border-gray-200"
            }
          `}>
            <p className={`text-sm mb-1 ${isFirstUnionCitizen ? "text-[#7A5C12]" : "text-gray-500"}`}>
              Почётный статус
            </p>

            <p className={`text-2xl font-black ${isFirstUnionCitizen ? "text-[#7A5C12]" : "text-[#111111]"}`}>
              {isFirstUnionCitizen ? `👑 ${citizenDisplayStatus}` : citizenDisplayStatus}
            </p>
          </div>

          <div className="
            bg-[#F7F6F3]
            rounded-2xl
            p-5
            border
            border-gray-200
          ">
            <p className="text-gray-500 text-sm mb-1">
              Страна проживания
            </p>

            <p className="text-2xl font-black">
              {passport.country}
            </p>
          </div>

          <div className="
            bg-[#F7F6F3]
            rounded-2xl
            p-5
            border
            border-gray-200
          ">
            <p className="text-gray-500 text-sm mb-1">
              Дата выдачи
            </p>

            <p className="text-2xl font-black">
              {issueDate}
            </p>
          </div>

          <div className={`
            rounded-2xl
            p-5
            border
            ${
              isApproved
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }
          `}>
            <p className={`
              text-sm
              mb-1
              ${
                isApproved ? "text-green-700" : "text-yellow-700"
              }
            `}>
              Статус
            </p>

            <p className={`
              text-2xl
              font-black
              ${
                isApproved ? "text-green-800" : "text-yellow-800"
              }
            `}>
              {isFirstUnionCitizen && isApproved
                ? `👑 ${FIRST_UNION_TITLE}`
                : isApproved
                  ? "🟢 Одобрено"
                  : passport.status}
            </p>
          </div>
        </div>

        <div className="
          mt-8
          bg-[#111111]
          text-white
          rounded-2xl
          p-6
          text-center
        ">
          <p className="font-black text-xl mb-2">
            Проверено реестром Ничегонии
          </p>

          <p className="text-gray-300">
            Ничего. Но официально.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="
        min-h-screen
        bg-[#F7F6F3]
        flex
        items-center
        justify-center
        text-[#111111]
      ">
        <p className="text-2xl font-black">
          Загрузка проверки...
        </p>
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
}
