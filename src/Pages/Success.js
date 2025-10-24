import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Charac from "../Components/Charac";
import ResultCard from "../Components/ResultCard";
import ActionPrompt from "../Components/ActionPrompt";
import Screen from "../Components/Screen";

function Success() {
  const { state } = useLocation();
  const { qpiChange = 0 } = state || {};

  // Clear timer progress (user succeeded)
  useEffect(() => {
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("activeTime");
  }, []);

const handleShareTips = () => {
  window.open(
    "https://padlet.com/annikadelafuente/accountabuddies-study-tips-j3kbg62y3ne7at65"
  )
  };

  const baseQPI = 4.00;
  const newQPI = Math.min(baseQPI + qpiChange, 4.0).toFixed(2);

  return (
    <Screen>
      <Charac />
      <div className="Container">
        <ResultCard
          title="You did it!"
          message={`Betsy stayed focused and <span class="Positive">gained ${qpiChange.toFixed(
            2
          )} QPI points</span> because of you!`}
          qpiInfo={`Betsy's New QPI: ${newQPI}`}
        />
        <ActionPrompt
          promptText="Want to share some tips for others to help Betsy?"
          buttonText="Let's do it!"
          onButtonClick={handleShareTips}
        />
      </div>
    </Screen>
  );
}

export default Success;
