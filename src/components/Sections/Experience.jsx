import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import "./Experience.css";

import LogoBSSN from "../../assets/LogoBSSN.webp";

/* ════════════════════════════════════════════════════════════
   SHAPEGRID — CSS-ONLY, NO RAF, NO JS PER FRAME!
   ════════════════════════════════════════════════════════════ */
function ShapeGrid({ className = "" }) {
  return (
    <div className={`shapegrid-container ${className}`}>
      <div className="shapegrid-canvas-css" />
    </div>
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
  const lastSpotTime = useRef(0);
  const cachedRect = useRef(null);
  const lastRectTime = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastSpotTime.current < 16) return;
      lastSpotTime.current = now;

      const now2 = performance.now();
      if (!cachedRect.current || now2 - lastRectTime.current > 100) {
        cachedRect.current = divRef.current.getBoundingClientRect();
        lastRectTime.current = now2;
      }
      const rect = cachedRect.current;

      divRef.current.style.setProperty(
        "--mouse-x",
        `${e.clientX - rect.left}px`,
      );
      divRef.current.style.setProperty(
        "--mouse-y",
        `${e.clientY - rect.top}px`,
      );
      divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    },
    [spotlightColor],
  );

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
   GRADIENT TEXT — keyframe sudah statis di Experience.css,
   tidak perlu lagi inject <style> manual ke document.head
   ════════════════════════════════════════════════════════════ */
function GradientText({
  children,
  className = "",
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
  showBorder = false,
}) {
  const gradientStyle = useMemo(() => {
    const gradientColors = [...colors, colors[0]].join(", ");
    return {
      backgroundImage: `linear-gradient(to right, ${gradientColors})`,
      backgroundSize: "300% 100%",
      backgroundRepeat: "repeat",
      animation: `gradientShift ${animationSpeed * 2}s ease infinite`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join(","), animationSpeed]);

  return (
    <div
      className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${className}`}
    >
      {showBorder && <div className="gradient-overlay" style={gradientStyle} />}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
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
  const lastMoveTime = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastMoveTime.current < 50) return;
      lastMoveTime.current = now;

      const el = rowRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const prox = Math.max(
        Math.abs(x - r.width / 2) / (r.width / 2),
        Math.abs(y - r.height / 2) / (r.height / 2),
      );
      const intensity = Math.min(1, Math.max(0, (prox - 0.1) * 1.2));

      if (intensity > 0.05) {
        const hex = Math.round(intensity * 14)
          .toString(16)
          .padStart(2, "0");
        el.style.background = `${item.color}${hex}`;
      } else {
        el.style.background = "transparent";
      }
    },
    [item.color],
  );

  const handleMouseLeave = useCallback(() => {
    if (rowRef.current) rowRef.current.style.background = "transparent";
  }, []);

  return (
    <div
      ref={ref}
      className={`exp-row-reveal ${visible ? "exp-visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        ref={rowRef}
        className={`exp-row ${!isLast ? "exp-row-divider" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
                    width={46}
                    height={46}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  item.company?.charAt(0)
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
            {Array.isArray(item.achievements) &&
              item.achievements.map((ach, i) => (
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

          <div
            className="exp-accent-line"
            style={{
              "--line-color": item.color,
              marginTop: "1.5rem",
              marginBottom: "0.8rem",
            }}
          />

          <div className="exp-chips">
            {Array.isArray(item.tech) &&
              item.tech.map((t) => (
                <TechChip key={t} label={t} color={item.color} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading() {
  const { t } = useTranslation();
  const [ref, visible] = useReveal(0.2);

  return (
    <div
      ref={ref}
      className={`section-title-wrapper exp-heading ${visible ? "exp-visible" : ""}`}
    >
      <h2 className="exp-title">
        <GradientText
          colors={["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"]}
          animationSpeed={4}
          showBorder={false}
        >
          {t("experience.title")}
        </GradientText>
      </h2>
      <p className="exp-subtitle">{t("experience.subtitle")}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════ */
export default function Experience() {
  const { t } = useTranslation();
  const lineRef = useRef(null);

  // Dulu array ini dibangun ulang di SETIAP render + tiap kali t() dipanggil.
  // Sekarang cuma dihitung ulang kalau t (bahasa) berubah.
  const EXPERIENCES = useMemo(
    () => [
      {
        id: 1,
        period: t("experience_items.bssn.period"),
        role: t("experience_items.bssn.role"),
        company: t("experience_items.bssn.company"),
        location: t("experience_items.bssn.location"),
        type: t("experience_items.bssn.type"),
        current: false,
        logo: LogoBSSN,
        description: t("experience_items.bssn.description"),
        achievements: t("experience_items.bssn.achievements", {
          returnObjects: true,
        }),
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
    ],
    [t],
  );

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = lineRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const wH = window.innerHeight;
          const progress = Math.min(
            1,
            Math.max(0, (wH - rect.top) / (rect.height + wH * 0.3)),
          );
          el.style.setProperty("--line-progress", progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="exp-section" id="experience">
      <div className="exp-bg">
        <ShapeGrid />
      </div>

      <div className="exp-bg-orb exp-bg-orb-1" />
      <div className="exp-bg-orb exp-bg-orb-2" />

      <div className="exp-container">
        <SectionHeading />
        <div className="exp-timeline" ref={lineRef}>
          <div className="exp-timeline-line">
            <div className="exp-timeline-line-fill" />
          </div>
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
  );
}
