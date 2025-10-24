import React from "react";

function ResultCard({ title, message, qpiInfo, highlightClass }) {
  return (
    <div className="MainWrapper">
      <div className="MainWrapper--Text">
        <h2>{title}</h2>
        <p dangerouslySetInnerHTML={{ __html: message }} />
      </div>
      {qpiInfo && (
        <small className="Description">
          {qpiInfo}
        </small>
      )}
    </div>
  );
}

export default ResultCard;

