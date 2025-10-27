import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Charac from "./Components/Charac";
import WelcomeHeader from "./Components/WelcomeHeader";
import TimeSelector from "./Components/TimeSelector";
import StartButton from "./Components/StartButton";
import Screen from "./Components/Screen";

function App() {
  const [activeTime, setActiveTime] = useState(null);
  const navigate = useNavigate();
  const times = [20, 40, 60];

  const handleStart = () => {
    if (activeTime) {
      navigate("/timer", { state: { activeTime } });
    } else {
      alert("Please select a time first!");
    }
  };

  return (
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
  );
}

export default App;
