import React, { useState, useCallback } from "react";
import "./UiverseCard.css";

const UiverseCard = ({ imageSrc, hoverImageSrc }) => {
  const [state, setState] = useState("idle"); // "idle" | "entering" | "leaving"

  const handleMouseEnter = useCallback(() => setState("entering"), []);
  const handleMouseLeave = useCallback(() => setState("leaving"), []);

  // Lepas will-change begitu animasi selesai, biar layer GPU-nya dilepas lagi
  const handleAnimEnd = useCallback((e) => {
    e.currentTarget.style.willChange = "auto";
  }, []);

  return (
    <div className="card-container">
      <div className="frost-wrap">
        <div
          className="card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={imageSrc}
            alt="Profile"
            width={220}
            height={320}
            decoding="async"
            className={`card__img card__img--default ${
              state === "entering"
                ? "motion-out"
                : state === "leaving"
                  ? "motion-in"
                  : ""
            }`}
            onAnimationEnd={handleAnimEnd}
          />
          <img
            src={hoverImageSrc}
            alt="Profile Hover"
            width={220}
            height={320}
            decoding="async"
            loading="lazy"
            className={`card__img card__img--hover ${
              state === "entering"
                ? "motion-in"
                : state === "leaving"
                  ? "motion-out"
                  : ""
            }`}
            onAnimationEnd={handleAnimEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default UiverseCard;
