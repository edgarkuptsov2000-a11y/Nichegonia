"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showConstitution, setShowConstitution] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-[#F7F6F3] text-[#111111] overflow-x-hidden">

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <header className="border-b border-black/10 bg-[#F7F6F3]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between">

          <a href="/" className="flex items-center gap-3 group">
            <div className="
              w-10 h-10
              border border-[#C9A646]
              flex items-center justify-center
              text-[#C9A646]
              font-serif
              text-xl
              transition
              group-hover:bg-[#111111]
            ">
              Н
            </div>

            <div className="hidden sm:block">
              <p className="text-[10px] tracking-[0.28em] font-semibold text-gray-500">
                ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
              </p>

              <p className="text-sm font-bold tracking-[0.18em]">
                НИЧЕГОНИЯ
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.18em] font-semibold">
            <a
              href="#about"
              className="hover:text-[#9B7A20] transition"
            >
              О СТРАНЕ
            </a>

            <a
              href="/test"
              className="hover:text-[#9B7A20] transition"
            >
              ГРАЖДАНСТВО
            </a>

            <a
              href="/first-union"
              className="hover:text-[#9B7A20] transition"
            >
              НИЧЕГОШКИ
            </a>

            <a
              href="#documents"
              className="hover:text-[#9B7A20] transition"
            >
              ДОКУМЕНТЫ
            </a>
          </nav>

          <a
            href="/cabinet"
            className="
              bg-[#111111]
              text-white
              border border-[#111111]
              px-4 sm:px-5
              py-3
              text-[10px] sm:text-[11px]
              tracking-[0.14em]
              font-bold
              hover:bg-transparent
              hover:text-[#111111]
              transition
            "
          >
            ЛИЧНЫЙ КАБИНЕТ
          </a>

        </div>
      </header>


      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative min-h-[calc(100dvh-76px)] flex items-center overflow-hidden bg-[#111111] text-white">

        {/* декоративные элементы */}

        <div className="
          absolute
          -right-[180px]
          -top-[180px]
          w-[520px]
          h-[520px]
          rounded-full
          border
          border-[#C9A646]/20
        " />

        <div className="
          absolute
          -right-[130px]
          -top-[130px]
          w-[420px]
          h-[420px]
          rounded-full
          border
          border-[#C9A646]/10
        " />

        <div className="
          absolute
          right-[10%]
          bottom-[10%]
          w-40
          h-40
          rounded-full
          border
          border-white/5
        " />

        <div className="
          absolute
          inset-0
          opacity-[0.035]
          pointer-events-none
          bg-[linear-gradient(90deg,transparent_49%,#ffffff_50%,transparent_51%),linear-gradient(0deg,transparent_49%,#ffffff_50%,transparent_51%)]
          bg-[length:80px_80px]
        " />

        {/* большая Н на фоне */}

        <div className="
          absolute
          right-[3%]
          top-[3%]
          text-[clamp(280px,45vw,720px)]
          leading-none
          font-serif
          text-white/[0.025]
          select-none
          pointer-events-none
        ">
          Н
        </div>


        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 py-20 sm:py-28">

          <div className="max-w-5xl">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#C9A646]" />

              <p className="
                text-[#C9A646]
                text-[10px] sm:text-xs
                tracking-[0.35em]
                font-semibold
              ">
                ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
              </p>
            </div>


            <h1 className="
              font-serif
              text-[clamp(64px,13vw,190px)]
              leading-[0.78]
              tracking-[-0.04em]
              font-medium
              mb-10
            ">
              НИЧЕГОНИЯ
            </h1>


            <div className="
              grid
              grid-cols-1
              lg:grid-cols-[1fr_320px]
              gap-10
              items-end
            ">

              <div>

                <p className="
                  text-xl
                  sm:text-2xl
                  lg:text-3xl
                  font-serif
                  text-white/90
                  max-w-2xl
                  leading-tight
                ">
                  Государство, в котором
                  <br />
                  ничего не происходит.
                  <span className="text-[#C9A646]">
                    {" "}И это стабильно.
                  </span>
                </p>


                <div className="flex flex-col sm:flex-row gap-3 mt-9">

                  <a
                    href="/test"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      bg-[#C9A646]
                      text-[#111111]
                      px-7
                      py-4
                      text-xs
                      tracking-[0.18em]
                      font-bold
                      hover:bg-white
                      transition
                    "
                  >
                    СТАТЬ ГРАЖДАНИНОМ
                    <span className="ml-4 text-base">
                      →
                    </span>
                  </a>

                  <a
                    href="#about"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      border
                      border-white/30
                      text-white
                      px-7
                      py-4
                      text-xs
                      tracking-[0.18em]
                      font-semibold
                      hover:border-[#C9A646]
                      hover:text-[#C9A646]
                      transition
                    "
                  >
                    УЗНАТЬ БОЛЬШЕ
                  </a>

                </div>

              </div>


              <div className="border-l border-white/10 pl-7">

                <p className="text-[10px] tracking-[0.25em] text-white/40 mb-5">
                  ОФИЦИАЛЬНЫЕ ДАННЫЕ
                </p>

                <div className="space-y-5">

                  <div>
                    <p className="text-3xl font-serif">
                      2026
                    </p>

                    <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1">
                      ГОД ОСНОВАНИЯ
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-serif">
                      НОВАЯ НИЧЕГОНИЯ
                    </p>

                    <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1">
                      СТОЛИЦА
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* scroll */}

          <div className="
            absolute
            bottom-8
            left-5
            sm:left-8
            flex
            items-center
            gap-3
            text-white/30
            text-[9px]
            tracking-[0.25em]
          ">
            <span className="w-8 h-px bg-white/20" />
            SCROLL
          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* ABOUT */}
      {/* ========================================================= */}

      <section
        id="about"
        className="max-w-7xl mx-auto px-5 sm:px-8 py-24 sm:py-32"
      >

        <div className="
          grid
          lg:grid-cols-[0.8fr_1.2fr]
          gap-12
          lg:gap-24
          items-start
        ">

          <div>

            <p className="
              text-[10px]
              tracking-[0.3em]
              text-[#9B7A20]
              font-bold
              mb-5
            ">
              01 / О СТРАНЕ
            </p>

            <h2 className="
              font-serif
              text-5xl
              sm:text-6xl
              lg:text-7xl
              leading-[0.9]
            ">
              ЧТО ТАКОЕ
              <br />
              НИЧЕГОНИЯ?
            </h2>

          </div>


          <div>

            <p className="
              text-xl
              sm:text-2xl
              font-serif
              leading-relaxed
              mb-8
            ">
              Ничегония — небольшое государство,
              существование которого никто особенно
              не просил, но которое всё равно
              решило появиться.
            </p>


            <div className="
              grid
              sm:grid-cols-2
              gap-x-10
              gap-y-8
              border-t
              border-black/10
              pt-8
            ">

              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-2">
                  СТОЛИЦА
                </p>

                <p className="text-lg font-semibold">
                  Новая Ничегония
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-2">
                  ВАЛЮТА
                </p>

                <p className="text-lg font-semibold">
                  Нич
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  1 Нич = 100 Ничеек
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-2">
                  ГРАЖДАНЕ
                </p>

                <p className="text-lg font-semibold">
                  Ничегошки
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-2">
                  ДЕВИЗ
                </p>

                <p className="text-lg font-serif">
                  «Ничего. Но стабильно.»
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FLAG / SYMBOL */}
      {/* ========================================================= */}

      <section className="bg-[#111111] text-white py-20 sm:py-28">

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="
            grid
            lg:grid-cols-[1.15fr_0.85fr]
            gap-12
            lg:gap-20
            items-center
          ">

            <div className="relative">

              <div className="
                absolute
                -inset-4
                border
                border-[#C9A646]/20
                pointer-events-none
              " />

              <div className="relative overflow-hidden bg-[#F7F6F3]">

                <Image
                  src="/flag.png"
                  alt="Государственный флаг Ничегонии"
                  width={1600}
                  height={900}
                  className="w-full h-auto"
                />

              </div>

            </div>


            <div>

              <p className="
                text-[10px]
                tracking-[0.3em]
                text-[#C9A646]
                font-bold
                mb-5
              ">
                02 / ГОСУДАРСТВЕННЫЙ СИМВОЛ
              </p>

              <h2 className="
                font-serif
                text-5xl
                sm:text-6xl
                leading-[0.95]
                mb-7
              ">
                ФЛАГ
                <br />
                НИЧЕГОНИИ
              </h2>

              <p className="
                text-white/60
                leading-relaxed
                max-w-lg
                mb-8
              ">
                Государственный флаг Федеральной Республики
                Ничегония является официальным символом
                государства и отражает основные ценности
                ничегошек: стабильность, спокойствие
                и уважение к отдыху.
              </p>

              <div className="flex items-center gap-4">

                <div className="w-12 h-px bg-[#C9A646]" />

                <p className="
                  text-sm
                  font-serif
                  italic
                  text-white/80
                ">
                  Ничего. Но стабильно.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* EMBLEM / QUICK FACTS */}
      {/* ========================================================= */}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-20 text-center">

        <div className="
          grid
          lg:grid-cols-[0.7fr_1.3fr]
          gap-14
          items-center
        ">

          <div className="flex justify-center">

            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">

  <div className="absolute inset-0 rounded-full border border-[#C9A646]" />

  <div className="absolute inset-4 rounded-full border border-[#C9A646]/20" />

  <Image
    src="/coat-of-arms.png"
    alt="Герб Ничегонии"
    width={260}
    height={260}
    className="relative z-10 w-40 sm:w-48 h-auto"
  />

</div>

          </div>


          <div>

            <p className="
              text-[10px]
              tracking-[0.3em]
              text-[#9B7A20]
              font-bold
              mb-5
            ">
              03 / ОСНОВНЫЕ СВЕДЕНИЯ
            </p>

            <h2 className="
              font-serif
              text-5xl
              sm:text-6xl
              mb-10
            ">
              СТРАНА
              <br />
              В ЦИФРАХ
            </h2>


            <div className="
              grid
              grid-cols-2
              border-t
              border-l
              border-black/10
            ">

              <div className="
                p-6
                sm:p-8
                border-r
                border-b
                border-black/10
              ">
                <p className="text-4xl font-serif mb-2">
                  2026
                </p>

                <p className="text-[10px] tracking-[0.2em] text-gray-400">
                  ГОД ОСНОВАНИЯ
                </p>
              </div>


              <div className="
                p-6
                sm:p-8
                border-r
                border-b
                border-black/10
              ">
                <p className="text-4xl font-serif mb-2">
                  НИЧ
                </p>

                <p className="text-[10px] tracking-[0.2em] text-gray-400">
                  НАЦИОНАЛЬНАЯ ВАЛЮТА
                </p>
              </div>


              <div className="
                p-6
                sm:p-8
                border-r
                border-b
                border-black/10
              ">
                <p className="text-2xl sm:text-3xl font-serif mb-2">
                  НИЧЕГОШКИ
                </p>

                <p className="text-[10px] tracking-[0.2em] text-gray-400">
                  ГРАЖДАНЕ
                </p>
              </div>


              <div className="
                p-6
                sm:p-8
                border-r
                border-b
                border-black/10
              ">
                <p className="text-2xl sm:text-3xl font-serif mb-2">
                  НОВАЯ
                  <br />
                  НИЧЕГОНИЯ
                </p>

                <p className="text-[10px] tracking-[0.2em] text-gray-400">
                  СТОЛИЦА
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* CITIZENSHIP */}
      {/* ========================================================= */}

      <section className="bg-[#EDE9DF] py-24 sm:py-32">

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="
            grid
            lg:grid-cols-[1fr_0.8fr]
            gap-14
            items-center
          ">

            <div>

              <p className="
                text-[10px]
                tracking-[0.3em]
                text-[#9B7A20]
                font-bold
                mb-5
              ">
                04 / ГРАЖДАНСТВО
              </p>

              <h2 className="
                font-serif
                text-5xl
                sm:text-6xl
                lg:text-7xl
                leading-[0.9]
                mb-8
              ">
                СТАТЬ
                <br />
                НИЧЕГОШКОЙ
              </h2>

              <p className="
                text-lg
                sm:text-xl
                leading-relaxed
                text-gray-600
                max-w-xl
                mb-9
              ">
                Пройти официальный тест.
                Получить гражданство.
                Обрести стабильность.
              </p>

              <a
                href="/test"
                className="
                  inline-flex
                  items-center
                  bg-[#111111]
                  text-white
                  px-7
                  py-4
                  text-xs
                  tracking-[0.18em]
                  font-bold
                  hover:bg-[#C9A646]
                  hover:text-[#111111]
                  transition
                "
              >
                ПОДАТЬ ЗАЯВЛЕНИЕ
                <span className="ml-5 text-base">
                  →
                </span>
              </a>

            </div>


            <div className="
              bg-[#111111]
              text-white
              p-8
              sm:p-10
              relative
              overflow-hidden
            ">

              <div className="
                absolute
                right-[-50px]
                top-[-50px]
                w-40
                h-40
                rounded-full
                border
                border-[#C9A646]/20
              " />

              <p className="
                text-[10px]
                tracking-[0.25em]
                text-[#C9A646]
                mb-8
              ">
                ПРОЦЕДУРА
              </p>

              <div className="space-y-7">

                <div className="flex gap-5">

                  <span className="
                    text-[#C9A646]
                    font-serif
                    text-2xl
                  ">
                    01
                  </span>

                  <div>
                    <p className="font-semibold mb-1">
                      Заявление
                    </p>

                    <p className="text-sm text-white/45">
                      Расскажите немного о себе.
                    </p>
                  </div>

                </div>


                <div className="w-px h-5 bg-white/10 ml-3" />


                <div className="flex gap-5">

                  <span className="
                    text-[#C9A646]
                    font-serif
                    text-2xl
                  ">
                    02
                  </span>

                  <div>
                    <p className="font-semibold mb-1">
                      Официальный тест
                    </p>

                    <p className="text-sm text-white/45">
                      Проверим, насколько вы ничегошка.
                    </p>
                  </div>

                </div>


                <div className="w-px h-5 bg-white/10 ml-3" />


                <div className="flex gap-5">

                  <span className="
                    text-[#C9A646]
                    font-serif
                    text-2xl
                  ">
                    03
                  </span>

                  <div>
                    <p className="font-semibold mb-1">
                      Гражданство
                    </p>

                    <p className="text-sm text-white/45">
                      Добро пожаловать в Ничегонию.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FIRST UNION */}
      {/* ========================================================= */}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24 sm:py-32">

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-end
          justify-between
          gap-8
          mb-12
        ">

          <div>

            <p className="
              text-[10px]
              tracking-[0.3em]
              text-[#9B7A20]
              font-bold
              mb-5
            ">
              05 / ГРАЖДАНЕ
            </p>

            <h2 className="
              font-serif
              text-5xl
              sm:text-6xl
              lg:text-7xl
              leading-[0.9]
            ">
              НИЧЕГОШКИ
              <br />
              ПЕРВОГО СОЗЫВА
            </h2>

          </div>


          <a
            href="/first-union"
            className="
              inline-flex
              items-center
              self-start
              lg:self-auto
              border
              border-black/20
              px-6
              py-4
              text-[10px]
              tracking-[0.2em]
              font-bold
              hover:bg-[#111111]
              hover:text-white
              transition
            "
          >
            ПОСМОТРЕТЬ ВСЕХ
            <span className="ml-5 text-base">
              →
            </span>
          </a>

        </div>


        <div className="
          border-t
          border-black/10
          grid
          sm:grid-cols-3
        ">

          <div className="
            py-8
            sm:pr-8
            sm:border-r
            border-black/10
          ">

            <p className="
              text-5xl
              font-serif
              text-[#C9A646]
              mb-3
            ">
              01
            </p>

            <p className="font-semibold">
              Первые граждане
            </p>

            <p className="text-sm text-gray-500 mt-2">
              История Ничегонии начинается здесь.
            </p>

          </div>


          <div className="
            py-8
            sm:px-8
            sm:border-r
            border-black/10
          ">

            <p className="
              text-5xl
              font-serif
              text-[#C9A646]
              mb-3
            ">
              ПС
            </p>

            <p className="font-semibold">
              Особый номер
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Каждый ничегошка получает официальный паспорт.
            </p>

          </div>


          <div className="
            py-8
            sm:pl-8
          ">

            <p className="
              text-5xl
              font-serif
              text-[#C9A646]
              mb-3
            ">
              ∞
            </p>

            <p className="font-semibold">
              Ничего впереди
            </p>

            <p className="text-sm text-gray-500 mt-2">
              И это только начало.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* DOCUMENTS */}
      {/* ========================================================= */}

      <section
        id="documents"
        className="bg-[#111111] text-white py-24 sm:py-32"
      >

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="
            flex
            flex-col
            md:flex-row
            justify-between
            gap-8
            items-start
            mb-14
          ">

            <div>

              <p className="
                text-[10px]
                tracking-[0.3em]
                text-[#C9A646]
                font-bold
                mb-5
              ">
                06 / ДОКУМЕНТЫ
              </p>

              <h2 className="
                font-serif
                text-5xl
                sm:text-6xl
              ">
                ОФИЦИАЛЬНЫЕ
                <br />
                ДОКУМЕНТЫ
              </h2>

            </div>

            <p className="
              max-w-sm
              text-white/45
              text-sm
              leading-relaxed
            ">
              Всё необходимое для существования
              в Ничегонии собрано в одном месте.
            </p>

          </div>


          <div className="
            grid
            md:grid-cols-2
            gap-px
            bg-white/10
            border
            border-white/10
          ">

            <a
              href="/cabinet"
              className="
                bg-[#111111]
                p-8
                sm:p-10
                group
                hover:bg-[#171717]
                transition
              "
            >

              <div className="
                flex
                justify-between
                items-start
                mb-14
              ">

                <span className="
                  text-[#C9A646]
                  text-3xl
                  font-serif
                ">
                  Н
                </span>

                <span className="
                  text-white/30
                  group-hover:text-[#C9A646]
                  transition
                ">
                  →
                </span>

              </div>

              <p className="
                text-[10px]
                tracking-[0.2em]
                text-white/35
                mb-3
              ">
                ЛИЧНЫЙ ДОКУМЕНТ
              </p>

              <h3 className="
                text-2xl
                font-serif
              ">
                Паспорт гражданина
              </h3>

            </a>


            <button
              onClick={() => setShowConstitution(true)}
              className="
                bg-[#111111]
                p-8
                sm:p-10
                text-left
                group
                hover:bg-[#171717]
                transition
              "
            >

              <div className="
                flex
                justify-between
                items-start
                mb-14
              ">

                <span className="
                  text-[#C9A646]
                  text-3xl
                  font-serif
                ">
                  §
                </span>

                <span className="
                  text-white/30
                  group-hover:text-[#C9A646]
                  transition
                ">
                  →
                </span>

              </div>

              <p className="
                text-[10px]
                tracking-[0.2em]
                text-white/35
                mb-3
              ">
                ОСНОВНОЙ ЗАКОН
              </p>

              <h3 className="
                text-2xl
                font-serif
              ">
                Конституция Ничегонии
              </h3>

            </button>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="
        max-w-7xl
        mx-auto
        px-5
        sm:px-8
        py-24
        sm:py-32
      ">

        <div className="
          bg-[#EDE9DF]
          border
          border-black/10
          p-8
          sm:p-14
          lg:p-20
          text-center
          relative
          overflow-hidden
        ">

          <div className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            text-[260px]
            sm:text-[420px]
            leading-none
            font-serif
            text-black/[0.025]
            pointer-events-none
          ">
            Н
          </div>

          <div className="relative z-10">

            <p className="
              text-[10px]
              tracking-[0.35em]
              text-[#9B7A20]
              font-bold
              mb-6
            ">
              ВЫБОР ЗА ВАМИ
            </p>

            <h2 className="
              font-serif
              text-5xl
              sm:text-6xl
              lg:text-7xl
              leading-[0.9]
              mb-7
            ">
              ХОТИТЕ
              <br />
              В НИЧЕГОНИЮ?
            </h2>

            <p className="
              text-gray-500
              max-w-lg
              mx-auto
              leading-relaxed
              mb-9
            ">
              Ничего сложного.
              Просто пройдите официальный тест
              и станьте частью истории государства,
              которого никто не ожидал.
            </p>

            <a
              href="/test"
              className="
                inline-flex
                items-center
                bg-[#111111]
                text-white
                px-8
                py-4
                text-xs
                tracking-[0.18em]
                font-bold
                hover:bg-[#C9A646]
                hover:text-[#111111]
                transition
              "
            >
              СТАТЬ ГРАЖДАНИНОМ
              <span className="ml-5 text-base">
                →
              </span>
            </a>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="bg-[#111111] text-white">

        <div className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          py-14
        ">

          <div className="
            flex
            flex-col
            md:flex-row
            justify-between
            gap-10
          ">

            <div>

              <div className="flex items-center gap-3 mb-5">

                <div className="
                  w-10
                  h-10
                  border
                  border-[#C9A646]
                  flex
                  items-center
                  justify-center
                  text-[#C9A646]
                  font-serif
                  text-xl
                ">
                  Н
                </div>

                <div>
                  <p className="
                    text-[9px]
                    tracking-[0.25em]
                    text-white/40
                  ">
                    ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
                  </p>

                  <p className="
                    text-sm
                    font-bold
                    tracking-[0.16em]
                  ">
                    НИЧЕГОНИЯ
                  </p>
                </div>

              </div>

              <p className="
                text-sm
                text-white/35
                max-w-xs
              ">
                Ничего.
                <br />
                Но стабильно.
              </p>

            </div>


            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              gap-x-10
              gap-y-3
              text-[10px]
              tracking-[0.16em]
              font-semibold
              text-white/50
            ">

              <a
                href="#about"
                className="hover:text-[#C9A646] transition"
              >
                О СТРАНЕ
              </a>

              <a
                href="/test"
                className="hover:text-[#C9A646] transition"
              >
                ГРАЖДАНСТВО
              </a>

              <a
                href="/first-union"
                className="hover:text-[#C9A646] transition"
              >
                НИЧЕГОШКИ
              </a>

              <a
                href="/cabinet"
                className="hover:text-[#C9A646] transition"
              >
                КАБИНЕТ
              </a>

              <button
                onClick={() => setShowConstitution(true)}
                className="
                  text-left
                  hover:text-[#C9A646]
                  transition
                "
              >
                КОНСТИТУЦИЯ
              </button>

              <a
                href="/test"
                className="hover:text-[#C9A646] transition"
              >
                ПОЛУЧИТЬ ГРАЖДАНСТВО
              </a>

            </div>

          </div>


          <div className="
            border-t
            border-white/10
            mt-12
            pt-6
            flex
            flex-col
            sm:flex-row
            justify-between
            gap-3
            text-[9px]
            tracking-[0.15em]
            text-white/25
          ">

            <p>
              © 2026 ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ
            </p>

            <p>
              НИЧЕГО. НО СТАБИЛЬНО.
            </p>

          </div>

        </div>

      </footer>


      {/* ========================================================= */}
      {/* CONSTITUTION MODAL */}
      {/* ========================================================= */}

      {showConstitution && (
        <div className="fixed inset-0 z-[100]">

          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-md
            "
            onClick={() => setShowConstitution(false)}
          />


          <div className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[94%]
            sm:w-[90%]
            max-w-4xl
            h-[88dvh]
            bg-[#F7F6F3]
            text-[#111111]
            shadow-2xl
            overflow-hidden
          ">

            {/* modal header */}

            <div className="
              h-[76px]
              border-b
              border-black/10
              flex
              items-center
              justify-between
              px-5
              sm:px-8
            ">

              <div>

                <p className="
                  text-[9px]
                  tracking-[0.25em]
                  text-[#9B7A20]
                  font-bold
                ">
                  ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА
                </p>

                <h2 className="
                  text-lg
                  sm:text-2xl
                  font-serif
                ">
                  Конституция Ничегонии
                </h2>

              </div>


              <button
                onClick={() => setShowConstitution(false)}
                className="
                  w-10
                  h-10
                  border
                  border-black/10
                  flex
                  items-center
                  justify-center
                  hover:bg-[#111111]
                  hover:text-white
                  transition
                "
                aria-label="Закрыть"
              >
                ✕
              </button>

            </div>


            {/* modal content */}

            <div className="
              overflow-y-auto
              h-[calc(88dvh-76px)]
              p-5
              sm:p-10
              lg:p-14
            ">

              <div className="
                max-w-3xl
                mx-auto
                space-y-7
              ">

                <p className="
                  font-serif
                  text-2xl
                  sm:text-3xl
                  leading-relaxed
                  pb-5
                  border-b
                  border-black/10
                ">
                  Основной закон государства,
                  в котором всё стабильно.
                </p>


                <p>
                  <strong>Статья 1.</strong> Федеральная Республика Ничегония является независимым, суверенным и мемным государством.
                </p>

                <p>
                  <strong>Статья 2.</strong> Единственным источником власти в Ничегонии являются ничегошки.
                </p>

                <p>
                  <strong>Статья 3.</strong> Каждый гражданин имеет право на отдых.
                </p>

                <p>
                  <strong>Статья 4.</strong> Если отдых не помог, гражданину предоставляется дополнительный отдых.
                </p>

                <p>
                  <strong>Статья 5.</strong> Ничегометр всегда прав.
                </p>

                <p>
                  <strong>Статья 6.</strong> Если Ничегометр не прав, необходимо обратиться к статье 5.
                </p>

                <p>
                  <strong>Статья 7.</strong> Каждый ничегошка имеет право отложить дело на потом.
                </p>

                <p>
                  <strong>Статья 8.</strong> Пятница официально считается маленькой субботой.
                </p>

                <p>
                  <strong>Статья 9.</strong> Каждый гражданин имеет право открыть холодильник и забыть, зачем его открыл.
                </p>

                <p>
                  <strong>Статья 10.</strong> Каждый гражданин имеет право сохранить мем на потом и никогда больше его не открыть.
                </p>

                <p>
                  <strong>Статья 11.</strong> Каждый ничегошка имеет право смотреть ещё одно видео перед сном независимо от времени суток.
                </p>

                <p>
                  <strong>Статья 12.</strong> Если гражданин сказал: «Я только на минутку зайду в интернет», государство не несёт ответственности за последствия.
                </p>

                <p>
                  <strong>Статья 13.</strong> Президент Ничегонии является гарантом стабильного ничего.
                </p>

                <p>
                  <strong>Статья 14.</strong> Все важные вопросы могут быть перенесены на завтра.
                </p>

                <p>
                  <strong>Статья 15.</strong> Если вопрос остаётся важным завтра, допускается его перенос на послезавтра.
                </p>

                <p>
                  <strong>Статья 16.</strong> В случае чрезвычайной ситуации гражданам рекомендуется собраться и обсудить её позже.
                </p>

                <p>
                  <strong>Статья 17.</strong> Если что-либо не работает, допускается сделать вид, что так и было задумано.
                </p>

                <p>
                  <strong>Статья 18.</strong> Запрещается работать слишком много, поскольку это создаёт нереалистичные ожидания у остальных граждан.
                </p>

                <p>
                  <strong>Статья 19.</strong> Если гражданин лёг на кровать в 15:00 и проснулся в 21:00, это считается официальным перемещением во времени.
                </p>

                <p>
                  <strong>Статья 20.</strong> Количество открытых вкладок в браузере не ограничивается Конституцией.
                </p>

                <p>
                  <strong>Статья 21.</strong> Каждый гражданин имеет право начать новую жизнь с понедельника.
                </p>

                <p>
                  <strong>Статья 22.</strong> Каждый гражданин имеет право перенести начало новой жизни на следующий понедельник.
                </p>

                <p>
                  <strong>Статья 23.</strong> Любой человек имеет право подать заявление на получение гражданства Ничегонии.
                </p>

                <p>
                  <strong>Статья 24.</strong> Для получения гражданства необходимо пройти официальный тест Ничегонии.
                </p>

                <p>
                  <strong>Статья 25.</strong> Провалить тест на гражданство невозможно.
                </p>

                <p>
                  <strong>Статья 26.</strong> Даже в случае провала теста гражданин может быть принят в Ничегонию.
                </p>

                <p>
                  <strong>Статья 27.</strong> После получения гражданства человеку присваивается почётный статус НИЧЕГОШКА.
                </p>


                <div className="
                  border-t
                  border-black/10
                  pt-8
                  mt-10
                ">

                  <p className="
                    text-[10px]
                    tracking-[0.25em]
                    text-gray-400
                  ">
                    ФЕДЕРАЛЬНАЯ РЕСПУБЛИКА НИЧЕГОНИЯ · 2026
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}