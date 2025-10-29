// ✅ Wrap handleTimerEnd in useCallback so it's stable across renders
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const wakeLockRef = useRef(null);

  // ========== STABLE TIMER END HANDLER ==========
  const handleTimerEnd = useCallback(() => {
    const minutesLeft = 0;
    const qpiChange = calculateQPIChange(totalSeconds.current, 0);

    localStorage.removeItem("remainingTime");
    localStorage.removeItem("activeTime");

    navigate("/success", {
      state: { selectedMinutes: activeTime, minutesLeft, qpiChange },
    });
  }, [activeTime, navigate]);

  // ========== WAKE LOCK HANDLER ==========
  useEffect(() => {
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && !isIOS) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          console.log("✅ Screen wake lock active");
        } else if (isIOS) {
          const noSleep = () => window.scrollTo(0, 1);
          const interval = setInterval(noSleep, 15000);
          wakeLockRef.current = interval;
          console.log("📱 iOS fallback wake lock started");
        }
      } catch (err) {
        console.warn("Wake lock failed:", err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLockRef.current) {
        if (typeof wakeLockRef.current === "object" && wakeLockRef.current.release) {
          wakeLockRef.current.release();
        } else if (typeof wakeLockRef.current === "number") {
          clearInterval(wakeLockRef.current);
        }
        console.log("🔓 Wake lock released");
      }
    };

    requestWakeLock();

    return () => releaseWakeLock();
  }, []);

  // ========== TIMER LOOP ==========
  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimerEnd();
      }
    };

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [handleTimerEnd]);

  // ========== SLIDE EXIT ==========
  const handleSlideComplete = () => {
    localStorage.setItem("remainingTime", secondsLeft);
    localStorage.setItem("activeTime", activeTime);

    const qpiChange = calculateQPIChange(totalSeconds.current, secondsLeft);
    const timeSpent = totalSeconds.current - secondsLeft;
    const halfwayPoint = totalSeconds.current / 2;
    const minutes = Math.floor(secondsLeft / 60);

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
