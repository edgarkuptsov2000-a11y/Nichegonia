"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Achievement,
  ExamAnswer,
  ExamQuestion,
  achievements,
  calculateScore,
  getRandomQuestions,
  getRandomSecretQuestion,
  getRandomUltraSecretQuestion,
  getTitle,
  getVerdict,
  shuffleArray,
} from "@/lib/exam";

type ExamStage = "form" | "exam" | "result" | "submitted";

const TOTAL_QUESTIONS = 15;
const QUESTION_TIME_LIMIT = 90;
const MAX_SECRETS = 3;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getSecretChance(
  questionIndex: number,
  answerChanges: number,
  timeSpent: number
) {
  let chance = 0;

  if (questionIndex >= 3) chance += 0.05;
  if (questionIndex >= 7) chance += 0.1;
  if (questionIndex >= 11) chance += 0.15;

  if (answerChanges >= 3) chance += 0.08;
  if (timeSpent > 45) chance += 0.05;

  return Math.min(chance, 0.35);
}

function buildAchievements(
  finalAnswers: ExamAnswer[],
  finalScore: number,
  finalSeconds: number,
  finalChanges: number
): Achievement[] {
  const ids = new Set<string>();

  ids.add("citizen");
  ids.add("nothing");

  if (finalScore === 100) {
    ids.add("perfect");
  }

  if (finalSeconds < 60) {
    ids.add("speed");
  }

  const secretAnswers = finalAnswers.filter(
    (answer) =>
      answer.type === "secret" || answer.type === "ultra-secret"
  );

  if (secretAnswers.length >= 1) {
    ids.add("observant");
  }

  if (secretAnswers.length >= 2) {
    ids.add("archivist");
  }

  if (
    secretAnswers.some(
      (answer) => answer.type === "ultra-secret"
    )
  ) {
    ids.add("ultra");
  }

  if (finalChanges >= 5) {
    ids.add("indecisive");
  }

  if (
    finalAnswers.some(
      (answer) => answer.timeSpent >= 60
    )
  ) {
    ids.add("patient");
  }

  if (
    finalAnswers.some(
      (answer) =>
        answer.category === "Конституция" && answer.isCorrect
    )
  ) {
    ids.add("constitution");
  }

  return achievements.filter((achievement) =>
    ids.has(achievement.id)
  );
}

