import React from "react";

function ActionPrompt({ promptText, buttonText, onButtonClick, showSkip = false }) {
  return (
    <>
      <div className="ActionWrapper">
        <div className="MainWrapper--noheight">
          <p>{promptText}</p>
        </div>
        <div className="Button" onClick={onButtonClick}>
          <h2>{buttonText}</h2>
        </div>
      </div>
    </>
  );
}

export default ActionPrompt;

