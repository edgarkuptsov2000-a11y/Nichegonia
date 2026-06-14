"use client";
import { useState, useEffect } from "react";

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

export default function TestPage() {

const [showError, setShowError] = useState(false);    

const [started, setStarted] = useState(false);
const [fullName, setFullName] = useState("");
const [age, setAge] = useState("");
const [country, setCountry] = useState("");
const [reason, setReason] = useState("");
const [photoFile, setPhotoFile] = useState<File | null>(null);
const [currentQuestion, setCurrentQuestion] = useState(0);
type SecretQuestion = {
  question: string;
  answers: string[];
};

const [secretQuestion, setSecretQuestion] = useState<SecretQuestion | null>(null);
const [secretUsed, setSecretUsed] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [submittedApplicationNumber, setSubmittedApplicationNumber] = useState("");
const [submittedAccessCode, setSubmittedAccessCode] = useState("");

const [userAnswers, setUserAnswers] = useState<
  {
    question: string;
    answer: string;
  }[]
>([]);

useEffect(() => {
  const savedData = localStorage.getItem("nichogonia-test");

  if (savedData) {
    const data = JSON.parse(savedData);

    setStarted(data.started || false);
    setCurrentQuestion(data.currentQuestion || 0);

    setFullName(data.fullName || "");
    setAge(data.age || "");
    setCountry(data.country || "");
    setReason(data.reason || "");
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "nichogonia-test",
    JSON.stringify({
      started,
      currentQuestion,
      fullName,
      age,
      country,
      reason
    })
  );
}, [
  started,
  currentQuestion,
  fullName,
  age,
  country,
  reason
]);

const question = secretQuestion || questions[currentQuestion];

const shuffledAnswers = [...question.answers].sort(
  () => Math.random() - 0.5
);

if (submitted) {
  const savedApplicationNumber =
    typeof window !== "undefined"
      ? localStorage.getItem("application_number")
      : "";

  const savedAccessCode =
    typeof window !== "undefined"
      ? localStorage.getItem("access_code")
      : "";

  return (
    <main className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">
      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        p-12
        max-w-2xl
        w-full
        text-center
        border
      ">

        <div className="
          w-24
          h-24
          mx-auto
          mb-8
          rounded-full
          bg-green-100
          flex
          items-center
          justify-center
          text-5xl
        ">
          ✓
        </div>

        <h1 className="text-5xl font-bold mb-6 text-[#111111]">
          ЗАЯВКА ОТПРАВЛЕНА
        </h1>

        <p className="text-lg text-[#111111] mb-4">
          Ваше заявление принято Администрацией Президента Ничегонии.
        </p>

        <p className="text-lg text-[#111111] mb-8">
          Ожидайте решения по вашему запросу.
        </p>

        <div className="
  grid
  grid-cols-1
  sm:grid-cols-3
  gap-4
  mb-8
">

  <div className="
    bg-[#F7F6F3]
    border
    border-gray-200
    rounded-2xl
    p-5
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
      text-xl
      font-black
      text-[#111111]
      break-all
    ">
      {submittedApplicationNumber || savedApplicationNumber || "Не создан"}
    </p>
  </div>

  <div className="
    bg-[#F7F6F3]
    border
    border-gray-200
    rounded-2xl
    p-5
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
      text-xl
      font-black
      text-[#111111]
      break-all
    ">
      {submittedAccessCode || savedAccessCode || "Не создан"}
    </p>
  </div>

  <div className="
    bg-yellow-50
    border
    border-yellow-200
    rounded-2xl
    p-5
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
      text-xl
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
            py-4
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

if (started) {
  return (
    <main className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">

      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl w-full text-[#111111]">

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

        <h2 className="text-3xl font-bold mb-8 text-[#111111]">
          {question.question}
        </h2>

        <div className="space-y-4">

          {shuffledAnswers.map((answer) => (
            <button
              key={answer}
              onClick={async () => {
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
  const formData = new FormData();

  formData.append("fullName", fullName);
  formData.append("age", age);
  formData.append("country", country);
  formData.append("reason", reason);
  formData.append("answers", JSON.stringify(updatedAnswers));

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
    return;
  }

  const applicationNumber = result.applicationNumber;
  const accessCode = result.accessCode;

  localStorage.setItem("application_number", applicationNumber);
  localStorage.setItem("access_code", accessCode);

  setSubmittedApplicationNumber(applicationNumber);
  setSubmittedAccessCode(accessCode);

  localStorage.removeItem("nichogonia-test");
  setSubmitted(true);
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
  p-5
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
    <main className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">

      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl text-center">

        <h1 className="text-4xl font-bold text-[#111111] mb-6">
          Экзамен на гражданство Ничегонии
        </h1>

        <p className="text-lg text-[#111111] mb-4">
          Для получения гражданства необходимо пройти
          официальный государственный экзамен.
        </p>

        <p className="text-xl text-[#111111] italic mb-8">
          Провалить экзамен невозможно.
        </p>

        <p className="text-lg text-[#111111] mb-4">
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
    onClick={async () => {

if (
  !fullName.trim() ||
  !age ||
  !country.trim() ||
  !reason.trim() ||
  !photoFile
){
  setShowError(true);
  return;
}

      setStarted(true);
    }}
    className="
      w-full
      bg-[#111111]
      text-white
      py-4
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