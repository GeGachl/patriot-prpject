import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";
import EventPage from "./pages/EventPage";
import "./css/App.css";


export default function App() {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/movie/:id/event" element={<EventPage />} />
        </Routes>
      </main>
    </div>
  );
}
