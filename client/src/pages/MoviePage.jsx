// src/pages/MoviePage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import films from "../data/films"; // проверь путь к файлу
import "../css/Movie.css";

export default function MoviePage() {
  const { id } = useParams();
  const film = films.find((f) => String(f.id) === String(id)) || {};

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2 className="movie-title">{film.title || `Фильм ${id}`}</h2>
        <Link to="/" className="home-button">
          На главную
        </Link>
      </div>

      <div className="movie-layout">
        <div className="video-and-meta">
          <div className="video-wrapper">
            {film.videoUrl ? (
              <iframe
                src={film.videoUrl}
                title={film.title || `video-${id}`}
                allowFullScreen
                className="embed-iframe"
              />
            ) : film.videoUrl ? (
              <video
                className="movie-video"
                controls
                poster={film.poster || ""}
                preload="metadata"
              >
                <source src={film.videoUrl} type="video/mp4" />
                Ваш браузер не поддерживает элемент video.
              </video>
            ) : (
              <div className="no-video">Видео не добавлено</div>
            )}
          </div>
          <aside className="movie-meta">
            <div className="movie-short">
              <h3 className="movie-subtitle">Краткое описание</h3>
              <p className="movie-desc">
                {film.short || "Описание пока отсутствует."}
              </p>
              <Link to={`/movie/${film.id}/event`} className="event-button">
                Подробнее о событии
              </Link>
            </div>
          </aside>
        </div>
        <aside className="event-aside" aria-label="Сведения о фильме">
          <div className="aside-card aside-poster">
            <img
              src={film.poster || "/posters/placeholder.jpg"}
              alt={film.title}
              className="poster-img"
              loading="lazy"
            />
            <h4 className="aside-title">{film.title}</h4>
            <p className="aside-text">
              <strong>Год:</strong> {film.year || "—"}
              <br />
              <strong>Жанр:</strong> {film.genre || "—"}
              <br />
              <strong>Длительность:</strong> {film.runtime || "—"}
            </p>
          </div>
        </aside>
      </div>
      <div className="movie-actions-bottom">
        <Link className="back-home-inline" to="/">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
