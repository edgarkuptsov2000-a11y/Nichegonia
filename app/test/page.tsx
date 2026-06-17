"use client";

import { useRef, useState } from "react";

const questions = [
  {
    question: "Вы запланировали важное дело. Что будете делать?",
    answers: [
      "Сделаю прямо сейчас",
      "Сделаю вечером",
      "Сделаю потом"
    ]
  },
  {
    question: "Сегодня пятница. Что это означает?",
    answers: [
      "Обычный день",
      "Конец рабочей недели",
      "Маленькая суббота"
    ]
  },
  {
    question: "Если Ничегометр ошибся, необходимо:",
    answers: [
      "Проверить ещё раз",
      "Написать жалобу",
      "Посмотреть статью 5 Конституции"
    ]
  },
  {
    question: "Вы открыли холодильник и забыли зачем пришли. Что делать?",
    answers: [
      "Искать дальше",
      "Закрыть холодильник",
      "Сделать вид, что так и было задумано"
    ]
  },
  {
    question: "Сколько вкладок в браузере считается нормальным количеством?",
    answers: [
      "До 5",
      "До 20",
      "Пока браузер не начнёт зависать"
    ]
  },
  {
    question: "Что является главным государственным принципом Ничегонии?",
    answers: [
      "Работа",
      "Саморазвитие",
      "Ничего. Но стабильно."
    ]
  },
  {
    question: "Если вы легли на кровать в 15:00, что может произойти?",
    answers: [
      "Ничего",
      "Короткий отдых",
      "Перемещение во времени до вечера"
    ]
  },
  {
    question: "Какой документ важнее всего в Ничегонии?",
    answers: [
      "Паспорт",
      "Конституция",
      "Скриншот, который был сохранён «на потом»"
    ]
  },
  {
    question: "Ты подписан на канал welqw?",
    answers: [
      "Да",
      "Нет"
    ]
  }
];

const secretQuestions = [
  {
    question: "Сейчас 2 часа ночи. Что вы делаете?",
    answers: [
      "Сплю",
      "Смотрю одно видео перед сном",
      "Уже 4 часа смотрю видео и не понимаю как оказался здесь"
    ]
  },
  {
    question: "Что означает фраза: «Я только на минутку зашёл в YouTube»?",
    answers: [
      "Одну минуту",
      "10 минут",
      "Минимум 2 часа"
    ]
  },
  {
    question: "Вы увидели мем. Ваши действия?",
    answers: [
      "Посмеяться",
      "Сохранить",
      "Сохранить и никогда больше не открыть"
    ]
  }
];

type AnswerItem = {
  question: string;
  answer: string;
};

type SecretQuestion = {
  question: string;
  answers: string[];
};

