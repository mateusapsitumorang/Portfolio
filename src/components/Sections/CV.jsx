import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "motion/react";

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

export const CV = () => {
  const { t, i18n } = useTranslation();
  const [headingRef, headingVisible] = useReveal(0.2);
  const [iframeRef, iframeVisible] = useReveal(0.1);

const CV_PATH = i18n.language === "id"
    ? "/pdf/CV Mateus Appuwan Situmorang id.pdf"
    : "/pdf/CV Mateus Appuwan Situmorang.pdf";

  return (
    <section id="cv" className="container">
      {/* Heading dengan animasi */}
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
            {t("cv.title")}
          </GradientText>
        </h2>
        <p
          className="exp-subtitle"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 300,
            textAlign: "center",
            color: "#ffffff",
            lineHeight: 1.75,
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {t("cv.subtitle")}
        </p>
      </div>

      {/* iframe dengan animasi, delay sedikit setelah heading */}
      <div
        ref={iframeRef}
        className="cv-wrapper"
        style={{
          opacity: iframeVisible ? 1 : 0,
          transform: iframeVisible
            ? "translateY(0) scale(1)"
            : "translateY(32px) scale(0.98)",
          transition:
            "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) 0.2s",
          border: "1px solid #222",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "0 auto",
          background: "#111",
          width: "100%",
          boxShadow: iframeVisible
            ? "0 10px 40px rgba(56,189,248,0.08), 0 10px 30px rgba(0,0,0,0.5)"
            : "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
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
