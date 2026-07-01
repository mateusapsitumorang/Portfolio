import React from "react";
import { useTranslation } from "react-i18next";
import TextType from "../lib/TextType/TextType";
import "../lib/TextType/TextType.css";
import BlurText from "../lib/BlurText/BlurText";
import DecryptedText from "../lib/DecryptedText/DecryptedText";
import UiverseCard from "../lib/UiverseCard/UiverseCard";
import "./About.css"; // <-- CSS statis, tidak lagi di-inject via <style> tiap render

import myPhoto from "../../assets/pic1.webp";
import myPhotoHover from "../../assets/pic2.webp";

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="about-section">
      <div className="about-inner">
        <div className="about-photo-mobile">
          <UiverseCard imageSrc={myPhoto} hoverImageSrc={myPhotoHover} />
        </div>

        <div className="about-text">
          <div className="about-welcome-wrap">
            <TextType
              text={[t("about.welcome")]}
              typingSpeed={100}
              showCursor={true}
              cursorCharacter="|"
              className="welcome-text"
            />
          </div>

          <h2 className="about-heading">
            <DecryptedText
              text={t("about.heading")}
              animateOn="view"
              sequential={true}
              speed={50}
              className="revealed"
              encryptedClassName="encrypted"
            />
            <span className="about-role">
              <DecryptedText
                text={t("about.role")}
                animateOn="view"
                sequential={true}
                speed={50}
                className="revealed"
                encryptedClassName="encrypted"
              />
            </span>
          </h2>

          <BlurText
            text={t("about.description")}
            delay={50}
            animateBy="words"
            direction="bottom"
            className="about-description"
          />
        </div>

        <div className="about-photo-desktop">
          <UiverseCard imageSrc={myPhoto} hoverImageSrc={myPhotoHover} />
        </div>
      </div>
    </section>
  );
};

export default About;
