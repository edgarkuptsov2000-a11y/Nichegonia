
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FIRST_UNION_TITLE, isFirstUnionNumber } from "@/lib/first-union";

type Application = {
  id: number;
  full_name?: string | null;
  age?: number | null;
  birth_date?: string | null;
  sex?: string | null;
  country?: string | null;
  reason?: string | null;
  answers?: any;
  status?: string | null;
  application_number?: string | null;
  access_code?: string | null;
  photo_url?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type AdminLog = {
  id: number;
  action?: string | null;
  application_id?: number | null;
  application_number?: string | null;
  full_name?: string | null;
  created_at?: string | null;
};

type MainTab =
  | "overview"
  | "applications"
  | "citizens"
  | "exams"
  | "messages"
  | "events"
  | "verify"
  | "logs";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const navigation: {
  id: MainTab;
  label: string;
  description: string;
  icon: string;
}[] = [
  { id: "overview", label: "Обзор", description: "Главная панель", icon: "◈" },
  { id: "applications", label: "Заявки", description: "Гражданство", icon: "▤" },
  { id: "citizens", label: "Граждане", description: "Реестр граждан", icon: "♙" },
  { id: "exams", label: "Экзамены", description: "Результаты испытаний", icon: "▣" },
  { id: "messages", label: "Обращения", description: "Сообщения граждан", icon: "✉" },
  { id: "events", label: "Мероприятия", description: "Государственные события", icon: "◇" },
  { id: "verify", label: "Проверка паспортов", description: "Проверка документов", icon: "⌕" },
  { id: "logs", label: "Журнал действий", description: "История управления", icon: "≡" },
];

function safeText(value?: any, fallback = "Не указано") {
  if (value === null || value === undefined || String(value).trim() === "") {
    return fallback;
  }
  return String(value);
}

function safeDate(value?: string | null) {
  if (!value) return "Не указана";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Не указана"
    : date.toLocaleString("ru-RU");
}

function formatBirthDate(value?: string | null) {
  if (!value) return "Не указана";

  // Дата рождения хранится как YYYY-MM-DD. Добавляем локальное время,
  // чтобы браузер не сдвигал дату на предыдущий день из-за часового пояса.
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "Не указана"
    : date.toLocaleDateString("ru-RU");
}

function statusLabel(status?: string | null) {
  if (status === "Одобрено") return "Одобрено";
  if (status === "Отклонено") return "Отклонено";
  return "На рассмотрении";
}

function statusClasses(status?: string | null) {
  if (status === "Одобрено") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "Отклонено") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function parseAnswers(answers: any) {
  if (!answers) return [];

  if (Array.isArray(answers)) return answers;

  if (typeof answers === "object") {
    return Array.isArray(answers.answers) ? answers.answers : [];
  }

  try {
    const parsed = JSON.parse(answers);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.answers)) return parsed.answers;
    return [];
  } catch {
    return [];
  }
}

