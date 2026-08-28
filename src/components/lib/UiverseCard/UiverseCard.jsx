import React from "react";
import "./UiverseCard.css";

const UiverseCard = ({ imageSrc, hoverImageSrc }) => {
  return (
    <div className="card-container">
      <div className="frost-wrap">
        <div className="card">
          <img
            src={imageSrc}
            alt="Profile"
            width={220}
            height={320}
            decoding="async"
            className="card__img card__img--default"
          />
          <img
            src={hoverImageSrc}
            alt="Profile Hover"
            width={220}
            height={320}
            decoding="async"
            loading="lazy"
            className="card__img card__img--hover"
          />
        </div>
      </div>
    </div>
  );
};

export default UiverseCard;
