import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Timer from "./Pages/Timer";
import Failed from "./Pages/Failed";
import Success from "./Pages/Success";

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
