import React from "react";
import "./UiverseCard.css";

const UiverseCard = ({ imageSrc }) => {
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
            className="card__img"
          />
        </div>
      </div>
    </div>
  );
};

export default UiverseCard;