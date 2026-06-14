"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Citizen = {
  id?: number | string | null;
  full_name?: string | null;
  country?: string | null;
  application_number?: string | null;
  status?: string | null;
  approved_at?: string | null;
  photo_url?: string | null;
};

export default function RegistryPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCitizens();
  }, []);

  async function loadCitizens() {
    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("id, full_name, country, application_number, status, approved_at, photo_url")
      .eq("status", "Одобрено")
      .order("approved_at", { ascending: false });

    if (error) {
      console.log("REGISTRY LOAD ERROR:", error);
      setCitizens([]);
    } else {
      setCitizens(data || []);
    }

    setLoading(false);
  }

  const filteredCitizens = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return citizens;
    }

    return citizens.filter((citizen) => {
      const fullName = citizen.full_name || "";
      const country = citizen.country || "";
      const applicationNumber = citizen.application_number || "";

      return (
        fullName.toLowerCase().includes(value) ||
        country.toLowerCase().includes(value) ||
        applicationNumber.toLowerCase().includes(value)
      );
    });
  }, [citizens, search]);

  return (
    <main className="
      min-h-screen
      bg-[#F7F6F3]
      px-6
      py-10
      text-[#111111]
    ">
      <div className="
        max-w-6xl
        mx-auto
      ">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          border
          border-gray-200
          p-8
          mb-8
        ">
          <div className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-6
          ">
            <div>
              <p className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-gray-500
                font-bold
                mb-3
              ">
                Федеральная Республика
              </p>

              <h1 className="
                text-4xl
                md:text-5xl
                font-black
                mb-3
              ">
                Реестр граждан Ничегонии
              </h1>

              <p className="text-gray-600 text-lg">
                Официальный список одобренных ничегошек.
              </p>
            </div>

            <a
              href="/"
              className="
                bg-[#111111]
                text-white
                px-6
                py-4
                rounded-xl
                font-black
                hover:opacity-90
                transition
                text-center
              "
            >
              На главную
            </a>
          </div>
        </div>

        <div className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-200
          p-6
          mb-8
        ">
          <label className="
            block
            mb-2
            font-bold
            text-gray-700
          ">
            Поиск по реестру
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите имя, страну или номер паспорта"
            className="
              w-full
              border-2
              border-gray-300
              rounded-xl
              p-4
              bg-white
              text-[#111111]
              placeholder:text-gray-400
              outline-none
              focus:border-[#111111]
            "
          />
        </div>

        {loading && (
          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-10
            text-center
          ">
            <p className="text-2xl font-black">
              Загружаем реестр...
            </p>
          </div>
        )}

        {!loading && filteredCitizens.length === 0 && (
          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-10
            text-center
          ">
            <div className="text-6xl mb-4">
              💤
            </div>

            <h2 className="
              text-3xl
              font-black
              mb-3
            ">
              Никого не найдено
            </h2>

            <p className="text-gray-600">
              В реестре пока нет подходящих граждан.
            </p>
          </div>
        )}

        {!loading && filteredCitizens.length > 0 && (
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          ">
            {filteredCitizens.map((citizen, index) => {
              const fullName = citizen.full_name || "Без имени";
              const country = citizen.country || "Не указана";
              const applicationNumber =
                citizen.application_number || "Без номера";

              const issueDate = citizen.approved_at
                ? new Date(citizen.approved_at).toLocaleDateString("ru-RU")
                : "Не указана";

              const initials = fullName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const verifyHref =
                citizen.application_number
                  ? `/verify?number=${encodeURIComponent(citizen.application_number)}`
                  : "#";

              return (
                <div
                  key={`${citizen.id ?? "no-id"}-${citizen.application_number ?? "no-number"}-${index}`}
                  className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    border
                    border-gray-200
                    p-6
                    hover:shadow-2xl
                    transition
                  "
                >
                  <div className="
                    flex
                    items-center
                    gap-4
                    mb-5
                  ">
                    {citizen.photo_url ? (
                      <img
                        src={citizen.photo_url}
                        alt="Фото гражданина"
                        className="
                          w-20
                          h-20
                          rounded-2xl
                          object-cover
                          border-2
                          border-[#C9A646]
                        "
                      />
                    ) : (
                      <div className="
                        w-20
                        h-20
                        rounded-2xl
                        bg-[#EFE8D8]
                        border-2
                        border-[#C9A646]
                        flex
                        items-center
                        justify-center
                        font-black
                        text-2xl
                      ">
                        {initials || "Н"}
                      </div>
                    )}

                    <div>
                      <p className="
                        text-xl
                        font-black
                        leading-tight
                      ">
                        {fullName}
                      </p>

                      <p className="text-gray-500 font-semibold">
                        {country}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="
                      bg-[#F7F6F3]
                      rounded-xl
                      p-4
                      border
                      border-gray-200
                    ">
                      <p className="text-gray-500 text-xs mb-1">
                        Номер паспорта
                      </p>

                      <p className="font-black text-lg">
                        {applicationNumber}
                      </p>
                    </div>

                    <div className="
                      bg-[#F7F6F3]
                      rounded-xl
                      p-4
                      border
                      border-gray-200
                    ">
                      <p className="text-gray-500 text-xs mb-1">
                        Дата выдачи
                      </p>

                      <p className="font-black text-lg">
                        {issueDate}
                      </p>
                    </div>

                    <div className="
                      bg-green-50
                      rounded-xl
                      p-4
                      border
                      border-green-200
                    ">
                      <p className="text-green-700 text-xs mb-1">
                        Статус
                      </p>

                      <p className="font-black text-green-800 text-lg">
                        🟢 Одобрено
                      </p>
                    </div>
                  </div>

                  {citizen.application_number ? (
                    <a
                      href={verifyHref}
                      className="
                        block
                        mt-5
                        w-full
                        bg-[#111111]
                        text-white
                        py-4
                        rounded-xl
                        font-black
                        text-center
                        hover:opacity-90
                        transition
                      "
                    >
                      Проверить паспорт
                    </a>
                  ) : (
                    <button
                      disabled
                      className="
                        block
                        mt-5
                        w-full
                        bg-gray-300
                        text-gray-600
                        py-4
                        rounded-xl
                        font-black
                        text-center
                        cursor-not-allowed
                      "
                    >
                      Нет номера паспорта
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