function examValue(app: Application, keys: string[]) {
  for (const key of keys) {
    const value = app[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return null;
}

function formatExamValue(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logoutAdmin() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function fetchData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("ADMIN APPLICATIONS ERROR:", error);
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
      console.error("ADMIN LOGS ERROR:", error);
      setLogs([]);
    } else {
      setLogs(data || []);
    }
  }

  async function fetchCitizens() {
    const { data: citizenRows, error } = await supabase
      .from("citizens")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("CITIZENS ERROR:", error);
      setCitizens([]);
      return;
    }

    const applicationIds = Array.from(
      new Set(
        (citizenRows || [])
          .map((citizen: any) => citizen.application_id)
          .filter(Boolean)
      )
    );

    const citizenNumbers = Array.from(
      new Set(
        (citizenRows || [])
          .map((citizen: any) => citizen.citizen_number || citizen.application_number)
          .filter(Boolean)
      )
    );

    let applicationsById = new Map<any, any>();
    let applicationsByNumber = new Map<string, any>();

    if (applicationIds.length > 0) {
      const { data: rows, error: rowsError } = await supabase
        .from("applications")
        .select("id, application_number, approved_at, photo_url, status")
        .in("id", applicationIds);

      if (rowsError) {
        console.error("CITIZENS APPLICATIONS BY ID ERROR:", rowsError);
      } else {
        applicationsById = new Map(
          (rows || []).map((app: any) => [app.id, app])
        );
      }
    }

    if (citizenNumbers.length > 0) {
      const { data: rows, error: rowsError } = await supabase
        .from("applications")
        .select("id, application_number, approved_at, photo_url, status")
        .in("application_number", citizenNumbers);

      if (rowsError) {
        console.error("CITIZENS APPLICATIONS BY NUMBER ERROR:", rowsError);
      } else {
        applicationsByNumber = new Map(
          (rows || [])
            .filter((app: any) => app.application_number)
            .map((app: any) => [app.application_number, app])
        );
      }
    }

    const normalized = (citizenRows || []).map((citizen: any) => {
      const byId = citizen.application_id
        ? applicationsById.get(citizen.application_id)
        : null;

      const number = citizen.citizen_number || citizen.application_number;
      const byNumber = number ? applicationsByNumber.get(number) : null;
      const application = byId || byNumber;

      return {
        ...citizen,
        approved_at: citizen.approved_at || application?.approved_at || null,
        photo_url: citizen.photo_url || application?.photo_url || null,
        application_status: application?.status || null,
      };
    });

    setCitizens(normalized);
  }

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchData();
    fetchLogs();
    fetchCitizens();
  }, []);

  async function updateStatus(id: number, status: string) {
    const response = await fetch("/api/admin/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
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

  function getVerifyLink(number?: string | null) {
    if (!number) return "";
    const path = `/verify?number=${encodeURIComponent(number)}`;
    return origin ? `${origin}${path}` : path;
  }

  async function copyVerifyLink(number?: string | null) {
    const link = getVerifyLink(number);

    if (!link) {
      alert("У этой записи нет номера паспорта.");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      alert("Ссылка проверки скопирована.");
    } catch {
      alert("Не удалось скопировать ссылку.");
    }
  }

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((app) => app.status === "На рассмотрении").length,
    approved: applications.filter((app) => app.status === "Одобрено").length,
    rejected: applications.filter((app) => app.status === "Отклонено").length,
  }), [applications]);

  const approvedApplications = useMemo(
    () => applications.filter((app) => app.status === "Одобрено"),
    [applications]
  );

  const visibleApplications = useMemo(() => {
    const value = search.trim().toLowerCase();

    return applications.filter((app) => {
      if (statusFilter === "pending" && app.status !== "На рассмотрении") return false;
      if (statusFilter === "approved" && app.status !== "Одобрено") return false;
      if (statusFilter === "rejected" && app.status !== "Отклонено") return false;

      if (!value) return true;

      return [
        app.full_name,
        app.country,
        app.application_number,
      ].some((item) => String(item || "").toLowerCase().includes(value));
    });
  }, [applications, statusFilter, search]);

  const visibleCitizens = useMemo(() => {
    const value = search.trim().toLowerCase();

    return citizens.filter((citizen) => {
      if (!value) return true;

      const number = citizen.citizen_number || citizen.application_number || "";
      const displayStatus = isFirstUnionNumber(number)
        ? FIRST_UNION_TITLE
        : "Активный ничегошка";

      return [
        citizen.full_name,
        citizen.country,
        number,
        displayStatus,
      ].some((item) => String(item || "").toLowerCase().includes(value));
    });
  }, [citizens, search]);

  const verifiedApplication = useMemo(() => {
    const value = verifyNumber.trim().toLowerCase();
    if (!value) return null;

    const citizen = citizens.find((item) => {
      const number = item.citizen_number || item.application_number || "";
      const name = item.full_name || "";

      return (
        number.toLowerCase().includes(value) ||
        name.toLowerCase().includes(value)
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
        application_number: citizen.citizen_number || citizen.application_number,
        status:
          linkedApplication?.status ||
          (citizen.status === "active" ? "Одобрено" : citizen.status),
        photo_url: linkedApplication?.photo_url || citizen.photo_url,
        approved_at: linkedApplication?.approved_at || citizen.approved_at,
      };
    }

    return applications.find((app) => {
      const number = app.application_number || "";
      const name = app.full_name || "";

      return (
        number.toLowerCase().includes(value) ||
        name.toLowerCase().includes(value)
      );
    }) || null;
  }, [applications, citizens, verifyNumber]);

  const examApplications = useMemo(() => {
    return approvedApplications.filter((app) => {
      return [
        "score",
        "exam_score",
        "verdict",
        "exam_version",
        "correct_answers",
        "total_questions",
        "total_seconds",
        "answer_changes",
        "secrets_found",
        "achievements",
      ].some((key) => app[key] !== undefined && app[key] !== null);
    });
  }, [approvedApplications]);

  const currentSection = navigation.find((item) => item.id === mainTab);

  const cardClass =
    "rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_4px_18px_rgba(25,25,25,0.035)]";

  const buttonPrimary =
    "rounded-xl bg-[#171918] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#303632]";

  const buttonSecondary =
    "rounded-xl border border-[#E5E0D6] bg-white px-4 py-3 text-sm font-semibold text-[#343832] transition hover:bg-[#F7F5F0]";

  const inputClass =
    "w-full rounded-xl border border-[#E5E0D6] bg-white px-4 py-3 text-sm text-[#20231F] outline-none transition placeholder:text-[#A5A49F] focus:border-[#B99A51] focus:ring-2 focus:ring-[#B99A51]/10";

  function changeTab(tab: MainTab) {
    setMainTab(tab);
    setSidebarOpen(false);
    setSearch("");
    if (tab === "applications") setStatusFilter("pending");
  }

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#20231F]">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            aria-label="Закрыть меню"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        <aside
  className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[270px] flex-col bg-[#171A18] text-white transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0`}
>
          <div className="border-b border-white/10 px-6 py-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9AA62]/50 bg-[#C9AA62]/10 text-xl font-bold text-[#D7BD7E]">
                Н
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">НИЧЕГОНИЯ</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#A7A99F]">
                  Государственный портал
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#92978F]">
                Система управления
              </p>
              <p className="mt-1 text-sm font-semibold text-[#E5D6AD]">
                Панель администратора
              </p>
            </div>
          </div>

          <nav className="admin-sidebar-nav min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777F76]">
              Рабочее пространство
            </p>

            {navigation.map((item) => {
              const active = mainTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "border border-[#C9AA62]/25 bg-[#C9AA62]/10 text-[#E4CD91]"
                      : "border border-transparent text-[#C2C5BE] hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
                      active
                        ? "bg-[#C9AA62]/15 text-[#E4CD91]"
                        : "bg-white/[0.05] text-[#A9AEA5]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-[10px] text-[#858C83]">
                      {item.description}
                    </span>
                  </span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D6B96F]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-xl bg-white/[0.04] p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#858C83]">
                Статус системы
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-[#D4D8D0]">Панель активна</span>
              </div>
            </div>

            <button
              onClick={logoutAdmin}
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-[#D3D4CE] transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
            >
              ↗ Выйти из системы
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:ml-[270px]">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E8E4DC] bg-[#F8F7F4]/95 px-5 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-[#E5E0D6] bg-white px-3 py-2 text-lg lg:hidden"
              >
                ☰
              </button>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99968D]">
                  Ничегония / Управление
                </p>
                <p className="mt-1 text-sm font-bold text-[#252923]">
                  {currentSection?.label || "Панель управления"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-[#343832]">Администратор</p>
                <p className="mt-1 text-[10px] text-[#929087]">Управление государством</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7C99F] bg-[#EFE8D8] text-sm font-bold text-[#8B7136]">
                А
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 md:p-8">
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A58A4C]">
                  Федеральная Республика Ничегония
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-[#20231F] md:text-3xl">
                  {mainTab === "overview"
                    ? "Центр управления"
                    : currentSection?.label}
                </h1>
                <p className="mt-2 text-sm text-[#85847D]">
                  {mainTab === "overview"
                    ? "Общая информация и основные показатели государства."
                    : currentSection?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#88877F]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Система работает
              </div>
            </div>

            {mainTab === "overview" && (
              <section className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Всего заявок",
                      value: stats.total,
                      note: "Все поступившие заявления",
                      icon: "▤",
                    },
                    {
                      label: "На рассмотрении",
                      value: stats.pending,
                      note: "Ожидают решения",
                      icon: "◷",
                    },
                    {
                      label: "Одобрено",
                      value: stats.approved,
                      note: "Получили гражданство",
                      icon: "✓",
                    },
                    {
                      label: "Отклонено",
                      value: stats.rejected,
                      note: "Отрицательное решение",
                      icon: "×",
                    },
                  ].map((item, index) => (
                    <div key={item.label} className={`${cardClass} p-5 md:p-6`}>
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-[#777970]">{item.label}</p>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F2E9] text-lg text-[#A58A4C]">
                          {item.icon}
                        </span>
                      </div>
                      <p className="mt-5 text-4xl font-bold tracking-tight text-[#242822]">
                        {item.value}
                      </p>
                      <p className="mt-2 text-xs text-[#9A9991]">{item.note}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
                  <div className={`${cardClass} p-6`}>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold">Последние заявки</h2>
                        <p className="mt-1 text-xs text-[#96958D]">
                          Недавно поступившие заявления
                        </p>
                      </div>
                      <button
                        onClick={() => changeTab("applications")}
                        className="text-xs font-semibold text-[#9B8043] hover:text-[#6D5727]"
                      >
                        Все заявки →
                      </button>
                    </div>

                    {loading ? (
                      <p className="py-8 text-center text-sm text-[#999]">Загрузка...</p>
                    ) : applications.length === 0 ? (
                      <p className="py-8 text-center text-sm text-[#999]">
                        Пока нет заявок
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {applications.slice(0, 5).map((app) => (
                          <div
                            key={app.id}
                            className="flex flex-col justify-between gap-3 rounded-xl border border-[#F0EEE8] p-4 sm:flex-row sm:items-center"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {safeText(app.full_name, "Без имени")}
                              </p>
                              <p className="mt-1 text-xs text-[#96958D]">
                                #{safeText(app.application_number, "Без номера")} ·{" "}
                                {safeDate(app.created_at)}
                              </p>
                            </div>
                            <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusClasses(app.status)}`}>
                              {statusLabel(app.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`${cardClass} p-6`}>
                    <h2 className="text-base font-bold">Быстрые действия</h2>
                    <p className="mt-1 text-xs text-[#96958D]">
                      Переход к основным инструментам
                    </p>

                    <div className="mt-5 space-y-3">
                      <button
                        onClick={() => changeTab("applications")}
                        className="flex w-full items-center justify-between rounded-xl bg-[#191D1A] p-4 text-left text-sm font-semibold text-white transition hover:bg-[#303832]"
                      >
                        Рассмотреть заявки
                        <span className="text-[#D7BD7E]">→</span>
                      </button>
                      <button
                        onClick={() => changeTab("citizens")}
                        className="flex w-full items-center justify-between rounded-xl border border-[#E8E4DC] p-4 text-left text-sm font-semibold transition hover:bg-[#F8F7F3]"
                      >
                        Открыть реестр граждан
                        <span className="text-[#A58A4C]">→</span>
                      </button>
                      <button
                        onClick={() => changeTab("verify")}
                        className="flex w-full items-center justify-between rounded-xl border border-[#E8E4DC] p-4 text-left text-sm font-semibold transition hover:bg-[#F8F7F3]"
                      >
                        Проверить паспорт
                        <span className="text-[#A58A4C]">→</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E6DDC6] bg-[#F2EEDF] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94783A]">
                    Информация
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6F6347]">
                    Административная панель Ничегонии. Все изменения статусов
                    заявок выполняются через существующий серверный API.
                  </p>
                </div>
              </section>
            )}

            {(mainTab === "applications" || mainTab === "citizens") && (
              <section className={`${cardClass} mb-5 p-5`}>
                <label className="mb-2 block text-xs font-semibold text-[#777970]">
                  Поиск по реестру
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Имя, страна или номер документа..."
                  className={inputClass}
                />
              </section>
            )}

            {mainTab === "applications" && (
              <section>
                <div className="mb-5 flex flex-wrap gap-2">
                  {[
                    { id: "pending", label: "На рассмотрении" },
                    { id: "approved", label: "Одобренные" },
                    { id: "rejected", label: "Отклонённые" },
                    { id: "all", label: "Все заявки" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStatusFilter(item.id as StatusFilter)}
                      className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                        statusFilter === item.id
                          ? "bg-[#191D1A] text-white"
                          : "border border-[#E5E0D6] bg-white text-[#686A62] hover:bg-[#F8F7F3]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className={`${cardClass} p-10 text-center text-sm text-[#999]`}>
                    Загрузка заявок...
                  </div>
                ) : visibleApplications.length === 0 ? (
                  <div className={`${cardClass} p-10 text-center`}>
                    <p className="font-semibold">Заявок не найдено</p>
                    <p className="mt-2 text-sm text-[#999]">
                      Попробуйте изменить фильтр или поисковый запрос.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleApplications.map((app) => {
                      const answers = parseAnswers(app.answers);
                      const firstUnion = isFirstUnionNumber(app.application_number);

                      return (
                        <article key={app.id} className={`${cardClass} overflow-hidden`}>
                          <div className="p-5 md:p-6">
                            <div className="flex flex-col justify-between gap-5 md:flex-row">
                              <div className="flex min-w-0 gap-4">
                                {app.photo_url ? (
                                  <img
                                    src={app.photo_url}
                                    alt="Фото заявителя"
                                    className="h-20 w-20 shrink-0 rounded-xl border border-[#D5C28F] object-cover"
                                  />
                                ) : (
                                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#E4D8B7] bg-[#F3EFE3] text-2xl font-bold text-[#A58A4C]">
                                    Н
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A968B]">
                                    Заявка #{safeText(app.application_number, "Без номера")}
                                  </p>
                                  <h2 className="mt-1 break-words text-xl font-bold">
                                    {safeText(app.full_name, "Без имени")}
                                  </h2>
                                  {firstUnion && (
                                    <span className="mt-2 inline-flex rounded-full border border-[#E4D4A9] bg-[#F8F1DE] px-3 py-1 text-[10px] font-bold text-[#927536]">
                                      {FIRST_UNION_TITLE}
                                    </span>
                                  )}
                                  <div className="mt-3 space-y-1 text-xs text-[#777970]">
                                    <p>Возраст: {app.age || "Не указан"}</p>
                                    <p>Дата рождения: {formatBirthDate(app.birth_date)}</p>
                                    <p>Пол: {safeText(app.sex)}</p>
                                    <p>Страна: {safeText(app.country)}</p>
                                    <p className="break-words">Причина: {safeText(app.reason)}</p>
                                    <p>Дата подачи: {safeDate(app.created_at)}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusClasses(app.status)}`}>
                                  {statusLabel(app.status)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F0EEE8] pt-5">
                              <button
                                onClick={() =>
                                  setOpenedAnswers(openedAnswers === app.id ? null : app.id)
                                }
                                className={buttonSecondary}
                              >
                                {openedAnswers === app.id ? "Скрыть ответы" : "Ответы на вопросы"}
                              </button>

                              {app.application_number && (
                                <>
                                  <a
                                    href={`/verify?number=${encodeURIComponent(app.application_number)}`}
                                    className={buttonSecondary}
                                  >
                                    Проверить паспорт
                                  </a>
                                  <button
                                    onClick={() => copyVerifyLink(app.application_number)}
                                    className={buttonSecondary}
                                  >
                                    Скопировать ссылку
                                  </button>
                                </>
                              )}

                              {app.status === "На рассмотрении" && (
                                <>
                                  <button
                                    onClick={() => updateStatus(app.id, "Одобрено")}
                                    className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                  >
                                    ✓ Одобрить
                                  </button>
                                  <button
                                    onClick={() => updateStatus(app.id, "Отклонено")}
                                    className="rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
                                  >
                                    Отклонить
                                  </button>
                                </>
                              )}
                            </div>

                            {openedAnswers === app.id && (
                              <div className="mt-5 rounded-xl border border-[#EAE5D9] bg-[#F8F7F3] p-4">
                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8B7748]">
                                  Ответы заявителя
                                </p>
                                {answers.length === 0 ? (
                                  <p className="text-sm text-[#929087]">
                                    Ответы не найдены или имеют другой формат.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {answers.map((item: any, index: number) => (
                                      <div key={index} className="rounded-lg bg-white p-4">
                                        <p className="text-sm font-semibold">
                                          {safeText(item.question, `Вопрос ${index + 1}`)}
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm text-[#777970]">
                                          {safeText(item.answer)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {mainTab === "citizens" && (
              <section>
                <div className={`${cardClass} mb-5 flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center`}>
                  <div>
                    <h2 className="font-bold">Реестр граждан Ничегонии</h2>
                    <p className="mt-1 text-xs text-[#929087]">
                      Зарегистрированные граждане и их документы
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    Найдено записей: {visibleCitizens.length}
                  </p>
                </div>

                {visibleCitizens.length === 0 ? (
                  <div className={`${cardClass} p-10 text-center`}>
                    <p className="font-semibold">Граждан не найдено</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {visibleCitizens.map((citizen, index) => {
                      const number = citizen.citizen_number || citizen.application_number;
                      const firstUnion = isFirstUnionNumber(number);
                      const verifyLink = getVerifyLink(number);

                      return (
                        <article
                          key={`${citizen.id}-${number}-${index}`}
                          className={`${cardClass} p-5`}
                        >
                          <div className="flex items-start gap-4">
                            {citizen.photo_url ? (
                              <img
                                src={citizen.photo_url}
                                alt="Фото гражданина"
                                className="h-16 w-16 shrink-0 rounded-xl border border-[#D5C28F] object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#E4D8B7] bg-[#F3EFE3] text-xl font-bold text-[#A58A4C]">
                                Н
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] uppercase tracking-[0.15em] text-[#99958B]">
                                {safeText(number, "Без номера")}
                              </p>
                              <h3 className="mt-1 break-words text-lg font-bold">
                                {safeText(citizen.full_name, "Без имени")}
                              </h3>
                              {firstUnion && (
                                <span className="mt-2 inline-flex rounded-full border border-[#E4D4A9] bg-[#F8F1DE] px-3 py-1 text-[10px] font-bold text-[#927536]">
                                  {FIRST_UNION_TITLE}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 border-t border-[#F0EEE8] pt-4 text-xs text-[#777970]">
                            <p>Страна: {safeText(citizen.country)}</p>
                            <p>Статус: {firstUnion ? FIRST_UNION_TITLE : "Активный гражданин"}</p>
                            <p>Дата выдачи: {safeDate(citizen.approved_at)}</p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {number && (
                              <a
                                href={`/verify?number=${encodeURIComponent(number)}`}
                                className={buttonPrimary}
                              >
                                Проверить паспорт
                              </a>
                            )}
                            <button
                              onClick={() => copyVerifyLink(number)}
                              className={buttonSecondary}
                            >
                              Скопировать ссылку
                            </button>
                          </div>

                          {verifyLink && (
                            <p className="mt-3 break-all text-[10px] text-[#A09E96]">
                              {verifyLink}
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {mainTab === "exams" && (
              <section className="space-y-5">
                <div className={`${cardClass} p-5`}>
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="font-bold">Результаты экзаменов</h2>
                      <p className="mt-1 text-xs text-[#929087]">
                        Данные экзамена, сохранённые в заявках на гражданство
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F3EFE3] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#8F805B]">
                        Найдено результатов
                      </p>
                      <p className="mt-1 text-xl font-bold">{examApplications.length}</p>
                    </div>
                  </div>
                </div>

                {examApplications.length === 0 ? (
                  <div className={`${cardClass} p-10 text-center`}>
                    <div className="text-3xl text-[#B7A36E]">▣</div>
                    <p className="mt-3 font-semibold">Данные экзаменов пока не найдены</p>
                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#929087]">
                      В одобренных заявках не обнаружены известные поля с результатами
                      экзамена. Когда проверим структуру сохранения результатов,
                      подключим сюда полную статистику.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {examApplications.map((app) => {
                      const score = examValue(app, ["score", "exam_score"]);
                      const correct = examValue(app, ["correct_answers"]);
                      const totalQuestions = examValue(app, ["total_questions"]);
                      const verdict = examValue(app, ["verdict"]);
                      const version = examValue(app, ["exam_version"]);
                      const seconds = examValue(app, ["total_seconds"]);
                      const changes = examValue(app, ["answer_changes"]);
                      const secrets = examValue(app, ["secrets_found"]);
                      const achievements = examValue(app, ["achievements"]);

                      return (
                        <article key={app.id} className={`${cardClass} p-5`}>
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.15em] text-[#99958B]">
                                {safeText(app.application_number, "Без номера")}
                              </p>
                              <h3 className="mt-1 text-lg font-bold">
                                {safeText(app.full_name, "Без имени")}
                              </h3>
                            </div>
                            {verdict !== null && (
                              <span className="w-fit rounded-full border border-[#E4D4A9] bg-[#F8F1DE] px-3 py-1.5 text-xs font-semibold text-[#927536]">
                                {formatExamValue(verdict)}
                              </span>
                            )}
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                            {[
                              ["Результат", score],
                              ["Правильных ответов", correct],
                              ["Всего вопросов", totalQuestions],
                              ["Версия экзамена", version],
                              ["Время прохождения", seconds],
                              ["Изменения ответов", changes],
                              ["Найдено секретов", secrets],
                              ["Достижения", achievements],
                            ]
                              .filter(([, value]) => value !== null)
                              .map(([label, value]) => (
                                <div key={String(label)} className="rounded-xl bg-[#F7F6F2] p-3">
                                  <p className="text-[10px] text-[#99958B]">{label}</p>
                                  <p className="mt-1 break-words text-sm font-semibold">
                                    {formatExamValue(value)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {(mainTab === "messages" || mainTab === "events") && (
              <section className={`${cardClass} overflow-hidden`}>
                <div className="border-b border-[#EEEAE1] bg-[#FAF9F6] px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A58A4C]">
                    Новый модуль
                  </p>
                  <h2 className="mt-2 text-xl font-bold">
                    {mainTab === "messages"
                      ? "Сообщения и обращения граждан"
                      : "Управление мероприятиями"}
                  </h2>
                </div>

                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5D9B9] bg-[#F5F0E3] text-2xl text-[#A58A4C]">
                    {mainTab === "messages" ? "✉" : "◇"}
                  </div>
                  <h3 className="mt-5 text-lg font-bold">Раздел находится в разработке</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#929087]">
                    {mainTab === "messages"
                      ? "Здесь появится управление сообщениями, обращениями граждан и внутренней коммуникацией. Подключим раздел после создания таблиц и необходимых API."
                      : "Здесь появится создание мероприятий, управление датами, регистрацией участников и публикацией событий. Подключим раздел после проектирования базы данных."}
                  </p>
                  <span className="mt-5 inline-flex rounded-full border border-[#E6DDC6] bg-[#F8F5EB] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#967C43]">
                    Модуль запланирован
                  </span>
                </div>
              </section>
            )}

            {mainTab === "verify" && (
              <section className="space-y-5">
                <div className={`${cardClass} p-6`}>
                  <h2 className="text-base font-bold">Проверка подлинности документа</h2>
                  <p className="mt-1 text-xs text-[#929087]">
                    Введите номер паспорта или имя гражданина
                  </p>
                  <div className="mt-5">
                    <input
                      value={verifyNumber}
                      onChange={(e) => setVerifyNumber(e.target.value)}
                      placeholder="Например, ПС-1 или НЧ-000001"
                      className={inputClass}
                    />
                  </div>
                </div>

                {!verifyNumber.trim() ? (
                  <div className={`${cardClass} p-10 text-center`}>
                    <div className="text-3xl text-[#B7A36E]">⌕</div>
                    <p className="mt-3 font-semibold">Ожидание поискового запроса</p>
                    <p className="mt-1 text-sm text-[#929087]">
                      Введите данные документа для проверки.
                    </p>
                  </div>
                ) : !verifiedApplication ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="text-lg font-bold text-red-800">Запись не найдена</p>
                    <p className="mt-2 text-sm text-red-700">
                      Проверьте правильность введённого номера или имени.
                    </p>
                  </div>
                ) : (
                  <div className={`${cardClass} p-6`}>
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {verifiedApplication.photo_url && (
                        <img
                          src={verifiedApplication.photo_url}
                          alt="Фото гражданина"
                          className="h-28 w-28 rounded-xl border border-[#D5C28F] object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusClasses(verifiedApplication.status)}`}>
                          {statusLabel(verifiedApplication.status)}
                        </span>

                        {isFirstUnionNumber(verifiedApplication.application_number) && (
                          <p className="mt-2 text-xs font-semibold text-[#987A37]">
                            {FIRST_UNION_TITLE}
                          </p>
                        )}

                        <h2 className="mt-3 break-words text-2xl font-bold">
                          {safeText(verifiedApplication.full_name, "Без имени")}
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-[#777970]">
                          {safeText(verifiedApplication.application_number, "Без номера")}
                        </p>
                        <p className="mt-1 text-sm text-[#929087]">
                          Страна: {safeText(verifiedApplication.country)}
                        </p>
                        <p className="mt-1 text-xs text-[#929087]">
                          Выдан: {safeDate(verifiedApplication.approved_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-[#F0EEE8] pt-5">
                      {verifiedApplication.application_number && (
                        <a
                          href={`/verify?number=${encodeURIComponent(verifiedApplication.application_number)}`}
                          className={buttonPrimary}
                        >
                          Открыть публичную проверку
                        </a>
                      )}
                      <button
                        onClick={() => copyVerifyLink(verifiedApplication.application_number)}
                        className={buttonSecondary}
                      >
                        Скопировать ссылку
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {mainTab === "logs" && (
              <section className={`${cardClass} p-5 md:p-6`}>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-bold">История административных действий</h2>
                    <p className="mt-1 text-xs text-[#929087]">
                      Записи из журнала admin_logs
                    </p>
                  </div>
                  <button onClick={fetchLogs} className={buttonPrimary}>
                    ↻ Обновить журнал
                  </button>
                </div>

                {logs.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-semibold">Записей пока нет</p>
                    <p className="mt-1 text-sm text-[#929087]">
                      Здесь будут отображаться действия администраторов.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-[#EEEAE1] p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {safeText(log.full_name, "Без имени")}
                          </p>
                          <p className="mt-1 text-xs text-[#777970]">
                            Действие:{" "}
                            <span className="font-semibold text-[#987A37]">
                              {safeText(log.action)}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-[#929087]">
                            Заявка: #{safeText(log.application_number, "Без номера")}
                          </p>
                        </div>
                        <p className="text-xs text-[#929087]">
                          {safeDate(log.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-[#E5E1D8] py-5 text-[10px] text-[#A09E96] sm:flex-row">
              <p>Федеральная Республика Ничегония · Центр управления</p>
              <p>Ничего. Но стабильно.</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
