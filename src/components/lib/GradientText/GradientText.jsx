import React, { useEffect } from "react";

export default function GradientText({
  children,
  className = "",
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
  showBorder = false,
}) {
  const gradientColors = [...colors, colors[0]].join(", ");

  const styleId = "gradient-text-keyframes";
  useEffect(() => {
    if (document.getElementById(styleId)) return;
    const el = document.createElement("style");
    el.id = styleId;
    el.textContent = `
      @keyframes gradientShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${gradientColors})`,
    backgroundSize: "300% 100%",
    backgroundRepeat: "repeat",
    animation: `gradientShift ${animationSpeed * 2}s ease infinite`,
  };

  return (
    <div className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle} />}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}