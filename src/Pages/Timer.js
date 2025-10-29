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
  const [secondsLeft, setSecondsLeft] = useState(resumeTime ?? activeTime * 60);
  const [wakeLock, setWakeLock] = useState(null);

  // ✅ Keep screen awake while on Timer page
  useEffect(() => {
    let lock = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          lock = await navigator.wakeLock.request("screen");
          setWakeLock(lock);
          console.log("✅ Screen wake lock active");
        } else {
          console.warn("⚠️ Wake Lock API not supported in this browser.");
        }
      } catch (err) {
        console.error("WakeLock Error:", err.name, err.message);
      }
    };

    requestWakeLock();

    // Reacquire wake lock if page/tab becomes visible again
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (lock) {
        lock.release().then(() => console.log("🔒 Screen wake lock released"));
      }
    };
  }, [wakeLock]);

  // ✅ Countdown logic
  useEffect(() => {
    if (secondsLeft <= 0) {
      const minutesLeft = 0;
      const qpiChange = calculateQPIChange(activeTime * 60, 0);

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

  // ✅ Format mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // ✅ Handle slide to exit
  const handleSlideComplete = () => {
    localStorage.setItem("remainingTime", secondsLeft);
    localStorage.setItem("activeTime", activeTime);

    const totalSeconds = activeTime * 60;
    const qpiChange = calculateQPIChange(totalSeconds, secondsLeft);
    const timeSpent = totalSeconds - secondsLeft;
    const halfwayPoint = totalSeconds / 2;

    if (timeSpent > halfwayPoint + 60) {
      navigate("/success", {
        state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes },
      });
    } else {
      navigate("/failed", {
        state: { qpiChange, selectedMinutes: activeTime, minutesLeft: minutes },
      });
    }
  };

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
