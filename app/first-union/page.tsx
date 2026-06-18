"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FIRST_UNION_TITLE, getFirstUnionIndex, isFirstUnionNumber } from "@/lib/first-union";

type FirstUnionCitizen = {
  id?: number | string | null;
  application_id?: number | string | null;
  full_name?: string | null;
  country?: string | null;
  citizen_number?: string | null;
  status?: string | null;
  approved_at?: string | null;
  photo_url?: string | null;
};

function sortFirstUnionCitizens(items: FirstUnionCitizen[]) {
  return [...items].sort((a, b) => {
    const aIndex = getFirstUnionIndex(a.citizen_number) ?? 999;
    const bIndex = getFirstUnionIndex(b.citizen_number) ?? 999;

    return aIndex - bIndex;
  });
}

export default function FirstUnionPage() {
  const [citizens, setCitizens] = useState<FirstUnionCitizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFirstUnionCitizens();
  }, []);

  async function loadFirstUnionCitizens() {
    setLoading(true);

    const { data: citizenRows, error: citizensError } = await supabase
      .from("citizens")
      .select("id, application_id, full_name, country, citizen_number, status")
      .eq("status", "active")
      .like("citizen_number", "ПС-%");

    if (citizensError) {
      console.log("FIRST UNION CITIZENS LOAD ERROR:", citizensError);
      setCitizens([]);
      setLoading(false);
      return;
    }

    const onlyFirstUnion = (citizenRows || []).filter((citizen) =>
      isFirstUnionNumber(citizen.citizen_number)
    );

    const applicationIds = Array.from(
      new Set(
        onlyFirstUnion
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
        console.log("FIRST UNION APPLICATIONS LOAD ERROR:", applicationsError);
      } else {
        applicationsById = new Map(
          (applications || []).map((application) => [application.id, application])
        );
      }
    }

    const normalizedCitizens = sortFirstUnionCitizens(
      onlyFirstUnion.map((citizen) => {
        const application = citizen.application_id
          ? applicationsById.get(citizen.application_id)
          : null;

        return {
          ...citizen,
          approved_at: application?.approved_at || null,
          photo_url: application?.photo_url || null
        };
      })
    );

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
      const number = citizen.citizen_number || "";

      return (
        fullName.toLowerCase().includes(value) ||
        country.toLowerCase().includes(value) ||
        number.toLowerCase().includes(value) ||
        FIRST_UNION_TITLE.toLowerCase().includes(value)
      );
    });
  }, [citizens, search]);

  return (
    <main className="
      min-h-screen
      bg-[#F7F6F3]
      text-[#111111]
      px-4
      sm:px-6
      py-10
    ">
      <div className="max-w-6xl mx-auto">
        <section className="
          rounded-[32px]
          border-2
          border-[#C9A646]
          bg-gradient-to-br
          from-white
          via-[#FFF7D6]
          to-[#F0D36A]
          shadow-2xl
          p-6
          sm:p-10
          text-center
          overflow-hidden
          relative
          mb-8
        ">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/30" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full border-[28px] border-white/30" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7A5C12] font-black mb-4">
              Первопроходцы Ничегонии
            </p>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5">
              Ничегошки Первого Созыва
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5F4A17] font-semibold leading-relaxed">
              Здесь собраны первые десять граждан Федеральной Республики Ничегония,
              получившие почётный номер паспорта серии ПС.
            </p>

            <div className="mt-7 inline-flex rounded-full bg-[#111111] px-6 py-3 text-white font-black shadow-xl">
              👑 {FIRST_UNION_TITLE}
            </div>
          </div>
        </section>

        <section className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-200
          p-5
          sm:p-6
          mb-8
        ">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="flex-1">
              <label className="block mb-2 font-black text-gray-700">
                Поиск по Первому Союзу
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Введите имя, страну или номер ПС"
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
                  focus:border-[#C9A646]
                "
              />
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
        </section>

        {loading && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
            <p className="text-2xl font-black">Загружаем Первый Союз...</p>
          </div>
        )}

        {!loading && filteredCitizens.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-3xl font-black mb-3">Первый Союз пока пуст</h2>
            <p className="text-gray-600">Пользователи со статусом ПС не найдены.</p>
          </div>
        )}

        {!loading && filteredCitizens.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitizens.map((citizen, index) => {
              const fullName = citizen.full_name || "Без имени";
              const country = citizen.country || "Не указана";
              const passportNumber = citizen.citizen_number || "Без номера";
              const firstUnionIndex = getFirstUnionIndex(citizen.citizen_number) ?? index + 1;
              const issueDate = citizen.approved_at
                ? new Date(citizen.approved_at).toLocaleDateString("ru-RU")
                : "Не указана";

              const initials = fullName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const verifyHref = citizen.citizen_number
                ? `/verify?number=${encodeURIComponent(citizen.citizen_number)}`
                : "#";

              return (
                <article
                  key={`${citizen.id ?? "no-id"}-${citizen.citizen_number ?? "no-number"}-${index}`}
                  className="
                    bg-white
                    rounded-[28px]
                    shadow-xl
                    border-2
                    border-[#C9A646]
                    p-6
                    hover:shadow-2xl
                    transition
                    relative
                    overflow-hidden
                  "
                >
                  <div className="absolute right-4 top-4 text-7xl font-black text-[#C9A646] opacity-10">
                    {firstUnionIndex}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                      {citizen.photo_url ? (
                        <img
                          src={citizen.photo_url}
                          alt="Фото гражданина"
                          className="
                            w-24
                            h-24
                            rounded-2xl
                            object-cover
                            border-2
                            border-[#C9A646]
                            shadow-md
                          "
                        />
                      ) : (
                        <div className="
                          w-24
                          h-24
                          rounded-2xl
                          bg-[#FFF7D6]
                          border-2
                          border-[#C9A646]
                          flex
                          items-center
                          justify-center
                          font-black
                          text-3xl
                        ">
                          {initials || "Н"}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-black text-[#7A5C12] mb-1">
                          #{firstUnionIndex} · {passportNumber}
                        </p>

                        <h2 className="text-2xl font-black leading-tight">
                          {fullName}
                        </h2>

                        <p className="text-gray-500 font-semibold mt-1">
                          {country}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#C9A646] bg-[#FFF7D6] p-4 mb-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-[#7A5C12] font-black mb-2">
                        Статус
                      </p>

                      <p className="text-xl font-black text-[#111111]">
                        👑 {FIRST_UNION_TITLE}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-5">
                      <div className="rounded-xl bg-[#F7F6F3] border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">Дата выдачи</p>
                        <p className="font-black">{issueDate}</p>
                      </div>
                    </div>

                    {citizen.citizen_number && (
                      <a
                        href={verifyHref}
                        className="
                          block
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
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
