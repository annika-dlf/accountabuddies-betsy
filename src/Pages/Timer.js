import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Charac from "../Components/Charac";
import TimerDisplay from "../Components/TimerDisplay";
import SlideToExit from "../Components/SlideToExit";
import "../App.css";
import Screen from "../Components/Screen";
import { calculateQPIChange } from "../Utils/calculateQPIChange";

function Timer() {
  const location = useLocation();
  const navigate = useNavigate();

  const { activeTime, resumeTime } = location.state || { activeTime: 0, resumeTime: null };

  // If resuming, use resumeTime; otherwise, full activeTime
  const [secondsLeft, setSecondsLeft] = useState(resumeTime ?? activeTime * 60);

  // Countdown logic
  useEffect(() => {
    if (secondsLeft <= 0) {
      // Timer finished successfully
      const minutesLeft = 0;
      const qpiChange = calculateQPIChange(activeTime * 60, 0);

      // Clear saved time
      localStorage.removeItem("remainingTime");
      localStorage.removeItem("activeTime");

      navigate("/success", {
        state: { selectedMinutes: activeTime, minutesLeft, qpiChange },
      });
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, activeTime, navigate]);

  // Format mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Handle user sliding to fail
const handleSlideComplete = () => {
  // Save current progress before leaving
  localStorage.setItem("remainingTime", secondsLeft);
  localStorage.setItem("activeTime", activeTime);

  const totalSeconds = activeTime * 60;
  const qpiChange = calculateQPIChange(totalSeconds, secondsLeft);

  // Calculate how much time they actually spent
  const timeSpent = totalSeconds - secondsLeft;
  const halfwayPoint = totalSeconds / 2;

  if (timeSpent > halfwayPoint + 60) {
    // ✅ User completed over half — go to Success screen
    navigate("/success", {
      state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes },
    });
  } else {
    // ❌ User didn't complete half — go to Failed screen
    navigate("/failed", {
      state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes },
    });
  }
};

  return (
    <Screen>
      <Charac />
      <div className="Container">
        <TimerDisplay formattedTime={formattedTime} />
        <SlideToExit onSlideComplete={handleSlideComplete} />
      </div>
    </Screen>
  );
}

export default Timer;


