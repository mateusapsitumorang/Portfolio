import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";
import ScrollStack, { ScrollStackItem } from "../lib/ScrollStack/ScrollStack";

import logo1 from "../../assets/educationIcon/1.png";
import logo2 from "../../assets/educationIcon/2.png";
import logo3 from "../../assets/educationIcon/3.png";
import logo4 from "../../assets/educationIcon/4.png";

const educationData = [
  {
    date: "2021 - 2025",
    logo: logo4,
    position: "Sanata Dharma University",
    companyName: "Sleman, Special Region of Yogyakarta",
    photo: new URL("../../assets/educationIcon/UNIV.png", import.meta.url).href,
  },
  {
    date: "2018 - 2021",
    logo: logo3,
    position: "Public Senior High School 02 Dente Teladas",
    companyName: "Tulang Bawang, Lampung",
    photo: new URL("../../assets/educationIcon/SMA.png", import.meta.url).href,
  },
  {
    date: "2015 - 2018",
    logo: logo2,
    position: "Public Junior High School 01 Dente Teladas",
    companyName: "Tulang Bawang, Lampung",
    photo: new URL("../../assets/educationIcon/SMP.png", import.meta.url).href,
  },
  {
    date: "2009 - 2015",
    logo: logo1,
    position: "Public Elementary School 01 Pasiran Jaya",
    companyName: "Tulang Bawang, Lampung",
    photo: new URL("../../assets/educationIcon/SD.png", import.meta.url).href,
  },
];

const cardColors = ["#1a1a2e", "#16213e", "#0f3460", "#1b1b2f"];

// ─────────────────────────────────────────────
// GRADIENTTEXT
// ─────────────────────────────────────────────
function GradientText({
  children,
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
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
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;
    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const ct = elapsedRef.current % fullCycle;
      progress.set(
        ct < animationDuration
          ? (ct / animationDuration) * 100
          : 100 - ((ct - animationDuration) / animationDuration) * 100,
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

  return (
    <motion.span
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{
        backgroundImage: `linear-gradient(to right, ${[...colors, colors[0]].join(", ")})`,
        backgroundSize: "300% 100%",
        backgroundRepeat: "repeat",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        backgroundPosition,
      }}
    >
      {children}
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────
const Education = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      id="education"
      style={{ width: "100%", scrollMarginTop: "80px", position: "relative" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "2rem",
        }}
      >
        <h2
          className="section-title"
          style={{
            margin: 0,
            fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
            fontWeight: 800,
            lineHeight: 1.08,
          }}
        >
          <GradientText
            colors={["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"]}
            animationSpeed={4}
          >
            My Education
          </GradientText>
        </h2>
        <p
          className="exp-subtitle"
          style={{
            color: "#ffffff",
            textAlign: "center",
            margin: "26px auto 0",
          }}
        >
          The following outlines my educational journey.
        </p>
      </div>

      {/* ScrollStack */}
      <ScrollStack
        itemDistance={6}
        itemScale={0.03}
        itemStackDistance={20}
        stackPosition="22%"
        scaleEndPosition="10%"
        baseScale={0.94}
        useWindowScroll={true}
      >
        {educationData.map((item, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <ScrollStackItem key={index}>
              <div
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: cardColors[index % cardColors.length],
                  borderRadius: "28px",
                  boxSizing: "border-box",
                  border: "none", // ← hapus border
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  clipPath: "inset(0 round 28px)",
                  isolation: "isolate", // ← tambahkan
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)", // ← fix Safari
                  transform: "translateZ(0)",
                }}
              >
                {/* ── FOTO BACKGROUND ── */}
                {item.photo && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <img
                      src={item.photo}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        borderRadius: "28px",
                      }}
                    />
                    {/* Overlay: gelap (0.82) saat normal, terang (0.15) saat hover */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "-1px",
                        borderRadius: "28px",
                        background: `rgba(0,0,0,${isHovered ? 0.15 : 0.82})`,
                        transition: "background 0.4s ease",
                      }}
                    />
                  </div>
                )}

                {/* ── KONTEN TEKS (hilang saat hover) ── */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "1.5rem 2rem",
                    zIndex: 1,
                    opacity: isHovered ? 0 : 1,
                    transform: isHovered ? "translateY(8px)" : "translateY(0)",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                    pointerEvents: "none",
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      flexShrink: 0,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.logo}
                      alt={item.position}
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  {/* Teks */}
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "#38bdf8",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {item.date}
                    </span>
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: 700,
                        margin: "0 0 0.3rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.position}
                    </h3>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        margin: 0,
                      }}
                    >
                      {item.companyName}
                    </p>
                  </div>
                </div>

                {/* ── LABEL HOVER (muncul di pojok bawah) ── */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "2rem",
                    zIndex: 2,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "#38bdf8",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      marginBottom: "0.3rem",
                      // ← shadow pada date saat hover
                      textShadow:
                        "0 2px 10px rgba(10, 42, 56, 0.7), 0 0 20px rgba(11, 38, 50, 0.3)",
                    }}
                  >
                    {item.date}
                  </span>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.3,
                      // ← shadow pada nama posisi saat hover
                      textShadow:
                        "0 2px 16px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    {item.position}
                  </p>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
};

export default Education;
