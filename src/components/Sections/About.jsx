import React, { useEffect, useState } from "react";
import TextType from "../lib/TextType/TextType";
import "../lib/TextType/TextType.css";
import BlurText from "../lib/BlurText/BlurText";
import DecryptedText from "../lib/DecryptedText/DecryptedText";
import UiverseCard from "../lib/UiverseCard/UiverseCard";
import { motion } from "framer-motion";

import myPhoto from "../../assets/pic1.png";
import myPhotoHover from "../../assets/pic2.png";

const About = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 480 : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="about"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "hidden",
        boxSizing: "border-box",
        padding: isMobile ? "60px 20px" : "0 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "24px" : "100px",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {/* GAMBAR atas — mobile only */}
        {isMobile && (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <UiverseCard imageSrc={myPhoto} hoverImageSrc={myPhotoHover} />
          </div>
        )}

        {/* TEKS */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 550px", // ← 480 → 550
            width: isMobile ? "100%" : "550px",
            minWidth: 0,
            textAlign: "left",
          }}
        >
          <div style={{ width: "100%", overflow: "hidden" }}>
            <TextType
              text={["Hello, I am Mateus."]}
              typingSpeed={100}
              showCursor={true}
              cursorCharacter="|"
              className="welcome-text"
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <motion.h2
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: isMobile ? "1.4rem" : "1.8rem", // ← 1.4 → 1.1 di mobile
                color: "#e5e7eb",
                fontWeight: "600",
                display: "flex",
                flexWrap: "nowrap", // ← nowrap agar tidak turun baris
                alignItems: "center",
                gap: "8px",
                justifyContent: "flex-start",
                margin: 0,
                whiteSpace: "nowrap", // ← backup
              }}
            >
              <DecryptedText
                text="I am a"
                animateOn="view"
                sequential={true}
                speed={50}
                className="revealed"
                encryptedClassName="encrypted"
              />
              <span style={{ color: "#38bdf8", whiteSpace: "nowrap" }}>
                <DecryptedText
                  text="System Development."
                  animateOn="view"
                  sequential={true}
                  speed={50}
                  className="revealed"
                  encryptedClassName="encrypted"
                />
              </span>
            </motion.h2>

            <BlurText
              text="I am a system developer who prioritizes quality and user experience in every technological innovation I create. I am passionate about building secure, scalable, and efficient full-stack solutions, bridging the gap between robust backend architecture and seamless frontend design."
              delay={50}
              animateBy="words"
              direction="bottom"
              className="about-description"
              style={{
                marginTop: "10px",
                fontSize: isMobile ? "0.2rem" : "0.1rem",
                color: "#9ca3af",
                textAlign: "left",
              }}
            />
          </div>
        </div>

        {/* GAMBAR kanan — desktop only */}
        {!isMobile && (
          <div
            style={{
              flex: "0 0 auto", // ← tidak stretch
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UiverseCard imageSrc={myPhoto} hoverImageSrc={myPhotoHover} />
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
