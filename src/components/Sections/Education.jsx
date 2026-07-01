import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";
import ScrollStack, { ScrollStackItem } from "../lib/ScrollStack/ScrollStack";

import logo1 from "../../assets/educationIcon/1.webp";
import logo2 from "../../assets/educationIcon/2.webp";
import logo3 from "../../assets/educationIcon/3.webp";
import logo4 from "../../assets/educationIcon/4.webp";

const cardColors = ["#1a1a22", "#161621", "#1a1a2a", "#12121a"]; // Sedikit disesuaikan agar lebih senada

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

const Education = () => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [screenSize, setScreenSize] = useState("xl");

  const [headingRef, headingVisible] = useReveal(0.2);

  // Data dengan mapping ke i18n
  const educationData = [
    {
      logo: logo4,
      photo: new URL("../../assets/educationIcon/UNIV.webp", import.meta.url)
        .href,
      ...t("education_items.0", { returnObjects: true }),
    },
    {
      logo: logo3,
      photo: new URL("../../assets/educationIcon/SMA.webp", import.meta.url)
        .href,
      ...t("education_items.1", { returnObjects: true }),
    },
    {
      logo: logo2,
      photo: new URL("../../assets/educationIcon/SMP.webp", import.meta.url)
        .href,
      ...t("education_items.2", { returnObjects: true }),
    },
    {
      logo: logo1,
      photo: new URL("../../assets/educationIcon/SD.webp", import.meta.url)
        .href,
      ...t("education_items.3", { returnObjects: true }),
    },
  ];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 320) setScreenSize("xs");
      else if (w <= 480) setScreenSize("sm");
      else if (w <= 768) setScreenSize("md");
      else if (w <= 1024) setScreenSize("lg");
      else setScreenSize("xl");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const logoSize = { xs: 40, sm: 44, md: 50, lg: 56, xl: 64 }[screenSize];
  const gap = {
    xs: "0.6rem",
    sm: "0.8rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  }[screenSize];
  const padding = {
    xs: "1rem 1rem",
    sm: "1.1rem 1.25rem",
    md: "1.25rem 1.5rem",
    lg: "1.4rem 1.75rem",
    xl: "1.5rem 2rem",
  }[screenSize];
  const titleSize = {
    xs: "0.75rem",
    sm: "0.82rem",
    md: "0.9rem",
    lg: "0.96rem",
    xl: "1rem",
  }[screenSize];
  const subSize = {
    xs: "0.65rem",
    sm: "0.7rem",
    md: "0.75rem",
    lg: "0.82rem",
    xl: "0.85rem",
  }[screenSize];
  const dateSize = {
    xs: "0.6rem",
    sm: "0.65rem",
    md: "0.7rem",
    lg: "0.73rem",
    xl: "0.75rem",
  }[screenSize];
  const hoverTitle = {
    xs: "0.85rem",
    sm: "0.9rem",
    md: "0.95rem",
    lg: "1rem",
    xl: "1.1rem",
  }[screenSize];

  return (
    <section id="education">
      <div
        ref={headingRef}
        className="section-title-wrapper"
        style={{
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <h2
          className="section-title"
          style={{
            margin: 0,
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
            fontWeight: 800,
            lineHeight: 1.08,
          }}
        >
          <GradientText
            colors={["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"]}
            animationSpeed={4}
          >
            {t("education.title")}
          </GradientText>
        </h2>
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 300,
            textAlign: "center",
            color: "#ffffff",
            lineHeight: 1.75,
            maxWidth: "700px",
            margin: "0 auto",
            marginBottom: "-2px",
          }}
        >
          {t("education.subtitle")}
        </p>
      </div>

      <ScrollStack
        itemDistance={6}
        itemScale={0.03}
        itemStackDistance={20}
        stackPosition="22%"
        baseScale={0.94}
      >
        {educationData.map((item, index) => (
          <ScrollStackItem key={index}>
            <div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: "100%",
                height: "100%",
                background: cardColors[index % cardColors.length],
                borderRadius: "28px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {item.photo && (
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                  <img
                    src={item.photo}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: "-1px",
                      borderRadius: "28px",
                      background: `rgba(0,0,0,${hoveredIndex === index ? 0.15 : 0.82})`,
                      transition: "background 0.4s",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  gap,
                  padding,
                  zIndex: 1,
                  opacity: hoveredIndex === index ? 0 : 1,
                  transition: "opacity 0.35s",
                }}
              >
                <img
                  src={item.logo}
                  alt={item.position}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    objectFit: "contain",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      color: "#38bdf8",
                      fontSize: dateSize,
                      fontWeight: 600,
                    }}
                  >
                    {item.date}
                  </span>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: titleSize,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {item.position}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: subSize, margin: 0 }}>
                    {item.companyName}
                  </p>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "2rem",
                  zIndex: 2,
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition: "opacity 0.35s",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    color: "#38bdf8",
                    fontSize: dateSize,
                    fontWeight: 600,
                    textShadow:
                      "0 0 12px rgba(56,189,248,0.75), 0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {item.date}
                </span>
                <p
                  style={{
                    color: "#fff",
                    fontSize: hoverTitle,
                    fontWeight: 700,
                    margin: 0,
                    textShadow:
                      "0 0 16px rgba(255,255,255,0.35), 0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  {item.position}
                </p>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

function GradientText({
  children,
  className = "",
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
  showBorder = false,
  pauseOnHover = false,
  yoyo = true,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;
    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;
      if (cycleTime < animationDuration)
        progress.set((cycleTime / animationDuration) * 100);
      else
        progress.set(
          100 - ((cycleTime - animationDuration) / animationDuration) * 100,
        );
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, (p) => `${p}% 50%`);
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);
  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientColors = [...colors, colors[0]].join(", ");
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${gradientColors})`,
    backgroundSize: "300% 100%",
    backgroundRepeat: "repeat",
  };

  return (
    <motion.div
      className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ textAlign: "center", width: "100%" }} // ← override lokal
    >
      {showBorder && (
        <motion.div
          className="gradient-overlay"
          style={{ ...gradientStyle, backgroundPosition }}
        />
      )}
      <motion.div
        className="text-content"
        style={{
          ...gradientStyle,
          backgroundPosition,
          textAlign: "center", // ← override lokal
          width: "100%", // ← override lokal
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Education;
