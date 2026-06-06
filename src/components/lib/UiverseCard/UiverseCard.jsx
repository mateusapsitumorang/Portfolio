import React, { useState } from "react";
import "./UiverseCard.css";

const UiverseCard = ({ imageSrc, hoverImageSrc }) => {
  const [state, setState] = useState("idle"); // "idle" | "entering" | "leaving"

  const handleMouseEnter = () => setState("entering");
  const handleMouseLeave = () => setState("leaving");

  return (
    <div className="card-container">
      <div className="frost-wrap">
        <div
          className="card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gambar 1: tampil saat idle/leaving */}
          <img
            src={imageSrc}
            alt="Profile"
            className={`card__img card__img--default ${
              state === "entering"
                ? "motion-out"
                : state === "leaving"
                  ? "motion-in"
                  : ""
            }`}
          />

          {/* Gambar 2: tampil saat entering */}
          <img
            src={hoverImageSrc}
            alt="Profile Hover"
            className={`card__img card__img--hover ${
              state === "entering"
                ? "motion-in"
                : state === "leaving"
                  ? "motion-out"
                  : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default UiverseCard;
