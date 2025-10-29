import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NoSleep from "nosleep.js";
import Charac from "../Components/Charac";
import TimerDisplay from "../Components/TimerDisplay";
import SlideToExit from "../Components/SlideToExit";
import Screen from "../Components/Screen";
import "../App.css";
import { calculateQPIChange } from "../Utils/calculateQPIChange";

function Timer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTime, resumeTime } = location.state || { activeTime: 0, resumeTime: null };

  const totalSeconds = useRef(activeTime * 60);
  const [secondsLeft, setSecondsLeft] = useState(resumeTime ?? totalSeconds.current);
  const endTimeRef = useRef(Date.now() + (resumeTime ?? totalSeconds.current) * 1000);
  const noSleepRef = useRef(null);

  const handleTimerEnd = useCallback(() => {
    const minutesLeft = 0;
    const qpiChange = calculateQPIChange(totalSeconds.current, 0);
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("activeTime");
    navigate("/success", { state: { selectedMinutes: activeTime, minutesLeft, qpiChange } });
  }, [activeTime, navigate]);

  useEffect(() => {
    const enableNoSleep = () => {
      if (!noSleepRef.current) {
        noSleepRef.current = new NoSleep();
      }
      try {
        noSleepRef.current.enable(); 
        console.log("✅ Screen wake lock (NoSleep) enabled");
      } catch (err) {
        console.warn("Failed to enable NoSleep:", err);
      }
    };

    const disableNoSleep = () => {
      if (noSleepRef.current) {
        noSleepRef.current.disable();
        console.log("🔓 Screen wake lock (NoSleep) disabled");
      }
    };

    const timeout = setTimeout(enableNoSleep, 1000);

    return () => {
      clearTimeout(timeout);
      disableNoSleep();
    };
  }, []);

  // ✅ Countdown effect
  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) handleTimerEnd();
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [handleTimerEnd]);

  // ✅ Slide-to-exit logic
  const handleSlideComplete = () => {
    localStorage.setItem("remainingTime", secondsLeft);
    localStorage.setItem("activeTime", activeTime);

    const qpiChange = calculateQPIChange(totalSeconds.current, secondsLeft);
    const timeSpent = totalSeconds.current - secondsLeft;
    const halfwayPoint = totalSeconds.current / 2;
    const minutes = Math.floor(secondsLeft / 60);

    if (timeSpent > halfwayPoint + 60) {
      navigate("/success", { state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes } });
    } else {
      navigate("/failed", { state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes } });
    }
  };

  // ✅ Time formatting
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <body className="default">
      <Screen>
        <Charac />
        <div className="Container">
          <TimerDisplay formattedTime={formattedTime} />
          <SlideToExit onSlideComplete={handleSlideComplete} />
        </div>
      </Screen>
    </body>
  );
}

export default Timer;