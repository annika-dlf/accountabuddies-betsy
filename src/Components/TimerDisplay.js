import React from "react";

function TimerDisplay({ formattedTime }) {
  return (
    <div className="MainWrapper">
      <div className="MainWrapper--Text">
        <small>TIME LEFT</small>
        <h1>{formattedTime}</h1>
        <p>
          I'm learning so much!
          <br />
          Please don't leave yet...
        </p>
      </div>
      <small className="Description">
        If you leave now, the time you fail to commit will be{" "}
        <span className="Negative">deducted</span> from Betsy's QPI (10 mins =
        0.10 deducted).
      </small>
    </div>
  );
}

export default TimerDisplay;

