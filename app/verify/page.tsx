"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showConstitution, setShowConstitution] = useState(false);
  return (
    <main className="min-h-[100dvh] bg-[#F7F6F3] text-[#111111] overflow-x-hidden">

      {/* Главный экран */}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20 text-center">

        <Image
          src="/coat-of-arms.png"
          alt="Герб Ничегонии"
          width={260}
          height={260}
          className="w-40 sm:w-[260px] h-auto mx-auto mb-8 sm:mb-10"
          priority
        />

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide leading-tight">
          ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
          <br />
          НИЧЕГОНИЯ
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-xl text-gray-700">
          Официальный портал получения гражданства
        </p>

        <p className="mt-6 sm:mt-8 text-xl sm:text-2xl italic">
          «Ничего. Но стабильно.»
        </p>

        <a
  href="/test"
  className="
    inline-flex
    w-full
    sm:w-auto
    justify-center
    mt-8
    sm:mt-10
    bg-[#111111]
    text-white
    px-6
    sm:px-10
    py-4
    sm:py-5
    rounded-lg
    text-base
    sm:text-lg
    font-semibold
    hover:opacity-90
    transition
  "
>
  ПОЛУЧИТЬ ГРАЖДАНСТВО
</a>

<div className="flex flex-col items-center gap-4 mt-10">

  <a
    href="/cabinet"
    className="
      inline-flex
      w-full
      sm:w-auto
      justify-center
      border-2
      border-[#111111]
      text-[#111111]
      px-6
      sm:px-10
      py-4
      rounded-lg
      text-base
      sm:text-lg
      font-semibold
      hover:bg-[#111111]
      hover:text-white
      transition
    "
  >
    ЛИЧНЫЙ КАБИНЕТ
  </a>

  <a
    href="/first-union"
    className="
      inline-flex
      w-full
      sm:w-auto
      justify-center
      border-2
      border-[#C9A646]
      bg-gradient-to-r
      from-[#FFF7D6]
      via-[#F6E7A9]
      to-[#E7C85D]
      text-[#111111]
      px-6
      sm:px-10
      py-4
      rounded-lg
      text-base
      sm:text-lg
      font-black
      shadow-lg
      hover:shadow-xl
      hover:-translate-y-0.5
      transition
    "
  >
    👑 Ничегошки Первого Союза
  </a>

</div>

<p className="mt-5 text-sm text-gray-600">
  С 2026 года открыта регистрация новых ничегошек.
</p>

      </section>

      {/* Флаг */}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <Image
            src="/flag.png"
            alt="Флаг Ничегонии"
            width={1600}
            height={900}
            className="w-full"
          />

          <div className="p-5 sm:p-8">

            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Государственный флаг Ничегонии
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Государственный флаг Федеральной Республики
              Ничегония является официальным символом
              государства и отражает основные ценности
              ничегошек: стабильность, спокойствие и
              уважение к отдыху.
            </p>

          </div>

        </div>

      </section>

      {/* Информация о стране */}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <h3 className="font-bold text-lg mb-2">
              Столица
            </h3>
            <p>Новая Ничегония</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <h3 className="font-bold text-lg mb-2">
              Валюта
            </h3>
            <p>Нич</p>
            <p className="text-sm text-gray-600">
              1 Нич = 100 Ничеек
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <h3 className="font-bold text-lg mb-2">
              Граждане
            </h3>
            <p>Ничегошки</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <h3 className="font-bold text-lg mb-2">
              Государственный девиз
            </h3>
            <p>Ничего. Но стабильно.</p>
          </div>

        </div>

      </section>

      {/* Конституция */}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-10">

          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10">
            Конституция Ничегонии
          </h2>

          <div className="space-y-8">

            <div>
              <h3 className="font-bold mb-2">
                Статья 3.
              </h3>

              <p>
                Если отдых не помог,
                гражданину предоставляется
                дополнительный отдых.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                Статья 4.
              </h3>

              <p>
                Ничегометр всегда прав.
              </p>
            </div>

            <div>
  <h3 className="font-bold mb-2">
    Статья 6.
  </h3>

  <p>
    Если Ничегометр не прав,
    необходимо обратиться к статье 5.
  </p>
</div>

<div>
  <h3 className="font-bold mb-2">
    Статья 24.
  </h3>

  <p>
    Для получения гражданства необходимо пройти
    официальный тест Ничегонии.
  </p>
</div>

          </div>

          <button
  onClick={() => setShowConstitution(true)}
  className="
    w-full
    sm:w-auto
    mt-8
    sm:mt-10
    border-2
    border-[#111111]
    px-6
    sm:px-8
    py-4
    rounded-lg
    hover:bg-[#111111]
    hover:text-white
    transition
  "
>
  
  Читать Конституцию полностью
</button>



        </div>

      </section>

      {showConstitution && (
  <div className="fixed inset-0 z-50">

    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowConstitution(false)}
    />

    <div className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-1/2
      w-[94%]
      sm:w-[95%]
      max-w-4xl
      h-[85dvh]
      sm:h-[80vh]
      bg-white
      rounded-2xl
      shadow-2xl
      overflow-hidden
    ">

      <div className="flex justify-between items-center gap-4 border-b p-4 sm:p-6">

        <h2 className="text-xl sm:text-3xl font-bold">
          Конституция Ничегонии
        </h2>

        <button
          onClick={() => setShowConstitution(false)}
          className="text-2xl"
        >
          ✕
        </button>

      </div>

      <div className="overflow-y-auto h-[calc(85dvh-76px)] sm:h-[calc(80vh-90px)] p-4 sm:p-8 space-y-5 text-sm sm:text-base leading-relaxed">

        <p><strong>Статья 1.</strong> Федеральная Республика Ничегония является независимым, суверенным и мемным государством.</p>

        <p><strong>Статья 2.</strong> Единственным источником власти в Ничегонии являются ничегошки.</p>

        <p><strong>Статья 3.</strong> Каждый гражданин имеет право на отдых.</p>

        <p><strong>Статья 4.</strong> Если отдых не помог, гражданину предоставляется дополнительный отдых.</p>

        <p><strong>Статья 5.</strong> Ничегометр всегда прав.</p>

        <p><strong>Статья 6.</strong> Если Ничегометр не прав, необходимо обратиться к статье 5.</p>

        <p><strong>Статья 7.</strong> Каждый ничегошка имеет право отложить дело на потом.</p>

        <p><strong>Статья 8.</strong> Пятница официально считается маленькой субботой.</p>

        <p><strong>Статья 9.</strong> Каждый гражданин имеет право открыть холодильник и забыть, зачем его открыл.</p>

        <p><strong>Статья 10.</strong> Каждый гражданин имеет право сохранить мем на потом и никогда больше его не открыть.</p>

        <p><strong>Статья 11.</strong> Каждый ничегошка имеет право смотреть ещё одно видео перед сном независимо от времени суток.</p>

        <p><strong>Статья 12.</strong> Если гражданин сказал: «Я только на минутку зайду в интернет», государство не несёт ответственности за последствия.</p>

        <p><strong>Статья 13.</strong> Президент Ничегонии является гарантом стабильного ничего.</p>

        <p><strong>Статья 14.</strong> Все важные вопросы могут быть перенесены на завтра.</p>

        <p><strong>Статья 15.</strong> Если вопрос остаётся важным завтра, допускается его перенос на послезавтра.</p>

        <p><strong>Статья 16.</strong> В случае чрезвычайной ситуации гражданам рекомендуется собраться и обсудить её позже.</p>

        <p><strong>Статья 17.</strong> Если что-либо не работает, допускается сделать вид, что так и было задумано.</p>

        <p><strong>Статья 18.</strong> Запрещается работать слишком много, поскольку это создаёт нереалистичные ожидания у остальных граждан.</p>

        <p><strong>Статья 19.</strong> Если гражданин лёг на кровать в 15:00 и проснулся в 21:00, это считается официальным перемещением во времени.</p>

        <p><strong>Статья 20.</strong> Количество открытых вкладок в браузере не ограничивается Конституцией.</p>

        <p><strong>Статья 21.</strong> Каждый гражданин имеет право начать новую жизнь с понедельника.</p>

        <p><strong>Статья 22.</strong> Каждый гражданин имеет право перенести начало новой жизни на следующий понедельник.</p>

        <p><strong>Статья 23.</strong> Любой человек имеет право подать заявление на получение гражданства Ничегонии.</p>

        <p><strong>Статья 24.</strong> Для получения гражданства необходимо пройти официальный тест Ничегонии.</p>

        <p><strong>Статья 25.</strong> Провалить тест на гражданство невозможно.</p>

        <p><strong>Статья 26.</strong> Даже в случае провала теста гражданин может быть принят в Ничегонию.</p>

        <p><strong>Статья 27.</strong> После получения гражданства человеку присваивается почётный статус НИЧЕГОШКА.</p>

      </div>

    </div>

  </div>
)}

    </main>
  );
}