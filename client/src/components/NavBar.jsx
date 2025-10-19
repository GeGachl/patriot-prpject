import React from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <header className="top-curtain">
      <nav className="nav">
        <div className="brand">Хроники патриотизма</div>
        <ul className="nav-list">
          <li onClick={() => navigate("/?slide=0")}>Главная</li>
          <li onClick={() => navigate("/?slide=1")}>Фильмы</li>
          <li onClick={() => navigate("/?slide=2")}>Контакты</li>
        </ul>
      </nav>
    </header>
  );
}
