import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Charac from "../Components/Charac";
import ResultCard from "../Components/ResultCard";
import ActionPrompt from "../Components/ActionPrompt";
import Screen from "../Components/Screen";

function Failed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { qpiChange = 0, minutesLeft = 0 } = state || {};

  const handleRetry = () => {
    // Retrieve saved time from localStorage
    const remainingTime = localStorage.getItem("remainingTime");
    const activeTime = localStorage.getItem("activeTime");

    if (remainingTime && activeTime) {
      navigate("/timer", {
        state: {
          activeTime: Number(activeTime),
          resumeTime: Number(remainingTime), // resume from where they left off
        },
      });
    } else {
      // fallback (no saved state)
      navigate("/timer", { state: { activeTime: 20 } }); // default 20 min
    }
  };

  const baseQPI = 4.00;
  const newQPI = (baseQPI + qpiChange).toFixed(2);

  return (
    <Screen>
      <Charac />
      <div className="Container">
        <ResultCard
        title={qpiChange === 0 ? "Failed." : "Failed."}
        message={
          qpiChange === 0
            ? `Betsy <span class="Neutral">didn't get any QPI points</span> because you didn't even get through half of what you committed!`
            : `Betsy <span class="Negative">lost ${Math.abs(qpiChange).toFixed(
                2
              )} QPI points</span> since you failed to commit your remaining ${minutesLeft} minutes.`
        }
        qpiInfo={`Betsy's New QPI: ${newQPI}`}
        />
      <ActionPrompt
          promptText="Want to give Betsy another chance?"
          buttonText="Let's do it!"
          onButtonClick={handleRetry}
        />
      </div>
    </Screen>
  );
}

export default Failed;

