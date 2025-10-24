import React from "react";

function StartButton({ activeTime, onClick }) {
  return (
    <div className="ActionWrapper">
      <div className="Button" onClick={onClick}>
        <h2>Let's go!</h2>
      </div>
    </div>
  );
}

export default StartButton;
