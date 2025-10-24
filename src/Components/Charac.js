import React from "react";
import { useLocation } from "react-router-dom";

function Charac({ overrideClass }) {
  const location = useLocation();

  // Normalize and split path into parts
  const path = location.pathname.toLowerCase().replaceAll("/", "");

  // Default to "app" if path is empty
  const base = path || "app";

  // If override provided, use it; else generate `charac_{base}`
  const className = overrideClass || `charac_${base}`;

  return <div className={className}></div>;
}

export default Charac;
