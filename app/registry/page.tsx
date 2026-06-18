"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FIRST_UNION_TITLE, isFirstUnionNumber } from "@/lib/first-union";

type Citizen = {
  id?: number | string | null;
  application_id?: number | string | null;
  full_name?: string | null;
  country?: string | null;
  citizen_number?: string | null;
  status?: string | null;
  title?: string | null;
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

    const { data: citizenRows, error: citizensError } = await supabase
      .from("citizens")
      .select("id, application_id, full_name, country, citizen_number, status, title")
      .eq("status", "active")
      .order("id", { ascending: false });

    if (citizensError) {
      console.log("REGISTRY LOAD ERROR:", citizensError);
      setCitizens([]);
      setLoading(false);
      return;
    }

    const applicationIds = Array.from(
      new Set(
        (citizenRows || [])
          .map((citizen) => citizen.application_id)
          .filter(Boolean)
      )
    );

    let applicationsById = new Map<number | string, any>();

    if (applicationIds.length > 0) {
      const { data: applications, error: applicationsError } = await supabase
        .from("applications")
        .select("id, approved_at, photo_url")
        .in("id", applicationIds);

      if (applicationsError) {
        console.log("REGISTRY APPLICATIONS LOAD ERROR:", applicationsError);
      } else {
        applicationsById = new Map(
          (applications || []).map((application) => [application.id, application])
        );
      }
    }

    const normalizedCitizens = (citizenRows || []).map((citizen) => {
      const application = citizen.application_id ? applicationsById.get(citizen.application_id) : null;

      return {
        ...citizen,
        approved_at: application?.approved_at || null,
        photo_url: application?.photo_url || null
      };
    });

    setCitizens(normalizedCitizens);
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
      const passportNumber = citizen.citizen_number || "";
      const displayStatus = isFirstUnionNumber(passportNumber) ? FIRST_UNION_TITLE : "Ничегошка";

      return (
        fullName.toLowerCase().includes(value) ||
        country.toLowerCase().includes(value) ||
        passportNumber.toLowerCase().includes(value) ||
        displayStatus.toLowerCase().includes(value)
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
              const passportNumber =
                citizen.citizen_number || "Без номера";
              const isFirstUnionCitizen = isFirstUnionNumber(citizen.citizen_number);
              const displayStatus = isFirstUnionCitizen ? FIRST_UNION_TITLE : "Активный ничегошка";

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
                citizen.citizen_number
                  ? `/verify?number=${encodeURIComponent(citizen.citizen_number)}`
                  : "#";

              return (
                <div
                  key={`${citizen.id ?? "no-id"}-${citizen.citizen_number ?? "no-number"}-${index}`}
                  className={`
                    rounded-3xl
                    shadow-xl
                    border
                    p-6
                    hover:shadow-2xl
                    transition
                    ${
                      isFirstUnionCitizen
                        ? "bg-gradient-to-br from-white via-[#FFF7D6] to-[#F3E4A3] border-[#C9A646]"
                        : "bg-white border-gray-200"
                    }
                  `}
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

                      {isFirstUnionCitizen && (
                        <p className="mt-2 inline-flex rounded-full border border-[#C9A646] bg-[#FFF7D6] px-3 py-1 text-xs font-black text-[#7A5C12]">
                          👑 Первый Созыв
                        </p>
                      )}
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
                        {passportNumber}
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

                    <div className={`
                      rounded-xl
                      p-4
                      border
                      ${
                        isFirstUnionCitizen
                          ? "bg-[#FFF7D6] border-[#C9A646]"
                          : "bg-green-50 border-green-200"
                      }
                    `}>
                      <p className={`${isFirstUnionCitizen ? "text-[#7A5C12]" : "text-green-700"} text-xs mb-1`}>
                        Статус
                      </p>

                      <p className={`${isFirstUnionCitizen ? "text-[#7A5C12]" : "text-green-800"} font-black text-lg`}>
                        {isFirstUnionCitizen ? `👑 ${displayStatus}` : "🟢 Одобрено"}
                      </p>
                    </div>
                  </div>

                  {citizen.citizen_number ? (
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
