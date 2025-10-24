import React from "react";
import "../Pages/Leaderboard.css";
import Charac from "../Components/Charac";

function Place({ leader, rank, name, course, qpi, image, gradient, characClass }) {
  const style = {
    background: gradient || "linear-gradient(90deg, #ccc 0%, #eee 100%)",
  };
  const placeClass = leader ? "Place leader" : "Place";

  return (
    <div className={placeClass} style={style}>
      <div className="Rank">
        <h2 className="rank-text">{rank}</h2>
      </div>

      <div className="place-details">
        <div className="Student">
          <h3>{name}</h3>
          <p>{course}</p>
        </div>

        <h1 className="qpi">{qpi ? qpi.toFixed(2) : "—"}</h1>

        {/* ✅ Pass character class down */}
        <Charac overrideClass={characClass} />
      </div>
    </div>
  );
}

export default Place;

