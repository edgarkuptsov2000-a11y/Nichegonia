"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Application = {
  full_name: string;
  country: string;
  application_number: string;
  status: string;
  approved_at?: string | null;
  photo_url?: string | null;
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const number = searchParams.get("number") || "";

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function checkPassport() {
      if (!number) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select("full_name, country, application_number, status, approved_at, photo_url")
        .eq("application_number", number)
        .single();

      if (error || !data) {
        setApplication(null);
        setNotFound(true);
      } else {
        setApplication(data);
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

  if (notFound || !application) {
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

  const isApproved = application.status === "Одобрено";

  const issueDate = application.approved_at
    ? new Date(application.approved_at).toLocaleDateString("ru-RU")
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
        </div>

        {application.photo_url && (
          <div className="flex justify-center mb-8">
            <img
              src={application.photo_url}
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
              {application.full_name}
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
              {application.application_number}
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
              {application.country}
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
              {isApproved ? "🟢 Одобрено" : application.status}
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