export default function TestPage() {
  const [showError, setShowError] = useState(false);

  const [started, setStarted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [reason, setReason] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [secretQuestion, setSecretQuestion] = useState<SecretQuestion | null>(null);
  const [secretUsed, setSecretUsed] = useState(false);

  const [userAnswers, setUserAnswers] = useState<AnswerItem[]>([]);
  const [completedAnswers, setCompletedAnswers] = useState<AnswerItem[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitStartedRef = useRef(false);

  const [submitted, setSubmitted] = useState(false);
  const [submittedApplicationNumber, setSubmittedApplicationNumber] = useState("");
  const [submittedAccessCode, setSubmittedAccessCode] = useState("");

  // Важно: прогресс теста больше не сохраняем в localStorage.
  // Иначе следующий заявитель может попадать на старый 9-й вопрос.

  const question = secretQuestion || questions[currentQuestion];

  const shuffledAnswers = [...question.answers].sort(
    () => Math.random() - 0.5
  );

  async function submitApplication() {
    if (submitStartedRef.current || isSubmitting) {
      return;
    }

    const answersToSubmit = completedAnswers.length > 0
      ? completedAnswers
      : userAnswers;

    if (answersToSubmit.length === 0) {
      alert("Ответы не найдены. Пройдите тест заново.");
      return;
    }

    submitStartedRef.current = true;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("age", age);
      formData.append("country", country);
      formData.append("reason", reason);
      formData.append("answers", JSON.stringify(answersToSubmit));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await fetch("/api/applications/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("SUBMIT APPLICATION ERROR:", result);
        alert(result.error || "Не удалось отправить заявку.");
        submitStartedRef.current = false;
        setIsSubmitting(false);
        return;
      }

      const applicationNumber = result.applicationNumber;
      const accessCode = result.accessCode;

      setSubmittedApplicationNumber(applicationNumber);
      setSubmittedAccessCode(accessCode);

      localStorage.removeItem("nichogonia-test");
      setStarted(false);
      setTestCompleted(false);
      setUserAnswers([]);
      setCompletedAnswers([]);
      setCurrentQuestion(0);
      setSecretQuestion(null);
      setSecretUsed(false);
      setSubmitted(true);
    } catch (error) {
      console.log("SUBMIT APPLICATION ERROR:", error);
      alert("Не удалось отправить заявку. Попробуйте ещё раз.");
      submitStartedRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-[100dvh] bg-[#F7F6F3] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-4
          sm:p-5
          sm:p-12
          max-w-2xl
          w-full
          text-center
          border
        ">
          <div className="
            w-16
            h-16
            sm:w-24
            sm:h-24
            mx-auto
            mb-5
            sm:mb-8
            rounded-full
            bg-green-100
            flex
            items-center
            justify-center
            text-3xl sm:text-5xl
          ">
            ✓
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-[#111111]">
            ЗАЯВКА ОТПРАВЛЕНА
          </h1>

          <p className="text-base sm:text-lg text-[#111111] mb-4">
            Ваше заявление принято Администрацией Президента Ничегонии.
          </p>

          <p className="text-base sm:text-lg text-[#111111] mb-8">
            Ожидайте решения по вашему запросу.
          </p>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
            mb-5
            sm:mb-8
          ">
            <div className="
              bg-[#F7F6F3]
              border
              border-gray-200
              rounded-2xl
              p-4
          sm:p-5
              text-left
            ">
              <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-500
                font-semibold
                mb-3
              ">
                Номер заявки
              </p>

              <p className="
                text-lg sm:text-xl
                font-black
                text-[#111111]
                break-all
              ">
                {submittedApplicationNumber || "Не создан"}
              </p>
            </div>

            <div className="
              bg-[#F7F6F3]
              border
              border-gray-200
              rounded-2xl
              p-4
          sm:p-5
              text-left
            ">
              <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-500
                font-semibold
                mb-3
              ">
                Код доступа
              </p>

              <p className="
                text-lg sm:text-xl
                font-black
                text-[#111111]
                break-all
              ">
                {submittedAccessCode || "Не создан"}
              </p>
            </div>

            <div className="
              bg-yellow-50
              border
              border-yellow-200
              rounded-2xl
              p-4
          sm:p-5
              text-left
            ">
              <div className="flex items-center gap-2 mb-3">
                <span className="
                  w-3
                  h-3
                  rounded-full
                  bg-yellow-400
                " />

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-yellow-700
                  font-semibold
                ">
                  Статус
                </p>
              </div>

              <p className="
                text-lg sm:text-xl
                font-black
                text-yellow-800
              ">
                На рассмотрении
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="
              w-full
              bg-[#111111]
              text-white
              py-3
            sm:py-4
              rounded-xl
              font-semibold
            "
          >
            Вернуться в главное меню
          </button>
        </div>
      </main>
    );
  }

  if (testCompleted) {
    return (
      <main className="min-h-[100dvh] bg-[#F7F6F3] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-4
          sm:p-5
          sm:p-12
          max-w-2xl
          w-full
          text-center
          border
          text-[#111111]
        ">
          <div className="
            w-16
            h-16
            sm:w-24
            sm:h-24
            mx-auto
            mb-5
            sm:mb-8
            rounded-full
            bg-[#111111]
            text-white
            flex
            items-center
            justify-center
            text-3xl sm:text-5xl
          ">
            📝
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-6 text-[#111111]">
            РЕЗУЛЬТАТ ГОТОВ
          </h1>

          <p className="text-base sm:text-lg text-[#111111] mb-8">
            Экзамен завершён. Осталось отправить результат в Администрацию Ничегонии.
          </p>

          <div className="
            bg-[#F7F6F3]
            border
            border-gray-200
            rounded-2xl
            p-4
          sm:p-6
            text-left
            mb-5
            sm:mb-8
          ">
            <p className="text-gray-500 text-sm mb-1">
              ФИО
            </p>
            <p className="text-xl sm:text-2xl font-black mb-5">
              {fullName}
            </p>

            <p className="text-gray-500 text-sm mb-1">
              Страна
            </p>
            <p className="text-xl sm:text-2xl font-black mb-5">
              {country}
            </p>

            <p className="text-gray-500 text-sm mb-1">
              Количество ответов
            </p>
            <p className="text-xl sm:text-2xl font-black">
              {completedAnswers.length || userAnswers.length}
            </p>
          </div>

          <button
            onClick={submitApplication}
            disabled={isSubmitting}
            className="
              w-full
              bg-[#111111]
              text-white
              py-3
            sm:py-4
              rounded-xl
              font-black
              hover:opacity-90
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? "Отправляем..." : "Отправить результат"}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            После нажатия заявка отправится только один раз.
          </p>
        </div>
      </main>
    );
  }

  if (started) {
    return (
      <main className="min-h-[100dvh] bg-[#F7F6F3] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-10 max-w-3xl w-full text-[#111111]">
          <p className="text-sm mb-4 text-[#111111] font-semibold">
            {secretQuestion
              ? "Секретный вопрос"
              : `Вопрос ${currentQuestion + 1} из 9`}
          </p>

          <div className="w-full bg-gray-200 h-3 rounded-full mb-8">
            <div
              className="bg-[#111111] h-3 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / 9) * 100}%`
              }}
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[#111111]">
            {question.question}
          </h2>

          <div className="space-y-4">
            {shuffledAnswers.map((answer) => (
              <button
                key={answer}
                onClick={() => {
                  const updatedAnswers = [
                    ...userAnswers,
                    {
                      question: question.question,
                      answer: answer
                    }
                  ];

                  setUserAnswers(updatedAnswers);

                  if (
                    currentQuestion === 8 &&
                    answer === "Нет"
                  ) {
                    window.open(
                      "https://youtube.com/@welqwshow",
                      "_blank"
                    );
                    return;
                  }

                  if (currentQuestion === 8) {
                    setCompletedAnswers(updatedAnswers);
                    setTestCompleted(true);
                    return;
                  }

                  if (secretQuestion) {
                    setSecretQuestion(null);
                    setSecretUsed(false);
                    setCurrentQuestion(currentQuestion + 1);
                    return;
                  }

                  if (
                    !secretUsed &&
                    currentQuestion < 8 &&
                    Math.random() < 0.1
                  ) {
                    const randomSecret =
                      secretQuestions[
                        Math.floor(
                          Math.random() * secretQuestions.length
                        )
                      ];

                    setSecretQuestion(randomSecret);
                    setSecretUsed(true);

                    return;
                  }

                  setCurrentQuestion(
                    currentQuestion + 1
                  );
                }}
                className="
                  w-full
                  text-left
                  border-2
                  border-gray-300
                  rounded-xl
                  p-4
          sm:p-5
                  bg-white
                  text-[#111111]
                  font-medium
                  hover:bg-gray-100
                  transition
                "
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#F7F6F3] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-12 max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-6">
          Экзамен на гражданство Ничегонии
        </h1>

        <p className="text-base sm:text-lg text-[#111111] mb-4">
          Для получения гражданства необходимо пройти
          официальный государственный экзамен.
        </p>

        <p className="text-lg sm:text-xl text-[#111111] italic mb-8">
          Провалить экзамен невозможно.
        </p>

        <p className="text-base sm:text-lg text-[#111111] mb-4">
          Но это не точно.
        </p>

        <div className="space-y-5 text-left">
          <div>
            <label className="block mb-2 font-semibold text-black">
              ФИО
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`
                w-full
                border-2
                rounded-lg
                p-3
                bg-white
                text-black
                ${
                  showError && !fullName.trim()
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-black">
              Возраст
            </label>

            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`
                w-full
                border-2
                rounded-lg
                p-3
                bg-white
                text-black
                ${
                  showError && !age.trim()
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-black">
              Страна проживания
            </label>

            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`
                w-full
                border-2
                rounded-lg
                p-3
                bg-white
                text-black
                ${
                  showError && !country.trim()
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-black">
              Почему вы хотите стать гражданином Ничегонии?
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className={`
                w-full
                border-2
                rounded-lg
                p-3
                bg-white
                text-black
                ${
                  showError && !reason.trim()
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-black">
              Фото для паспорта
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setPhotoFile(file);
                }
              }}
              className="
                w-full
                border-2
                border-gray-300
                rounded-lg
                p-3
                bg-white
                text-black
              "
            />

            {photoFile && (
              <p className="text-sm text-green-700 font-semibold mt-2">
                Фото выбрано: {photoFile.name}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Это фото будет отображаться в паспорте гражданина Ничегонии.
            </p>
          </div>

          {showError && (
            <div className="
              bg-red-50
              border
              border-red-300
              text-red-700
              rounded-xl
              p-4
              text-center
              font-medium
            ">
              Пожалуйста, заполните все поля анкеты и выберите фото
            </div>
          )}

          <button
            onClick={() => {
              if (
                !fullName.trim() ||
                !age ||
                !country.trim() ||
                !reason.trim() ||
                !photoFile
              ) {
                setShowError(true);
                return;
              }

              setShowError(false);
              setUserAnswers([]);
              setCompletedAnswers([]);
              setCurrentQuestion(0);
              setSecretQuestion(null);
              setSecretUsed(false);
              setTestCompleted(false);
              submitStartedRef.current = false;
              setIsSubmitting(false);
              localStorage.removeItem("nichogonia-test");
              setStarted(true);
            }}
            className="
              w-full
              bg-[#111111]
              text-white
              py-3
            sm:py-4
              rounded-lg
              font-semibold
            "
          >
            ПРОДОЛЖИТЬ
          </button>
        </div>
      </div>
    </main>
  );
}
