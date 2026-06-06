import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "motion/react";

import LogoBSSN from "../../assets/LogoBSSN.png";

/* ════════════════════════════════════════════════════════════
   INLINE STYLES
   ════════════════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  /* ─── SHAPEGRID ─── */
  .shapegrid-canvas {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    opacity: 1; /* Diperbaiki dari 100 menjadi 1 */
  }

  /* ─── SPOTLIGHT CARD ─── */
  .card-spotlight {
    position: relative;
    border-radius: 20px;
    background-color: rgba(9, 15, 23, 0.9);
    overflow: hidden;
    --mouse-x: 50%;
    --mouse-y: 50%;
    --spotlight-color: rgba(255, 255, 255, 0.05);
    border: none;
  }
  .card-spotlight::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }
  .card-spotlight:hover::before,
  .card-spotlight:focus-within::before {
    opacity: 0.6;
  }

  /* ─── GRADIENT TEXT ─── */
  .animated-gradient-text {
    position: relative;
    margin: 0;
    display: inline-flex;
    max-width: fit-content;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 1.25rem;
    font-weight: 800;
    backdrop-filter: blur(10px);
    transition: box-shadow 0.5s ease-out;
    overflow: hidden;
    cursor: default;
  }
  .animated-gradient-text.with-border {
    padding: 0.35rem 0.75rem;
  }
  .gradient-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: inherit;
    z-index: 0;
    pointer-events: none;
  }
  .gradient-overlay::before {
    content: '';
    position: absolute;
    border-radius: inherit;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    background-color: #0a0b1a;
    z-index: -1;
  }
  .text-content {
    display: inline-block;
    position: relative;
    z-index: 2;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: clamp(2.6rem, 6vw, 4.2rem);
    font-weight: 800;
    line-height: 1.08;
  }

  /* ─── SECTION ─── */
  .exp-section {
    position: relative;
    padding: 6rem 2rem;
    min-height: 100vh;
    background: transparent;
  }

  /* ─── BACKGROUND JARING-JARING (FULL WIDTH) ─── */
  .exp-bg {
    position: absolute;
    top: 0;
    left: calc(50% - 50vw);
    width: 100vw;
    height: 100%;
    z-index: -2; 
    opacity: 0.35;
    pointer-events: none;
  }

  /* ─── BOLA CAHAYA ─── */
  .exp-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(130px);
    pointer-events: none;
    z-index: 0;
  }

  /* ─── KONTEN UTAMA KARTU ─── */
  .exp-container {
    position: relative;
    z-index: 10;
    max-width: 860px;
    margin: 0 auto;
  }

  .exp-bg-orb-1 {
    width: 480px; height: 480px;
    top: -80px; right: -140px;
    background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%);
  }
  .exp-bg-orb-2 {
    width: 380px; height: 380px;
    bottom: 60px; left: -80px;
    background: radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%);
  }

  /* ─── HEADING ─── */
  .exp-heading {
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .exp-heading.exp-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .exp-label-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
  }
  .exp-label-line {
    display: block;
    width: 32px; height: 2px;
    background: #38bdf8;
    border-radius: 1px;
    flex-shrink: 0;
  }
  .exp-label {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #38bdf8;
  }
  .exp-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2.6rem, 6vw, 4.2rem);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.08;
    margin-bottom: 1rem;
  }
  .exp-subtitle {
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: #ffffff;
    line-height: 1.75;
    max-width: 420px;
  }

  /* ─── TIMELINE ─── */
  .exp-timeline {
    position: relative;
  }
  .exp-timeline-line {
    position: absolute;
    left: 7px;
    top: 8px; bottom: 12px;
    width: 2px;
    background: rgba(255,255,255,0.05);
    border-radius: 1px;
    overflow: hidden;
    z-index: 0;
  }
  .exp-timeline-line-fill {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: calc(var(--line-progress, 0) * 100%);
    background: linear-gradient(to bottom, #38bdf8, #c084fc);
    border-radius: 1px;
    transition: height 0.02s linear;
  }

  /* ─── UNIFIED CARD ─── */
  .exp-unified-card {
    margin-left: 36px;
    position: relative;
    z-index: 1;
  }

  /* ─── ROW REVEAL ─── */
  .exp-row-reveal {
    opacity: 0;
    transform: translateX(-18px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    will-change: transform, opacity;
  }
  .exp-row-reveal.exp-visible {
    opacity: 1;
    transform: translateX(0);
  }
  .exp-row {
    position: relative;
    padding: 2rem 2.25rem 2rem 2.25rem;
    transition: background 0.4s ease;
  }
  .exp-row-divider {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  /* ─── DOT ─── */
  .exp-dot-wrap {
    position: absolute;
    left: -43px;
    top: 2.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px; height: 16px;
    z-index: 10;
  }
  .exp-dot {
    display: block;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--dot-color, #38bdf8);
    box-shadow: 0 0 8px var(--dot-color, #38bdf8), 0 0 16px var(--dot-color, #38bdf8);
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }
  .exp-dot-ping {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1.5px solid var(--dot-color, #38bdf8);
    opacity: 0;
    animation: dotPing 2.2s ease-out infinite;
  }
  @keyframes dotPing {
    0% { transform: scale(1); opacity: 0.75; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  /* ─── ROW CONTENT ─── */
  .exp-row-content { width: 100%; }
  .exp-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }
  .exp-card-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 200px;
  }
  .exp-company-badge {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--badge-color);
    flex-shrink: 0;
  }
  .exp-role {
    font-family: 'Poppins', sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: #eae8f2;
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .exp-company-row {
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    gap: 1px; 
    margin-top:2px;
  }
  .exp-company {
    font-family: 'Poppins', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    color: #ffffff;
  }
  .exp-sep { color: #3d4259; font-size: 11px; }
  .exp-location {
    font-family: 'Poppins', sans-serif;
    font-size: 11.5px;
    font-weight: 300;
    color: #ffffffb4;
  }
  .exp-card-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 7px;
    flex-shrink: 0;
  }
  .exp-period {
    font-family: 'Poppins', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--period-color, #38bdf8);
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .exp-type-badge {
    font-family: 'Poppins', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.3px;
    padding: 3px 10px;
    border-radius: 100px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }
  .exp-type-current {
    background: color-mix(in srgb, var(--badge-color) 12%, transparent);
    border-color: color-mix(in srgb, var(--badge-color) 35%, transparent);
    color: var(--badge-color);
  }
  .exp-live-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--dot-color, #38bdf8);
    animation: livePulse 2s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .exp-accent-line {
    height: 1px;
    background: linear-gradient(to right, var(--line-color, #38bdf8) 0%, rgba(255,255,255,0.06) 55%, transparent 100%);
    margin-bottom: 1.1rem;
    opacity: 0.45;
  }
  .exp-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.87rem;
    font-weight: 300;
    color: #ffffff;
    line-height: 1.8;
    margin-bottom: 1.1rem;
  }
  .exp-achievements {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 1.5rem;
    padding: 0;
  }
  .exp-ach-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.83rem;
    font-weight: 300;
    color: #ffffff;
    line-height: 1.65;
  }
  .exp-ach-bullet {
    color: var(--bullet-color, #38bdf8);
    font-size: 1rem;
    font-weight: 700;
    flex-shrink: 0;
    line-height: 1.4;
  }
  .exp-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 0.2rem;
  }
  .exp-chip {
    font-family: 'Poppins', sans-serif;
    font-size: 10.5px;
    font-weight: 500;
    padding: 3px 11px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--chip-color) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--chip-color) 25%, transparent);
    color: var(--chip-color);
    letter-spacing: 0.2px;
    transition: background 0.2s ease;
    cursor: default;
  }
  .exp-chip:hover {
    background: color-mix(in srgb, var(--chip-color) 20%, transparent);
  }

  @media (max-width: 640px) {
    .exp-section { padding: 4rem 1.5rem; }
    .exp-row { padding: 1.5rem 1.4rem; }
    .exp-card-header { flex-direction: column; gap: 0.75rem; }
    .exp-card-header-right { flex-direction: row; align-items: center; flex-wrap: wrap; }
    .exp-unified-card { margin-left: 28px; }
    .exp-dot-wrap { left: -35px; }
  }
`;

/* ════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════ */
const EXPERIENCES = [
  {
    id: 1,
    period: "Nov 2025 — May 2026",
    role: "Full-Stack Developer, System Engineer",
    company: "Badan Siber dan Sandi Negara",
    location: "Jakarta, Indonesia",
    type: "Intern",
    current: false,
    logo: LogoBSSN,
    description:
      "Led a 3-person team across 2 separate projects to develop a secure entry Android application and a web-based malware analysis system.",
    achievements: [
      "Developed a secure key-entry Android application using Flutter featuring data encryption based on high-level protection standards.",
      "Built and engineered an Automatic Malware Analyzer sandbox platform using Docker and Python, achieving accurate behavior analysis and score classification for samples.",
      "Streamlined data pipelines by integrating containerized environments with MISP threat repositories to enhance automated security workflows.",
    ],
    tech: [
      "Flutter",
      "Dart",
      "Firebase",
      "Python",
      "Django",
      "Docker",
      "Nginx",
      "Ubuntu Server",
      "Apache Guacamole",
    ],
    color: "#00d4ff",
  },
];

/* ════════════════════════════════════════════════════════════
   SHAPEGRID COMPONENT
   ════════════════════════════════════════════════════════════ */
function ShapeGrid({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "rgba(56,189,248,0.15)",
  squareSize = 40,
  hoverFillColor = "rgba(56,189,248,0.08)",
  shape = "square",
  hoverTrailAmount = 3,
  className = "",
}) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);
  const trailCells = useRef([]);
  const cellOpacities = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const offsetX =
        ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
      const offsetY =
        ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(canvas.width / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * squareSize + offsetX;
          const sy = row * squareSize + offsetY;
          const cellKey = `${col},${row}`;
          const alpha = cellOpacities.current.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
            ctx.globalAlpha = 1;
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
    };

    const updateCellOpacities = () => {
      const targets = new Map();
      if (hoveredSquare.current)
        targets.set(`${hoveredSquare.current.x},${hoveredSquare.current.y}`, 1);
      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.current.length; i++) {
          const t = trailCells.current[i];
          const key = `${t.x},${t.y}`;
          if (!targets.has(key))
            targets.set(
              key,
              (trailCells.current.length - i) / (trailCells.current.length + 1),
            );
        }
      }
      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) cellOpacities.current.set(key, 0);
      }
      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;
        if (next < 0.005) cellOpacities.current.delete(key);
        else cellOpacities.current.set(key, next);
      }
    };

    const updateAnimation = () => {
      const eff = Math.max(speed, 0.1);
      const wrap = squareSize;
      switch (direction) {
        case "right":
          gridOffset.current.x = (gridOffset.current.x - eff + wrap) % wrap;
          break;
        case "left":
          gridOffset.current.x = (gridOffset.current.x + eff + wrap) % wrap;
          break;
        case "up":
          gridOffset.current.y = (gridOffset.current.y + eff + wrap) % wrap;
          break;
        case "down":
          gridOffset.current.y = (gridOffset.current.y - eff + wrap) % wrap;
          break;
        case "diagonal":
          gridOffset.current.x = (gridOffset.current.x - eff + wrap) % wrap;
          gridOffset.current.y = (gridOffset.current.y - eff + wrap) % wrap;
          break;
        default:
          break;
      }
      updateCellOpacities();
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const offsetX =
        ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
      const offsetY =
        ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
      const col = Math.floor((mouseX - offsetX) / squareSize);
      const row = Math.floor((mouseY - offsetY) / squareSize);
      if (
        !hoveredSquare.current ||
        hoveredSquare.current.x !== col ||
        hoveredSquare.current.y !== row
      ) {
        if (hoveredSquare.current && hoverTrailAmount > 0) {
          trailCells.current.unshift({ ...hoveredSquare.current });
          if (trailCells.current.length > hoverTrailAmount)
            trailCells.current.length = hoverTrailAmount;
        }
        hoveredSquare.current = { x: col, y: row };
      }
    };

    const handleMouseLeave = () => {
      if (hoveredSquare.current && hoverTrailAmount > 0) {
        trailCells.current.unshift({ ...hoveredSquare.current });
        if (trailCells.current.length > hoverTrailAmount)
          trailCells.current.length = hoverTrailAmount;
      }
      hoveredSquare.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    direction,
    speed,
    borderColor,
    hoverFillColor,
    squareSize,
    shape,
    hoverTrailAmount,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`shapegrid-canvas ${className}`}
      style={{ display: "block" }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   SPOTLIGHT CARD
   ════════════════════════════════════════════════════════════ */
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(20, 61, 89, 0.5)",
}) {
  const divRef = useRef(null);
  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect();
    divRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    divRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };
  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   GRADIENT TEXT
   ════════════════════════════════════════════════════════════ */
function GradientText({
  children,
  className = "",
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
  showBorder = false,
  direction = "horizontal",
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

/* ════════════════════════════════════════════════════════════
   HOOKS
   ════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════ */
function TimelineDot({ color, current }) {
  return (
    <div className="exp-dot-wrap">
      {current && (
        <span className="exp-dot-ping" style={{ "--dot-color": color }} />
      )}
      <span className="exp-dot" style={{ "--dot-color": color }} />
    </div>
  );
}

function TechChip({ label, color }) {
  return (
    <span className="exp-chip" style={{ "--chip-color": color }}>
      {label}
    </span>
  );
}

function ExperienceRow({ item, index, isLast }) {
  const [ref, visible] = useReveal(0.1);
  const rowRef = useRef(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  const hex2 = (n) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");

  const handleMouseMove = (e) => {
    const el = rowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const prox = Math.max(
      Math.abs(x - r.width / 2) / (r.width / 2),
      Math.abs(y - r.height / 2) / (r.height / 2),
    );
    setGlowIntensity(Math.min(1, Math.max(0, (prox - 0.1) * 1.2)));
  };

  return (
    <div
      ref={ref}
      className={`exp-row-reveal ${visible ? "exp-visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        ref={rowRef}
        className={`exp-row ${!isLast ? "exp-row-divider" : ""}`}
        style={{
          background:
            glowIntensity > 0.05
              ? `${item.color}${hex2(glowIntensity * 14)}`
              : "transparent",
          boxShadow: "none",
          transition:
            glowIntensity > 0.05
              ? "none"
              : "background 0.4s ease, box-shadow 0.4s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setGlowIntensity(0)}
      >
        <TimelineDot color={item.color} current={item.current} />

        <div className="exp-row-content">
          <div className="exp-card-header">
            <div className="exp-card-header-left">
              <div
                className="exp-company-badge"
                style={{ "--badge-color": item.color }}
              >
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.company}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  item.company.charAt(0)
                )}
              </div>

              <div>
                <h3 className="exp-role">{item.role}</h3>
                <div className="exp-company-row">
                  <span className="exp-company">{item.company}</span>
                  <span className="exp-location">{item.location}</span>
                </div>
              </div>
            </div>

            <div className="exp-card-header-right">
              <div
                className="exp-period"
                style={{ "--period-color": item.color }}
              >
                {item.period}
              </div>

              <span
                className={`exp-type-badge ${item.current ? "exp-type-current" : ""}`}
                style={item.current ? { "--badge-color": item.color } : {}}
              >
                {item.current ? (
                  <>
                    <span
                      className="exp-live-dot"
                      style={{ "--dot-color": item.color }}
                    />
                    {item.type}
                  </>
                ) : (
                  item.type
                )}
              </span>
            </div>
          </div>

          <div
            className="exp-accent-line"
            style={{ "--line-color": item.color }}
          />

          <p className="exp-desc">{item.description}</p>

          <ul className="exp-achievements">
            {item.achievements.map((ach, i) => (
              <li key={i} className="exp-ach-item">
                <span
                  className="exp-ach-bullet"
                  style={{ "--bullet-color": item.color }}
                >
                  ›
                </span>
                {ach}
              </li>
            ))}
          </ul>

          {/* Menambahkan garis gradasi yang sama persis */}
          <div
            className="exp-accent-line"
            style={{
              "--line-color": item.color,
              marginTop: "1.5rem", // Memberi jarak dengan teks di atasnya
              marginBottom: "0.8rem", // Memberi jarak dengan chip di bawahnya
            }}
          />

          <div className="exp-chips">
            {item.tech.map((t) => (
              <TechChip key={t} label={t} color={item.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading() {
  const [ref, visible] = useReveal(0.2);

  return (
    <div ref={ref} className={`exp-heading ${visible ? "exp-visible" : ""}`}>
      <div className="exp-label-row"></div>

      <h2 className="exp-title">
        <GradientText
          colors={["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"]}
          animationSpeed={4}
          showBorder={false}
        >
          Work Experience
        </GradientText>
      </h2>

      <p className="exp-subtitle">
        Here is an overview of my professional experience.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════ */
export default function Experience() {
  const lineRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = lineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wH = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (wH - rect.top) / (rect.height + wH * 0.3)),
      );
      el.style.setProperty("--line-progress", progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <section className="exp-section" id="experience">
        {/* Background ShapeGrid yang dinamis */}
        <div className="exp-bg">
          <ShapeGrid
            speed={0.4}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(56,189,248,0.12)"
            hoverFillColor="rgba(56,189,248,0.07)"
            hoverTrailAmount={5}
            shape="square"
          />
        </div>

        <div className="exp-bg-orb exp-bg-orb-1" />
        <div className="exp-bg-orb exp-bg-orb-2" />

        <div className="exp-container">
          <SectionHeading />

          <div className="exp-timeline" ref={lineRef}>
            {/* Vertical line */}
            <div className="exp-timeline-line">
              <div className="exp-timeline-line-fill" />
            </div>

            {/* Unified card wrapped in SpotlightCard */}
            <div className="exp-unified-card">
              <SpotlightCard spotlightColor="rgba(20, 61, 89, 0.5)">
                {EXPERIENCES.map((item, i) => (
                  <ExperienceRow
                    key={item.id}
                    item={item}
                    index={i}
                    isLast={i === EXPERIENCES.length - 1}
                  />
                ))}
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
