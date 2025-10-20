// src/pages/EventPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import films from "../data/films";
import "../css/Event.css";

/*
  Ожидаемая структура в films.js (пример одного элемента):
  {
    id: "film-1",
    title: "Название фильма",
    subtitle: "Год, режиссер",
    poster: "/path/to/poster.jpg",
    content: [
      { type: "image", id: "m1", src: "/imgs/1.jpg", alt: "сцена 1", caption: "Сцена 1" },
      { type: "text", id: "t1", text: "Первый абзац с описанием сцены или события." },
      { type: "image", id: "m2", src: "/imgs/2.jpg", alt: "сцена 2", caption: "Сцена 2" },
      { type: "text", id: "t2", text: "Второй абзац." },
      // ...
    ]
  }
*/

function PairBlock({ imageBlock, textBlock, reverse }) {
  return (
    <div className={`ep-pair ${reverse ? "ep-reverse" : ""}`}>
      <figure className="ep-figure">
        <img src={imageBlock.src} alt={imageBlock.alt || ""} loading="lazy" className="ep-img" />
        {imageBlock.caption && <figcaption className="ep-caption">{imageBlock.caption}</figcaption>}
      </figure>
      <div className="ep-text">
        <p>{textBlock?.text}</p>
      </div>
    </div>
  );
}

export default function EventPage() {
  const { id } = useParams();
  const film = films.find(f => String(f.id) === String(id)) || films[0];

  // Формируем блоки: если в content идут image,text,image,text... — парим их.
  const blocks = [];
  const content = Array.isArray(film.content) ? film.content : [];

  for (let i = 0; i < content.length; ) {
    const item = content[i];

    if (item.type === "image") {
      const next = content[i + 1];
      if (next && next.type === "text") {
        blocks.push({ kind: "pair", image: item, text: next });
        i += 2;
        continue;
      } else {
        blocks.push({ kind: "image-only", image: item });
        i += 1;
        continue;
      }
    }

    if (item.type === "text") {
      // Если следующие — image, тогда handled in image branch above when loop reaches that image.
      // Если подряд несколько текстов — объединяем в один full-width блок.
      let textConcat = item.text || "";
      let j = i + 1;
      while (j < content.length && content[j].type === "text") {
        textConcat += "\n\n" + (content[j].text || "");
        j++;
      }
      blocks.push({ kind: "text-full", text: textConcat });
      i = j;
      continue;
    }

    // Для любых других типов — просто вывести как full-width JSON (без краша)
    blocks.push({ kind: "text-full", text: item.text || "" });
    i += 1;
  }

  return (
    <article className="ep-root">
      <header className="ep-header">
        <Link to={`/movie/${film.id}`} className="to-movie-button"> Смотреть фильм</Link>
        <h1 className="ep-title">{film.title}</h1>
        {film.subtitle && <p className="ep-subtitle">{film.subtitle}</p>}
      </header>

      <section className="ep-content">
        {/* Рендерим подготовленные блоки */}
        {blocks.map((b, idx) => {
          if (b.kind === "pair") {
            return (
              <PairBlock
                key={b.image.id || idx}
                imageBlock={b.image}
                textBlock={b.text}
                reverse={idx % 2 === 1}
              />
            );
          }
          if (b.kind === "image-only") {
            return (
              <div key={b.image.id || idx} className="ep-single-image">
                <figure className="ep-figure">
                  <img src={b.image.src} alt={b.image.alt || ""} loading="lazy" className="ep-img" />
                  {b.image.caption && <figcaption className="ep-caption">{b.image.caption}</figcaption>}
                </figure>
              </div>
            );
          }
          return (
            <div key={idx} className="ep-text ep-text-full">
              {b.text.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          );
        })}
      </section>
    </article>
  );
}
