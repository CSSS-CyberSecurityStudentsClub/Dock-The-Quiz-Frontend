import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Intro from "./pages/Intro.jsx";
import Login from "./pages/Login.jsx"; // import login page
import Rules from "./pages/Rules.jsx";
import Quiz from "./pages/Quiz.jsx";
import Surprise from "./pages/Surprise.jsx";
import Leaderboard from "./pages/Leaderboard.jsx"; // import leaderboard page

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/surprise" element={<Surprise />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
