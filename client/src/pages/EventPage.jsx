import React from "react";
import { useParams, Link } from "react-router-dom";
import films from "../data/films";
import "../css/Event.css";

export default function EventPage() {
  const { id } = useParams();
  const film = films.find(f => String(f.id) === String(id)) || null;
  const paragraphs = (film.full || "").split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  if (!film) {
    return (
      <div className="event-page">
        <div className="event-header">
          <h2 className="event-title">Фильм не найден</h2>
          <Link to="/" className="to-movie-button">На главную</Link>
        </div>

        <div className="event-layout">
          <article className="event-content">
            <p className="lead">Запись о фильме с id {id} отсутствует в базе.</p>
            <div className="event-controls">
              <Link to="/" className="home-link">На главную</Link>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page">
      <div className="event-header">
        <h2 className="event-title">{film.title}</h2>
        <Link to={`/movie/${film.id}`} className="to-movie-button">Вернуться к фильму</Link>
      </div>

      <div className="event-layout">
        <article className="event-content" aria-labelledby="film-title">
          <p className="lead">
            <strong>{film.year}</strong>
            {film.genre && <> • {film.genre}</>}
            {film.runtime && <> • {film.runtime}</>}
            {film.director && <> • Режиссёр: {film.director}</>}
          </p>

          <section className="event-body">
            <h3>Полное описание</h3>
            {paragraphs.length ? paragraphs.map((p,i) => <p key={i} className="body-paragraph">{p}</p>) : <p className="body-paragraph">Описание отсутствует</p>}

            {film.cast && film.cast.length > 0 && (
              <>
                <h4>Актёрский состав</h4>
                <ul className="cast-list">
                  {film.cast.map((actor, idx) => <li key={idx}>{actor}</li>)}
                </ul>
              </>
            )}

            {film.sources && film.sources.length > 0 && (
              <>
                <h4>Источники и примечания</h4>
                <ul className="sources-list">
                  {film.sources.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </>
            )}
          </section>

          <div className="event-controls">
            <Link to="/" className="home-link">На главную</Link>
            <Link to={`/movie/${film.id}`} className="back-to-movie-inline">← Вернуться к фильму</Link>
          </div>
        </article>

        <aside className="event-aside" aria-label="Сведения о фильме">
          <div className="aside-card aside-poster">
            <img
              src={film.photo || "/posters/placeholder.jpg"}
              alt={film.title}
              className="poster-img"
              loading="lazy"
            />
            <h4 className="aside-title">{film.title}</h4>
            <p className="aside-text">
              <strong>Год:</strong> {film.year || "—"}<br />
              <strong>Жанр:</strong> {film.genre || "—"}<br />
              <strong>Длительность:</strong> {film.runtime || "—"}
            </p>
            {film.videoUrl || film.hlsUrl || film.embedUrl ? (
              <Link to={`/movie/${film.id}`} className="aside-action">Смотреть фильм</Link>
            ) : (
              <div className="no-video-note">Видео пока не загружено</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
