import React, { useState, useEffect, useRef } from "react";

function SlideToExit({ onSlideComplete }) {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleStart = (e) => {
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMove = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    const deltaX = startX - clientX; // swipe right-to-left = positive
    const maxSlide = container.offsetWidth - 70;

    // Restrict between 0 and maxSlide
    const newX = Math.min(Math.max(deltaX, 0), maxSlide);
    slider.style.transform = `translateX(-${newX}px)`;

    // Trigger callback when mostly swiped
    if (newX > container.offsetWidth * 0.8) {
      onSlideComplete();
    }
  };

  const handleEnd = () => {
    setDragging(false);
    const slider = sliderRef.current;
    if (slider) slider.style.transform = "translateX(0px)";
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return (
    <div className="ActionWrapper">
      <div className="SlideToExit" ref={containerRef}>
        <h3>Slide to exit</h3>
        <div
          className="ArrowBox"
          ref={sliderRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
          >
            <path
              d="M10 24.5L22 12.5M10 24.5L22 36.5M10 24.5H38"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SlideToExit;

