import "./App.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoSleep from "nosleep.js";

import Charac from "./Components/Charac";
import WelcomeHeader from "./Components/WelcomeHeader";
import TimeSelector from "./Components/TimeSelector";
import StartButton from "./Components/StartButton";
import Screen from "./Components/Screen";

function App() {
  const [activeTime, setActiveTime] = useState(null);
  const navigate = useNavigate();
  const times = [20, 40, 60];
  const noSleepRef = useRef(null);

  useEffect(() => {
    noSleepRef.current = new NoSleep();

    return () => {
      if (noSleepRef.current) {
        noSleepRef.current.disable();
      }
    };
  }, []);

  const handleStart = () => {
    if (activeTime) {
      // ✅ Enable NoSleep on user tap (iOS requires this)
      if (noSleepRef.current) {
        try {
          noSleepRef.current.enable();
          console.log("NoSleep enabled");
        } catch (err) {
          console.error("NoSleep error:", err);
        }
      }

      // Then navigate to timer
      navigate("/timer", { state: { activeTime } });
    } else {
      alert("Please select a time first!");
    }
  };

  return (
    <body className="default">
      <Screen>
        <Charac />
        <div className="Container">
          <div className="MainWrapper">
            <WelcomeHeader />
            <TimeSelector
              times={times}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
            />
          </div>
          <StartButton activeTime={activeTime} onClick={handleStart} />
        </div>
      </Screen>
    </body>
  );
}

export default App;
