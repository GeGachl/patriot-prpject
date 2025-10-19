import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import films from "../data/films"; // ваш массив фильмов
import MapLeaflet from "../components/MapLeaflet";
import "../css/Home.css";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [slide, setSlide] = useState(0);
  const slidesCount = 3;
  const trackRef = useRef(null);

  const toNext = () => setSlide((s) => Math.min(s + 1, slidesCount - 1));
  const toPrev = () => setSlide((s) => Math.max(s - 1, 0));
  const goTo = (idx) => setSlide(Math.max(0, Math.min(idx, slidesCount - 1)));

  useEffect(() => {
    const param = parseInt(searchParams.get("slide"));
    if (!isNaN(param)) {
      setSlide(Math.max(0, Math.min(param, 2))); // ограничиваем диапазон
    }
  }, [searchParams]);
  
  useEffect(() => {
    // Блокируем нативный скролл страницы пока на этой странице
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // wheel / touchmove handlers — предотвращают прокрутку
    const onWheel = (e) => {
      // предотвращаем все прокрутки в том числе трекпад
      e.preventDefault();
    };
    const onTouchMove = (e) => {
      e.preventDefault();
    };

    // Клавиатурная навигация — стрелки и PageUp/PageDown/Home/End
    const onKeyDown = (e) => {
      // если фокус в инпуте/textarea — не перехватываем
      const tag = document.activeElement?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        toNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        toPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(slidesCount - 1);
      }
    };

    // Добавляем слушатели с опцией { passive: false } для возможности preventDefault
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown, false);

    // Фокус на треке — чтобы not leave page с помощью tab (опционально)
    if (trackRef.current) trackRef.current.tabIndex = -1;

    return () => {
      // cleanup
      window.removeEventListener("wheel", onWheel, { passive: false });
      window.removeEventListener("touchmove", onTouchMove, { passive: false });
      window.removeEventListener("keydown", onKeyDown, false);
      document.body.style.overflow = prevBodyOverflow || "";
    };
  }, [slidesCount]);

  useEffect(() => {
    // Когда slide меняется, прокручиваем track (у вас это уже делается через inline style)
    // Обеспечим фокус на треке для лучшей доступности (чтобы клавиши работали явно)
    if (trackRef.current) {
      trackRef.current.focus({ preventScroll: true });
    }
  }, [slide]);
  return (
    <div className="hp-root">
      {/* слайды: высота каждого 100vh; сдвигаются контейнером slides-track */}
      <div className="hp-slides-viewport">
        <div
          ref={trackRef}
          className="hp-slides-track"
          style={{ transform: `translateY(-${slide * 100}vh)` }}
          aria-live="polite"
        >
          {/* Slide 1 — Вступительный экран */}
          <section
            className="hp-slide hp-slide-intro"
            aria-label="Welcome slide"
          >
            <div className="hp-intro-overlay">
              <h1 className="hp-project-title">Хроники патриотизма</h1>
            </div>

            <div className="hp-quote-placeholder" aria-hidden="false">
              {/* Оставлено место для цитаты — заполните текстом или компонентом */}
              <blockquote className="hp-quote">
                «Мы - мирные люди, не хотим войны. Мы не богаты, но никого не
                просим. Мы сами свое счастье заработаем. Лучше десятки и сотни
                лет переговоров, чем один день войны» А.Г. Лукашенко
              </blockquote>
            </div>

            <button
              className="hp-arrow hp-arrow-down"
              aria-label="Перейти к содержимому"
              onClick={toNext}
            >
              ↓
            </button>
          </section>

          {/* Slide 2 — содержание: краткое описание + список фильмов */}
          <section
            className="hp-slide hp-slide-content"
            aria-label="Main content"
            id="films"
          >
            <div className="hp-content-inner">
              <button
                className="hp-arrow hp-arrow-up"
                aria-label="Вернуться к вступлению"
                onClick={toPrev}
              >
                ↑
              </button>

              <div className="hp-description">
                <h2 className="hp-section-title">Краткое описание проекта</h2>
                <div className="hp-description-text">
                  {/* Оставлено место для текста описание — замените на нужный */}
                  <p>
                    Хроники патриотизма — открытый цифровой архив архивных и документальных фильмов с подробными карточками, источниками и контекстными заметками. Проект упрощает поиск и просмотр исторических материалов, привлекает сообщество для уточнения данных.
                  </p>
                </div>
              </div>

              <div className="hp-films-list">
                {films.map((f, i) => (
                  <article
                    key={f.id || i}
                    className={`hp-film-item ${
                      i % 2 === 0 ? "hp-film-left" : "hp-film-right"
                    }`}
                  >
                    <div className="hp-film-media">
                      <img
                        src={f.poster || "/posters/placeholder.jpg"}
                        alt={f.title}
                      />
                    </div>

                    <div className="hp-film-meta">
                      <h3 className="hp-film-title">{f.title}</h3>
                      <p className="hp-film-sub">
                        {f.genre || ""} • {f.year || ""}
                      </p>
                      <Link
                        to={`/movie/${f.id}/event`}
                        className="hp-film-link"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <button
                className="hp-arrow hp-arrow-down hp-arrow-content-next"
                aria-label="Перейти к контактам"
                onClick={() => toNext()}
              >
                ↓
              </button>
            </div>
          </section>

          {/* Slide 3 — контакты + карта */}
          <section className="hp-slide hp-slide-contacts" aria-label="Contacts">
            <div className="hp-contacts-inner">
              <button
                className="hp-arrow hp-arrow-up"
                aria-label="Вернуться к содержимому"
                onClick={toPrev}
              >
                ↑
              </button>

              <div className="hp-contacts-content">
                <h2 className="hp-section-title">Контакты</h2>
                <div className="hp-contacts-text">
                  {/* Оставьте место — заполните позже */}
                  <p>Над проектом работали:</p>
                  <p>{ /* </p><a href="https://t.me/aleksandr_lukashenko">Александр Лукашенко</a>*/ }  Хлименков Герман (главный програмист)</p>
                  <p>Рыбак Андрей (дизайнер)</p>
                  <p>Татьяна Владимировна (организатор)</p>
                </div>

                <div
                  className="hp-map-placeholder"
                  role="img"
                  aria-label="Карта местоположения"
                >
                  {/* Вставьте карту (iframe или компонент) здесь */}
                  <div className="hp-map-box"><MapLeaflet lat={53.9018296} lng={27.4402926} zoom={26} /></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
