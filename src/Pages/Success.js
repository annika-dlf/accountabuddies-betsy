import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Charac from "../Components/Charac";
import ResultCard from "../Components/ResultCard";
import ActionPrompt from "../Components/ActionPrompt";
import Screen from "../Components/Screen";
import supabase from "../supabase-client";

function Success() {
  const { state } = useLocation();
  const { qpiChange = 0 } = state || {};
  const [currentQPI, setCurrentQPI] = useState(4.0);

  // Clear timer progress (user succeeded) and update Betsy's QPI
  useEffect(() => {
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("activeTime");

    const updateBetsyQPI = async () => {
      try {
        // Fetch Betsy's current QPI
        const { data, error } = await supabase
          .from("users")
          .select("qpi")
          .eq("name", "Betsy")
          .single();

        if (error) {
          console.error("Error fetching QPI:", error);
          return;
        }

        const oldQPI = data.qpi;
        const newQPI = Math.min(oldQPI + qpiChange, 4.0); // Cap at 4.0
        setCurrentQPI(newQPI);

        // Update Betsy's QPI in the database
        const { error: updateError } = await supabase
          .from("users")
          .update({ qpi: newQPI })
          .eq("name", "Betsy");

        if (updateError) {
          console.error("Error updating QPI:", updateError);
        } else {
          console.log(`Betsy's QPI updated from ${oldQPI} to ${newQPI}`);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    updateBetsyQPI();
  }, [qpiChange]);

  const handleShareTips = () => {
    window.open(
      "https://padlet.com/annikadelafuente/accountabuddies-study-tips-j3kbg62y3ne7at65"
    );
  };

  return (
  <body className="success">
    <Screen>
      <Charac />
      <div className="Container">
        <ResultCard
          title="You did it!"
          message={`Betsy stayed focused and <span class="Positive">gained ${qpiChange.toFixed(
            2
          )} QPI points</span> because of you!`}
          qpiInfo={`Betsy's New QPI: ${currentQPI.toFixed(2)}`}
        />
        <ActionPrompt
          promptText="Want to share some tips for others to help Betsy?"
          buttonText="Let's do it!"
          onButtonClick={handleShareTips}
        />
      </div>
    </Screen>
  </body>
  );
}

export default Success;
