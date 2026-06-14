"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Неверный пароль.");
      return;
    }

    window.location.href = "/admin";
  }

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
        max-w-md
        w-full
        rounded-3xl
        shadow-2xl
        p-10
        border
        border-gray-200
      ">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            🔐
          </div>

          <h1 className="
            text-4xl
            font-black
            mb-3
          ">
            Вход в админку
          </h1>

          <p className="text-gray-600">
            Центр управления Ничегонией
          </p>
        </div>

        <label className="
          block
          mb-2
          font-semibold
        ">
          Пароль администратора
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          placeholder="Введите пароль"
          className="
            w-full
            border-2
            border-gray-300
            rounded-xl
            p-4
            mb-5
            bg-white
            text-[#111111]
            placeholder:text-gray-400
            outline-none
            focus:border-[#111111]
          "
        />

        {error && (
          <div className="
            bg-red-50
            border
            border-red-300
            text-red-700
            rounded-xl
            p-4
            mb-5
            text-center
            font-semibold
          ">
            {error}
          </div>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="
            w-full
            bg-[#111111]
            text-white
            py-4
            rounded-xl
            font-black
            hover:opacity-90
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Проверяем..." : "Войти"}
        </button>

        <a
          href="/"
          className="
            block
            text-center
            mt-5
            text-gray-600
            hover:text-[#111111]
            transition
          "
        >
          Вернуться на главную
        </a>
      </div>
    </main>
  );
}