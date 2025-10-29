import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Timer from "./Pages/Timer";
import Failed from "./Pages/Failed";
import Success from "./Pages/Success";// index.js or Screen.js (top-level component)
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/timer" element={<Timer />} />
      <Route path="/failed" element={<Failed />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  </BrowserRouter>
);
