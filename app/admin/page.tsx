"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Application = {
  id: number;
  full_name?: string | null;
  age?: number | null;
  country?: string | null;
  reason?: string | null;
  answers?: string | null;
  status?: string | null;
  application_number?: string | null;
  access_code?: string | null;
  photo_url?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
};

type AdminLog = {
  id: number;
  action?: string | null;
  application_id?: number | null;
  application_number?: string | null;
  full_name?: string | null;
  created_at?: string | null;
};

type MainTab = "overview" | "applications" | "citizens" | "verify" | "logs";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

function statusLabel(status?: string | null) {
  if (status === "Одобрено") return "🟢 Одобрено";
  if (status === "Отклонено") return "🔴 Отклонено";
  return "🟡 На рассмотрении";
}

function statusClasses(status?: string | null) {
  if (status === "Одобрено") return "bg-green-100 text-green-700 border-green-200";
  if (status === "Отклонено") return "bg-red-100 text-red-700 border-red-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

function safeText(value?: string | null, fallback = "Не указано") {
  return value && value.trim() ? value : fallback;
}

function safeDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("ru-RU") : "Не указана";
}

function parseAnswers(answers?: string | null) {
  if (!answers) return [];

  try {
    const parsed = JSON.parse(answers);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [openedAnswers, setOpenedAnswers] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [verifyNumber, setVerifyNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [loading, setLoading] = useState(true);

  async function logoutAdmin() {
  await fetch("/api/admin-logout", {
    method: "POST"
  });

  window.location.href = "/admin/login";
}

async function fetchCitizens() {
  const { data, error } = await supabase
    .from("citizens")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("CITIZENS ERROR:", error);
    setCitizens([]);
  } else {
    setCitizens(data || []);
  }
}

  useEffect(() => {
  setOrigin(window.location.origin);
  fetchData();
  fetchLogs();
  fetchCitizens();
}, []);

  async function fetchData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("ADMIN APPLICATIONS ERROR:", error);
      setApplications([]);
    } else {
      setApplications(data || []);
    }

    setLoading(false);
  }

  async function fetchLogs() {
    const { data, error } = await supabase
      .from("admin_logs")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("ADMIN LOGS ERROR:", error);
      setLogs([]);
    } else {
      setLogs(data || []);
    }
  }

  async function updateStatus(id: number, status: string, app: Application) {
    const response = await fetch("/api/admin/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        status
      })
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      alert(result?.error || "Не удалось обновить статус заявки.");
      return;
    }

    await fetchData();
    await fetchLogs();
    await fetchCitizens();
  }

  function getVerifyLink(applicationNumber?: string | null) {
  if (!applicationNumber) return "";

  const path = `/verify?number=${encodeURIComponent(applicationNumber)}`;

  return origin ? `${origin}${path}` : path;
}

  async function copyVerifyLink(applicationNumber?: string | null) {
    const link = getVerifyLink(applicationNumber);

    if (!link) {
      alert("У этой заявки нет номера паспорта.");
      return;
    }

    await navigator.clipboard.writeText(link);
    alert("Ссылка проверки скопирована.");
  }

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((app) => app.status === "На рассмотрении").length;
    const approved = applications.filter((app) => app.status === "Одобрено").length;
    const rejected = applications.filter((app) => app.status === "Отклонено").length;

    return { total, pending, approved, rejected };
  }, [applications]);

  const approvedApplications = useMemo(() => {
    return applications.filter((app) => app.status === "Одобрено");
  }, [applications]);

  const visibleApplications = useMemo(() => {
    const value = search.trim().toLowerCase();

    return applications.filter((app) => {
      if (statusFilter === "pending" && app.status !== "На рассмотрении") return false;
      if (statusFilter === "approved" && app.status !== "Одобрено") return false;
      if (statusFilter === "rejected" && app.status !== "Отклонено") return false;

      if (!value) return true;

      const fullName = app.full_name || "";
      const country = app.country || "";
      const number = app.application_number || "";

      return (
        fullName.toLowerCase().includes(value) ||
        country.toLowerCase().includes(value) ||
        number.toLowerCase().includes(value)
      );
    });
  }, [applications, statusFilter, search]);

  const visibleCitizens = useMemo(() => {
  const value = search.trim().toLowerCase();

  return citizens.filter((citizen) => {
    if (!value) return true;

    const fullName = citizen.full_name || "";
    const country = citizen.country || "";
    const number = citizen.citizen_number || "";

    return (
      fullName.toLowerCase().includes(value) ||
      country.toLowerCase().includes(value) ||
      number.toLowerCase().includes(value)
    );
  });
}, [citizens, search]);

  const verifiedApplication = useMemo(() => {
    const value = verifyNumber.trim().toLowerCase();

    if (!value) return null;

    const citizen = citizens.find((item) => {
      const number = item.citizen_number || "";
      const fullName = item.full_name || "";

      return (
        number.toLowerCase() === value ||
        number.toLowerCase().includes(value) ||
        fullName.toLowerCase().includes(value)
      );
    });

    if (citizen) {
      const linkedApplication = applications.find(
        (app) => String(app.id) === String(citizen.application_id)
      );

      return {
        ...linkedApplication,
        id: linkedApplication?.id || citizen.id,
        full_name: citizen.full_name,
        country: citizen.country,
        application_number: citizen.citizen_number,
        status: linkedApplication?.status || (citizen.status === "active" ? "Одобрено" : citizen.status),
        photo_url: linkedApplication?.photo_url || citizen.photo_url,
        approved_at: linkedApplication?.approved_at || citizen.approved_at
      };
    }

    return (
      applications.find((app) => {
        const number = app.application_number || "";
        const fullName = app.full_name || "";

        return (
          number.toLowerCase() === value ||
          number.toLowerCase().includes(value) ||
          fullName.toLowerCase().includes(value)
        );
      }) || null
    );
  }, [applications, citizens, verifyNumber]);


  return (
    <main className="
      min-h-screen
      bg-gradient-to-b
      from-[#F7F6F3]
      to-[#ECE8E1]
      p-6
      md:p-10
      text-[#111111]
    ">
      <div className="max-w-7xl mx-auto">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          border
          border-gray-200
          p-8
          mb-8
        ">
          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-gray-500
            font-bold
            text-center
            mb-3
          ">
            Федеральная Республика
          </p>

          <h1 className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            mb-4
            tracking-tight
          ">
            Центр управления Ничегонией
          </h1>

          <p className="text-center text-gray-600 text-lg">
            Заявки, граждане, проверка паспортов и журнал действий в одном месте.
          </p>
          
<div className="flex justify-center mt-6">
  <button
    onClick={logoutAdmin}
    className="
      bg-red-500
      text-white
      px-6
      py-3
      rounded-xl
      font-black
      hover:bg-red-600
      transition
      shadow-md
    "
  >
    Выйти из админки
  </button>
</div>

        </div>

        <div className="
          grid
          grid-cols-2
          md:grid-cols-5
          gap-3
          mb-8
        ">
          {[
            { id: "overview", label: "Обзор", icon: "📊" },
            { id: "applications", label: "Заявки", icon: "📄" },
            { id: "citizens", label: "Граждане", icon: "🪪" },
            { id: "verify", label: "Проверка", icon: "🔎" },
            { id: "logs", label: "Журнал", icon: "🧾" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMainTab(item.id as MainTab)}
              className={`
                rounded-2xl
                px-5
                py-4
                font-black
                shadow-md
                border
                transition
                ${
                  mainTab === item.id
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111] border-gray-200 hover:shadow-xl"
                }
              `}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {mainTab === "overview" && (
          <section>
            <div className="
              grid
              grid-cols-1
              md:grid-cols-4
              gap-5
              mb-8
            ">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <p className="text-gray-500 font-bold mb-2">Всего заявок</p>
                <p className="text-5xl font-black">{stats.total}</p>
              </div>

              <div className="bg-yellow-50 rounded-3xl p-6 shadow-xl border border-yellow-200">
                <p className="text-yellow-700 font-bold mb-2">На рассмотрении</p>
                <p className="text-5xl font-black text-yellow-800">{stats.pending}</p>
              </div>

              <div className="bg-green-50 rounded-3xl p-6 shadow-xl border border-green-200">
                <p className="text-green-700 font-bold mb-2">Одобрено</p>
                <p className="text-5xl font-black text-green-800">{stats.approved}</p>
              </div>

              <div className="bg-red-50 rounded-3xl p-6 shadow-xl border border-red-200">
                <p className="text-red-700 font-bold mb-2">Отклонено</p>
                <p className="text-5xl font-black text-red-800">{stats.rejected}</p>
              </div>
            </div>

            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
            ">
              <h2 className="text-3xl font-black mb-5">
                Быстрые действия
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setMainTab("applications");
                    setStatusFilter("pending");
                  }}
                  className="bg-[#111111] text-white rounded-2xl p-5 font-black hover:opacity-90"
                >
                  Открыть новые заявки
                </button>

                <button
                  onClick={() => setMainTab("citizens")}
                  className="bg-[#111111] text-white rounded-2xl p-5 font-black hover:opacity-90"
                >
                  Открыть граждан
                </button>

                <button
                  onClick={() => setMainTab("verify")}
                  className="bg-[#111111] text-white rounded-2xl p-5 font-black hover:opacity-90"
                >
                  Проверить паспорт
                </button>
              </div>
            </div>
          </section>
        )}

        {(mainTab === "applications" || mainTab === "citizens") && (
          <section>
            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-6
              mb-8
            ">
              <label className="block mb-2 font-bold text-gray-700">
                Поиск
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
          </section>
        )}

        {mainTab === "applications" && (
          <section>
            <div className="
              flex
              justify-center
              gap-3
              flex-wrap
              mb-8
            ">
              {[
                { id: "pending", label: "На рассмотрении" },
                { id: "approved", label: "Одобренные" },
                { id: "rejected", label: "Отклонённые" },
                { id: "all", label: "Все заявки" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatusFilter(item.id as StatusFilter)}
                  className={`
                    px-6
                    py-3
                    rounded-2xl
                    font-black
                    shadow-md
                    border
                    transition
                    ${
                      statusFilter === item.id
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-white text-[#111111] border-gray-200 hover:shadow-xl"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                <p className="text-2xl font-black">Загрузка заявок...</p>
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                <p className="text-2xl font-black">Заявок не найдено</p>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleApplications.map((app) => {
                  const answers = parseAnswers(app.answers);

                  return (
                    <div
                      key={app.id}
                      className="
                        bg-white/90
                        backdrop-blur
                        p-8
                        rounded-3xl
                        shadow-lg
                        border
                        border-gray-200
                        hover:shadow-xl
                        transition
                      "
                    >
                      <div className="
                        flex
                        flex-col
                        md:flex-row
                        gap-6
                        md:items-start
                        md:justify-between
                      ">
                        <div className="flex gap-5">
                          {app.photo_url ? (
                            <img
                              src={app.photo_url}
                              alt="Фото заявителя"
                              className="
  w-20
  h-20
  rounded-lg
  object-cover
  object-center
  border-2
  border-[#C9A646]
  flex-shrink-0
"
                            />
                          ) : (
                            <div className="
  w-20
  h-20
  rounded-lg
  bg-[#EFE8D8]
  border-2
  border-[#C9A646]
  flex
  items-center
  justify-center
  font-black
  text-2xl
  flex-shrink-0
">
                              Н
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Заявка #{safeText(app.application_number, "Без номера")}
                            </p>

                            <h2 className="text-3xl font-black mb-3">
                              {safeText(app.full_name, "Без имени")}
                            </h2>

                            <div className="space-y-2 text-gray-700">
                              <p>
                                <span className="font-semibold text-black">Возраст:</span>{" "}
                                {app.age || "Не указан"}
                              </p>

                              <p>
                                <span className="font-semibold text-black">Страна:</span>{" "}
                                {safeText(app.country)}
                              </p>

                              <p>
                                <span className="font-semibold text-black">Причина:</span>{" "}
                                {safeText(app.reason)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <span className={`
                          px-4
                          py-2
                          rounded-full
                          text-sm
                          font-black
                          border
                          ${statusClasses(app.status)}
                        `}>
                          {statusLabel(app.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <button
                          onClick={() =>
                            setOpenedAnswers(openedAnswers === app.id ? null : app.id)
                          }
                          className="
                            bg-gray-100
                            hover:bg-gray-200
                            text-black
                            px-5
                            py-3
                            rounded-xl
                            transition
                            font-black
                          "
                        >
                          Ответы на вопросы
                        </button>

                        {app.application_number && (
                          <>
                            <a
                              href={`/verify?number=${encodeURIComponent(app.application_number)}`}
                              className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                transition
                                font-black
                              "
                            >
                              Проверить
                            </a>

                            <button
                              onClick={() => copyVerifyLink(app.application_number)}
                              className="
                                bg-blue-50
                                hover:bg-blue-100
                                text-blue-700
                                border
                                border-blue-200
                                px-5
                                py-3
                                rounded-xl
                                transition
                                font-black
                              "
                            >
                              Скопировать QR-ссылку
                            </button>
                          </>
                        )}

                        {app.status === "На рассмотрении" && (
                          <>
                            <button
                              className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                transition
                                font-black
                              "
                              onClick={() => updateStatus(app.id, "Одобрено", app)}
                            >
                              ✓ Одобрить
                            </button>

                            <button
                              className="
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                transition
                                font-black
                              "
                              onClick={() => updateStatus(app.id, "Отклонено", app)}
                            >
                              ✕ Отклонить
                            </button>
                          </>
                        )}
                      </div>

                      {openedAnswers === app.id && (
                        <div className="
                          mt-5
                          bg-[#F7F6F3]
                          rounded-2xl
                          p-5
                          border
                          border-gray-200
                          max-h-96
                          overflow-y-auto
                        ">
                          {answers.length === 0 ? (
                            <p className="text-gray-500">
                              Ответы не найдены или повреждены.
                            </p>
                          ) : (
                            answers.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="
                                  mb-4
                                  bg-white
                                  rounded-xl
                                  p-4
                                  shadow-sm
                                "
                              >
                                <p className="font-semibold text-black mb-2">
                                  {item.question}
                                </p>

                                <p className="text-gray-700">
                                  {item.answer}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {mainTab === "citizens" && (
          <section>
            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
              mb-8
            ">
              <h2 className="text-3xl font-black mb-2">
                Граждане Ничегонии
              </h2>

              <p className="text-gray-600">
                Всего активных граждан: {visibleCitizens.length}
              </p>
            </div>

            {visibleCitizens.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                <p className="text-2xl font-black">Граждан не найдено</p>
              </div>
            ) : (
              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
              ">
                {visibleCitizens.map((citizen, index) => {
                  const verifyLink = getVerifyLink(citizen.citizen_number);

                  return (
                    <div
                      key={`${citizen.id}-${citizen.citizen_number}-${index}`}
                      className="
                        bg-white
                        p-6
                        rounded-3xl
                        border
                        border-gray-200
                        shadow-md
                        hover:shadow-xl
                        transition
                      "
                    >
                      <div className="flex items-center gap-4 mb-5">
                        {citizen.photo_url ? (
                          <img
                            src={citizen.photo_url}
                            alt="Фото гражданина"
                            className="
  w-20
  h-20
  rounded-lg
  object-cover
  object-center
  border-2
  border-[#C9A646]
  flex-shrink-0
"
                          />
                        ) : (
                          <div className="
  w-20
  h-20
  rounded-lg
  bg-[#EFE8D8]
  border-2
  border-[#C9A646]
  flex
  items-center
  justify-center
  font-black
  text-2xl
  flex-shrink-0
">
                            Н
                          </div>
                        )}

                        <div>
                          <p className="text-gray-500 mb-1">
                            {safeText(citizen.citizen_number, "Без номера")}
                          </p>

                          <h3 className="text-2xl font-black">
                            {safeText(citizen.full_name, "Без имени")}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-3">
                        🌍 {safeText(citizen.country)}
                      </p>

                      <p className="mt-3 font-black text-green-700">
                        🟢 Активен
                      </p>

                      <p className="mt-3 text-sm text-gray-500">
                        Выдан: {safeDate(citizen.approved_at)}
                      </p>

                      <div className="flex flex-col gap-3 mt-5">
                        {citizen.citizen_number && (
                          <a
                            href={`/verify?number=${encodeURIComponent(citizen.citizen_number)}`}
                            className="
                              bg-[#111111]
                              text-white
                              text-center
                              py-3
                              rounded-xl
                              font-black
                              hover:opacity-90
                            "
                          >
                            Проверить паспорт
                          </a>
                        )}

                        <button
                          onClick={() => copyVerifyLink(citizen.citizen_number)}
                          className="
                            bg-blue-50
                            text-blue-700
                            border
                            border-blue-200
                            text-center
                            py-3
                            rounded-xl
                            font-black
                            hover:bg-blue-100
                          "
                        >
                          Скопировать QR-ссылку
                        </button>

                        {verifyLink && (
                          <p className="text-xs text-gray-500 break-all">
                            {verifyLink}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {mainTab === "verify" && (
          <section>
            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
              mb-8
            ">
              <h2 className="text-3xl font-black mb-5">
                Быстрая проверка паспорта
              </h2>

              <input
                type="text"
                value={verifyNumber}
                onChange={(e) => setVerifyNumber(e.target.value)}
                placeholder="Введите номер паспорта или имя"
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

            {!verifyNumber.trim() && (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                <p className="text-2xl font-black">
                  Введите номер паспорта для проверки
                </p>
              </div>
            )}

            {verifyNumber.trim() && !verifiedApplication && (
              <div className="
                bg-red-50
                rounded-3xl
                p-10
                text-center
                shadow-xl
                border
                border-red-200
              ">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-3xl font-black text-red-700">
                  Паспорт не найден
                </p>
              </div>
            )}

            {verifiedApplication && (
              <div className="
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-gray-200
                p-8
              ">
                <div className="flex flex-col md:flex-row gap-6">
                  {verifiedApplication.photo_url && (
                    <img
                      src={verifiedApplication.photo_url}
                      alt="Фото гражданина"
                      className="
                        w-36
                        h-36
                        rounded-2xl
                        object-cover
                        border-4
                        border-[#C9A646]
                      "
                    />
                  )}

                  <div className="flex-1">
                    <p className={`
                      inline-block
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-black
                      border
                      mb-4
                      ${statusClasses(verifiedApplication.status)}
                    `}>
                      {statusLabel(verifiedApplication.status)}
                    </p>

                    <h2 className="text-4xl font-black mb-3">
                      {safeText(verifiedApplication.full_name, "Без имени")}
                    </h2>

                    <p className="text-xl font-black mb-2">
                      {safeText(verifiedApplication.application_number, "Без номера")}
                    </p>

                    <p className="text-gray-600">
                      🌍 {safeText(verifiedApplication.country)}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {verifiedApplication.application_number && (
                        <a
                          href={`/verify?number=${encodeURIComponent(
                            verifiedApplication.application_number
                          )}`}
                          className="
                            bg-[#111111]
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            font-black
                            hover:opacity-90
                          "
                        >
                          Открыть публичную проверку
                        </a>
                      )}

                      <button
                        onClick={() =>
                          copyVerifyLink(verifiedApplication.application_number)
                        }
                        className="
                          bg-blue-50
                          text-blue-700
                          border
                          border-blue-200
                          px-5
                          py-3
                          rounded-xl
                          font-black
                          hover:bg-blue-100
                        "
                      >
                        Скопировать ссылку
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {mainTab === "logs" && (
          <section>
            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
            ">
              <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-6
              ">
                <h2 className="text-3xl font-black">
                  Журнал действий
                </h2>

                <button
                  onClick={fetchLogs}
                  className="
                    bg-[#111111]
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    font-black
                    hover:opacity-90
                  "
                >
                  Обновить журнал
                </button>
              </div>

              {logs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Пока нет записей
                </p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="
                        bg-gray-50
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                      "
                    >
                      <p className="font-black text-lg">
                        {safeText(log.full_name, "Без имени")}
                      </p>

                      <p className="mt-1">
                        Действие:
                        <span
                          className={
                            log.action === "Одобрено"
                              ? "text-green-600 font-semibold ml-2"
                              : "text-red-600 font-semibold ml-2"
                          }
                        >
                          {log.action}
                        </span>
                      </p>

                      <p>
                        Заявка: #{safeText(log.application_number, "Без номера")}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {safeDate(log.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