export default function TestPage() {
  // -----------------------------
  // FORM
  // -----------------------------

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [reason, setReason] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // -----------------------------
  // EXAM
  // -----------------------------

  const [stage, setStage] = useState<ExamStage>("form");

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [secretQuestion, setSecretQuestion] =
    useState<ExamQuestion | null>(null);

  const [isUltraSecret, setIsUltraSecret] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  const [answerHistory, setAnswerHistory] = useState<ExamAnswer[]>([]);

  const [answerChanges, setAnswerChanges] = useState(0);
  const [secretsFound, setSecretsFound] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  const [score, setScore] = useState(0);
  const [title, setTitle] = useState("");
  const [verdict, setVerdict] = useState("");

  const [unlockedAchievements, setUnlockedAchievements] =
    useState<Achievement[]>([]);

  // -----------------------------
  // SUBMISSION
  // -----------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicationNumber, setSubmittedApplicationNumber] =
    useState("");
  const [submittedAccessCode, setSubmittedAccessCode] =
    useState("");

  const [error, setError] = useState("");

  // -----------------------------
  // REFS
  // -----------------------------

  const examStartedAt = useRef<number | null>(null);
  const questionStartedAt = useRef<number | null>(null);

  const submitStartedRef = useRef(false);

  // -----------------------------
  // CURRENT QUESTION
  // -----------------------------

  const activeQuestion = useMemo(() => {
    if (secretQuestion) {
      return secretQuestion;
    }

    return questions[currentQuestion] ?? null;
  }, [secretQuestion, questions, currentQuestion]);

  const isSecret = Boolean(secretQuestion);

  // -----------------------------
  // SHUFFLE ANSWERS
  // -----------------------------

  useEffect(() => {
    if (!activeQuestion) {
      setShuffledAnswers([]);
      return;
    }

    setShuffledAnswers(
      shuffleArray(activeQuestion.answers)
    );

    setSelectedAnswer("");
    setQuestionSeconds(0);

    questionStartedAt.current = Date.now();
  }, [activeQuestion?.id]);

  // -----------------------------
  // EXAM TIMER
  // -----------------------------

  useEffect(() => {
    if (stage !== "exam") {
      return;
    }

    const interval = window.setInterval(() => {
      if (examStartedAt.current) {
        const elapsed = Math.floor(
          (Date.now() - examStartedAt.current) / 1000
        );

        setTotalSeconds(elapsed);
      }

      if (questionStartedAt.current) {
        const elapsed = Math.floor(
          (Date.now() - questionStartedAt.current) / 1000
        );

        setQuestionSeconds(elapsed);
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [stage]);

  // -----------------------------
  // AUTO TIMEOUT
  // -----------------------------

  useEffect(() => {
    if (stage !== "exam") return;
    if (!activeQuestion) return;

    if (questionSeconds >= QUESTION_TIME_LIMIT) {
      confirmAnswer();
    }
  }, [questionSeconds]);

  // -----------------------------
  // START EXAM
  // -----------------------------

  function startExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Укажи полное имя.");
      return;
    }

    if (!age.trim()) {
      setError("Укажи возраст.");
      return;
    }

    if (!country.trim()) {
      setError("Укажи страну проживания.");
      return;
    }

    if (!reason.trim()) {
      setError("Напиши, зачем тебе гражданство Ничегонии.");
      return;
    }

    if (!photoFile) {
      setError("Загрузи фотографию.");
      return;
    }

    const generatedQuestions = getRandomQuestions(
      TOTAL_QUESTIONS
    );

    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setSecretQuestion(null);
    setIsUltraSecret(false);

    setSelectedAnswer("");
    setAnswerHistory([]);

    setAnswerChanges(0);
    setSecretsFound(0);

    setTotalSeconds(0);
    setQuestionSeconds(0);

    setScore(0);
    setTitle("");
    setVerdict("");
    setUnlockedAchievements([]);

    submitStartedRef.current = false;

    const now = Date.now();

    examStartedAt.current = now;
    questionStartedAt.current = now;

    setStage("exam");
  }

  // -----------------------------
  // SELECT ANSWER
  // -----------------------------

  function selectAnswer(answer: string) {
    if (selectedAnswer && selectedAnswer !== answer) {
      setAnswerChanges((previous) => previous + 1);
    }

    setSelectedAnswer(answer);
  }

  // -----------------------------
  // FINISH EXAM
  // -----------------------------

  function finishExam(finalAnswers: ExamAnswer[]) {
    const actualTotalSeconds = examStartedAt.current
      ? Math.floor(
          (Date.now() - examStartedAt.current) / 1000
        )
      : totalSeconds;

    const finalScore = calculateScore(finalAnswers);
    const finalTitle = getTitle(finalScore);
    const finalVerdict = getVerdict(finalScore);

    const finalAchievements = buildAchievements(
      finalAnswers,
      finalScore,
      actualTotalSeconds,
      answerChanges
    );

    setTotalSeconds(actualTotalSeconds);
    setScore(finalScore);
    setTitle(finalTitle);
    setVerdict(finalVerdict);
    setUnlockedAchievements(finalAchievements);

    try {
      localStorage.setItem(
        "nichogonia-exam-v2",
        JSON.stringify({
          score: finalScore,
          title: finalTitle,
          verdict: finalVerdict,
          totalSeconds: actualTotalSeconds,
          answerChanges,
          secretsFound,
          achievements: finalAchievements.map(
            (achievement) => achievement.id
          ),
        })
      );
    } catch {
      // localStorage не должен ломать экзамен
    }

    setStage("result");
  }

  // -----------------------------
  // AFTER REGULAR QUESTION
  // -----------------------------

  function continueAfterRegularAnswer(
    newAnswer: ExamAnswer
  ) {
    const nextAnswers = [
      ...answerHistory,
      newAnswer,
    ];

    const timeSpent = newAnswer.timeSpent;

    const chance = getSecretChance(
      currentQuestion,
      answerChanges,
      timeSpent
    );

    const canFindSecret =
      secretsFound < MAX_SECRETS;

    const shouldShowSecret =
      canFindSecret && Math.random() < chance;

    // Важно:
    // обычный вопрос уже считается пройденным.
    const nextQuestionIndex = currentQuestion + 1;

    setCurrentQuestion(nextQuestionIndex);

    if (shouldShowSecret) {
      const ultraChance =
        currentQuestion >= 8 ? 0.05 : 0.015;

      const ultra =
        Math.random() < ultraChance;

      const generatedSecret = ultra
        ? getRandomUltraSecretQuestion()
        : getRandomSecretQuestion();

      setSecretQuestion(generatedSecret);
      setIsUltraSecret(ultra);

      setAnswerHistory(nextAnswers);
      setQuestionSeconds(0);

      questionStartedAt.current = Date.now();

      return;
    }

    setAnswerHistory(nextAnswers);

    if (nextQuestionIndex >= questions.length) {
      finishExam(nextAnswers);
      return;
    }

    setQuestionSeconds(0);
    questionStartedAt.current = Date.now();
  }

  // -----------------------------
  // CONFIRM ANSWER
  // -----------------------------

  function confirmAnswer() {
    if (!activeQuestion) return;

    const currentTime = questionStartedAt.current
      ? Math.floor(
          (Date.now() - questionStartedAt.current) / 1000
        )
      : questionSeconds;

    const isCorrect =
      selectedAnswer === activeQuestion.correctAnswer;

    const previousAnswer = answerHistory.find(
      (item) =>
        item.questionId === activeQuestion.id
    );

    const changed =
      previousAnswer !== undefined &&
      previousAnswer.answer !== selectedAnswer;

    const newAnswer: ExamAnswer = {
      questionId: activeQuestion.id,
      question: activeQuestion.question,
      type: activeQuestion.type,
      category: activeQuestion.category,

      answer: selectedAnswer,
      correctAnswer: activeQuestion.correctAnswer,

      isCorrect,
      points: isCorrect
        ? activeQuestion.points
        : 0,

      changed,
      timeSpent: currentTime,
    };

    // -----------------------------
    // SECRET QUESTION
    // -----------------------------

    if (secretQuestion) {
      const nextAnswers = [
        ...answerHistory,
        newAnswer,
      ];

      setAnswerHistory(nextAnswers);
      setSecretsFound(
        (previous) => previous + 1
      );

      setSecretQuestion(null);
      setIsUltraSecret(false);

      setSelectedAnswer("");
      setQuestionSeconds(0);

      questionStartedAt.current = Date.now();

      if (currentQuestion >= questions.length) {
        finishExam(nextAnswers);
      }

      return;
    }

    // -----------------------------
    // REGULAR QUESTION
    // -----------------------------

    continueAfterRegularAnswer(newAnswer);
  }

  // -----------------------------
  // PHOTO
  // -----------------------------

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
  }

  // -----------------------------
  // SUBMIT APPLICATION
  // -----------------------------

  async function submitApplication() {
    if (submitStartedRef.current) return;

    submitStartedRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("age", age);
      formData.append("country", country);
      formData.append("reason", reason);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      formData.append("examVersion", "2");
      formData.append("score", String(score));
      formData.append("title", title);
      formData.append("verdict", verdict);

      formData.append(
        "correctAnswers",
        String(
          answerHistory.filter(
            (answer) => answer.isCorrect
          ).length
        )
      );

      formData.append(
        "totalQuestions",
        String(answerHistory.length)
      );

      formData.append(
        "totalSeconds",
        String(totalSeconds)
      );

      formData.append(
        "answerChanges",
        String(answerChanges)
      );

      formData.append(
        "secretsFound",
        String(secretsFound)
      );

      formData.append(
        "achievements",
        JSON.stringify(
          unlockedAchievements.map(
            (achievement) => achievement.id
          )
        )
      );

      formData.append(
        "answers",
        JSON.stringify(answerHistory)
      );

      const response = await fetch(
        "/api/applications/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Не удалось отправить заявление."
        );
      }

      setSubmittedApplicationNumber(
        data.applicationNumber || ""
      );

      setSubmittedAccessCode(
        data.accessCode || ""
      );

      setStage("submitted");
    } catch (submitError) {
      submitStartedRef.current = false;

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Произошла неизвестная ошибка."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // -----------------------------
  // FORM
  // -----------------------------

  if (stage === "form") {
    return (
      <main className="min-h-screen bg-[#111111] text-[#F7F6F3]">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-20">
          <div className="mb-12 border-b border-[#C9A646]/30 pb-8">
            <div className="mb-3 text-xs font-semibold tracking-[0.35em] text-[#C9A646]">
              ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Гражданство
              <br />
              Ничегонии
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Перед получением гражданства необходимо пройти
              официальный экзамен. Государство проверит,
              достаточно ли хорошо ты ничего не делаешь.
            </p>
          </div>

          <form
            onSubmit={startExam}
            className="grid gap-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A646]">
                  Полное имя
                </span>

                <input
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Например, Пупка Пупкин"
                  className="w-full border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[#C9A646]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A646]">
                  Возраст
                </span>

                <input
                  value={age}
                  onChange={(event) =>
                    setAge(event.target.value)
                  }
                  type="number"
                  min="1"
                  max="120"
                  placeholder="19"
                  className="w-full border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[#C9A646]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A646]">
                Страна проживания
              </span>

              <input
                value={country}
                onChange={(event) =>
                  setCountry(event.target.value)
                }
                placeholder="Россия"
                className="w-full border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[#C9A646]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A646]">
                Зачем тебе гражданство Ничегонии?
              </span>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={5}
                placeholder="Расскажи государству о своих намерениях..."
                className="w-full resize-none border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[#C9A646]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A646]">
                Фотография
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60 file:mr-4 file:border-0 file:bg-[#C9A646] file:px-4 file:py-2 file:font-semibold file:text-[#111111]"
              />
            </label>

            {error && (
              <div className="border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 bg-[#C9A646] px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#111111] transition hover:bg-[#D4AF37]"
            >
              Начать официальный экзамен
            </button>

            <p className="text-center text-xs text-white/30">
              После начала экзамена изменить данные анкеты будет невозможно.
            </p>
          </form>
        </div>
      </main>
    );
  }

  // -----------------------------
  // EXAM
  // -----------------------------

  if (stage === "exam" && activeQuestion) {
    const progress =
      ((currentQuestion +
        (secretQuestion ? 0 : 1)) /
        TOTAL_QUESTIONS) *
      100;

    return (
      <main className="min-h-screen bg-[#F7F6F3] text-[#111111]">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-10">
          {/* HEADER */}

          <div className="mb-8 flex items-end justify-between gap-5 border-b border-black/10 pb-6">
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] text-[#C9A646]">
                ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ
              </div>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Официальный экзамен
              </h1>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                Время
              </div>

              <div className="font-mono text-xl font-bold">
                {formatTime(totalSeconds)}
              </div>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.15em] text-black/40">
              <span>
                {secretQuestion
                  ? "Секретный вопрос"
                  : `Вопрос ${Math.min(
                      currentQuestion + 1,
                      TOTAL_QUESTIONS
                    )} из ${TOTAL_QUESTIONS}`}
              </span>

              <span>
                {Math.round(
                  Math.min(progress, 100)
                )}
                %
              </span>
            </div>

            <div className="h-1 bg-black/10">
              <div
                className="h-full bg-[#C9A646] transition-all duration-300"
                style={{
                  width: `${Math.min(
                    progress,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* SECRET BANNER */}

          {secretQuestion && (
            <div
              className={`mb-6 border px-5 py-4 ${
                isUltraSecret
                  ? "border-black bg-[#111111] text-[#C9A646]"
                  : "border-[#C9A646] bg-[#C9A646]/10"
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em]">
                {isUltraSecret
                  ? "⚠ ULTRA-SECRET"
                  : "Секретный вопрос"}
              </div>

              <div className="mt-1 text-sm">
                Ты нашёл то, чего здесь вообще не должно было быть.
              </div>
            </div>
          )}

          {/* QUESTION CARD */}

          <section className="border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
            <div className="mb-8 flex items-center justify-between gap-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                  Категория
                </div>

                <div className="mt-1 text-sm font-bold">
                  {activeQuestion.category}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                  Время вопроса
                </div>

                <div
                  className={`font-mono text-lg font-bold ${
                    questionSeconds >= 70
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {formatTime(questionSeconds)}
                </div>
              </div>
            </div>

            <h2 className="max-w-3xl text-2xl font-black leading-tight sm:text-4xl">
              {activeQuestion.question}
            </h2>

            <div className="mt-10 grid gap-3">
              {shuffledAnswers.map(
                (answer, index) => {
                  const selected =
                    selectedAnswer === answer;

                  return (
                    <button
                      key={answer}
                      type="button"
                      onClick={() =>
                        selectAnswer(answer)
                      }
                      className={`flex w-full items-center gap-4 border p-4 text-left transition sm:p-5 ${
                        selected
                          ? "border-[#C9A646] bg-[#C9A646]/10"
                          : "border-black/10 bg-[#F7F6F3] hover:border-black/30"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border text-xs font-black ${
                          selected
                            ? "border-[#C9A646] bg-[#C9A646] text-[#111111]"
                            : "border-black/15"
                        }`}
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="font-medium">
                        {answer}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-black/40">
                {answerChanges > 0 && (
                  <>
                    Изменений ответа:{" "}
                    <strong>
                      {answerChanges}
                    </strong>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={confirmAnswer}
                disabled={!selectedAnswer}
                className="bg-[#111111] px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Подтвердить ответ
              </button>
            </div>
          </section>

          {/* FOOTER */}

          <div className="mt-6 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-black/25">
            <span>Ничегония • 2026</span>
            <span>
              Секретов найдено: {secretsFound}
            </span>
          </div>
        </div>
      </main>
    );
  }

  // -----------------------------
  // RESULT
  // -----------------------------

  if (stage === "result") {
    const correctAnswers = answerHistory.filter(
      (answer) => answer.isCorrect
    ).length;

    return (
      <main className="min-h-screen bg-[#111111] text-[#F7F6F3]">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-20">
          <div className="border-b border-[#C9A646]/30 pb-10">
            <div className="text-xs font-bold tracking-[0.35em] text-[#C9A646]">
              ЭКЗАМЕН ЗАВЕРШЁН
            </div>

            <h1 className="mt-4 text-4xl font-black sm:text-6xl">
              Результат
            </h1>
          </div>

          <div className="grid gap-6 py-10 sm:grid-cols-3">
            <div className="border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                Результат
              </div>

              <div className="mt-3 text-5xl font-black text-[#C9A646]">
                {score}
              </div>

              <div className="mt-1 text-xs text-white/35">
                из 100
              </div>
            </div>

            <div className="border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                Правильных ответов
              </div>

              <div className="mt-3 text-5xl font-black">
                {correctAnswers}
              </div>

              <div className="mt-1 text-xs text-white/35">
                из {answerHistory.length}
              </div>
            </div>

            <div className="border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                Время
              </div>

              <div className="mt-3 text-5xl font-black">
                {formatTime(totalSeconds)}
              </div>
            </div>
          </div>

          <section className="border border-[#C9A646]/40 bg-[#C9A646]/5 p-8 sm:p-10">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A646]">
              Твой официальный статус
            </div>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
              {verdict}
            </p>
          </section>

          {/* ACHIEVEMENTS */}

          <section className="mt-8">
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#C9A646]">
              Полученные достижения
            </div>

            {unlockedAchievements.length === 0 ? (
              <div className="border border-white/10 p-6 text-sm text-white/40">
                Государство пока не смогло придумать тебе достижение.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {unlockedAchievements.map(
                  (achievement) => (
                    <div
                      key={achievement.id}
                      className="border border-white/10 p-5"
                    >
                      <div className="font-bold">
                        {achievement.title}
                      </div>

                      <div className="mt-1 text-sm text-white/40">
                        {achievement.description}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {error && (
            <div className="mt-8 border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={submitApplication}
            disabled={isSubmitting}
            className="mt-10 w-full bg-[#C9A646] px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#111111] transition hover:bg-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Отправляем заявление..."
              : "Подать заявление на гражданство"}
          </button>

          <p className="mt-4 text-center text-xs text-white/25">
            Результат экзамена будет приложен к заявлению.
          </p>
        </div>
      </main>
    );
  }

  // -----------------------------
  // SUBMITTED
  // -----------------------------

  return (
    <main className="min-h-screen bg-[#111111] text-[#F7F6F3]">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-12">
        <div className="w-full border border-[#C9A646]/40 bg-[#F7F6F3] p-8 text-[#111111] sm:p-12">
          <div className="text-xs font-bold tracking-[0.3em] text-[#C9A646]">
            ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ
          </div>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            Заявление принято.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
            Государство официально получило твоё заявление.
            Теперь остаётся дождаться решения комиссии.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="border border-black/10 p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                Номер заявления
              </div>

              <div className="mt-3 font-mono text-2xl font-black">
                {submittedApplicationNumber ||
                  "НЧ-ОЖИДАНИЕ"}
              </div>
            </div>

            <div className="border border-black/10 p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                Код доступа
              </div>

              <div className="mt-3 font-mono text-2xl font-black">
                {submittedAccessCode ||
                  "ОЖИДАНИЕ"}
              </div>
            </div>
          </div>

          <div className="mt-8 border border-[#C9A646]/40 bg-[#C9A646]/10 p-6">
            <div className="font-bold">
              Сохрани номер заявления и код доступа.
            </div>

            <div className="mt-2 text-sm leading-6 text-black/55">
              Они понадобятся для входа в личный кабинет
              и просмотра статуса заявления.
            </div>
          </div>

          <a
            href="/cabinet"
            className="mt-8 block bg-[#111111] px-8 py-5 text-center text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
          >
            Перейти в личный кабинет
          </a>
        </div>
      </div>
    </main>
  );
}