import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "motion/react";

const CV_PATH = "/pdf/CV Mateus Appuwan Situmorang.pdf";

export const CV = () => {
  return (
    <section id="cv" className="container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
          marginTop: "2rem",
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
            Curriculum Vitae
          </GradientText>
        </h2>
        <p
          className="exp-subtitle"
          style={{
            color: "#ffffff",
            textAlign: "center",
            margin: "12px auto 0",
          }}
        >
          The following is my curriculum vitae.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #222",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "0 auto",
          background: "#111",
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* 
          Wrapper pakai padding-bottom trick untuk aspect ratio,
          tapi karena PDF lebih baik pakai height tetap,
          kita pakai className dan atur di CSS global.
        */}
        <iframe
          src={`${CV_PATH}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
          title="CV - Mateus Appuwan Situmorang"
          width="100%"
          className="cv-iframe"
          style={{ display: "block", border: "none" }}
        >
          <p style={{ padding: "2rem", color: "#aaa", textAlign: "center" }}>
            Your browser does not support PDF viewing.{" "}
            <a href={CV_PATH} style={{ color: "#38bdf8" }}>
              Click here to download.
            </a>
          </p>
        </iframe>
      </div>

      <div style={{ height: "80px", width: "100%" }}></div>
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
    >
      {showBorder && (
        <motion.div
          className="gradient-overlay"
          style={{ ...gradientStyle, backgroundPosition }}
        />
      )}
      <motion.div
        className="text-content"
        style={{ ...gradientStyle, backgroundPosition }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default CV;
