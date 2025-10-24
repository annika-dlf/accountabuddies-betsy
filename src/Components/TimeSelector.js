import React from "react";

function TimeSelector({ times, activeTime, setActiveTime }) {
  return (
    <div className="TimerWrapper">
      {times.map((time) => (
        <div
          key={time}
          className={`TimerBox ${activeTime === time ? "active" : ""}`}
          onClick={() => setActiveTime(time)}
        >
          <h2>{time}</h2>
          <small>mins</small>
        </div>
      ))}
    </div>
  );
}

export default TimeSelector;
