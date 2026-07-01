import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "motion/react";
import komanstraThumb from "../../assets/project/komanstra-thumb.webp";
import analystThumb from "../../assets/project/analystMal-thumb.webp";
import detailSSKomanstra from "../../assets/project/detailKomanstra.webp";
import detailSSAnalystMal from "../../assets/project/detailAnalystMal.webp";
import yogtripThumb from "../../assets/project/yogtrip-thumb.webp";
import localineThumb from "../../assets/project/localine-thumb.webp";
import detailSSYogtrip from "../../assets/project/detailYogtrip.webp";
import detailSSLocaline from "../../assets/project/detailLocaline.webp";

/* ─────────────────────────────────────────────
   Hook: returns current breakpoint label
───────────────────────────────────────────── */
const getBreakpoint = (width) => {
  if (width < 480) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  return "xl";
};

const useBreakpoint = () => {
  const [bp, setBp] = useState(
    typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "xl",
  );
  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CAROUSEL_CSS = `
  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes modalPopOut {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to   { opacity: 0; transform: scale(0.95) translateY(20px); }
  }
  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes backdropFadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }

  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOutToLeft {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-48px); }
  }
  @keyframes slideOutToRight {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(48px); }
  }

  .project-card-reveal {
  opacity: 0;
  transform: translateY(32px) scale(0.97);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.2,0.64,1);
}
.project-card-reveal.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

  .carousel-card-exit-left  { animation: slideOutToLeft  0.26s cubic-bezier(0.4,0,1,1) both; }
  .carousel-card-exit-right { animation: slideOutToRight 0.26s cubic-bezier(0.4,0,1,1) both; }
  .carousel-card-enter-left { animation: slideInFromRight 0.32s cubic-bezier(0.34,1.2,0.64,1) both; }
  .carousel-card-enter-right{ animation: slideInFromLeft  0.32s cubic-bezier(0.34,1.2,0.64,1) both; }

  .carousel-card-enter-left:nth-child(2),
  .carousel-card-enter-right:nth-child(2) { animation-delay: 0.04s; }
  .carousel-card-enter-left:nth-child(3),
  .carousel-card-enter-right:nth-child(3) { animation-delay: 0.08s; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.02); border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15); border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.15) transparent;
    scrollbar-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
`;

// ─── Scroll Lock ──────────────────────────────────────────────────────────────

function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [active]);
}

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

// ─── Thumbnail Placeholder ────────────────────────────────────────────────────

const ThumbnailPlaceholder = ({ color, title }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#1a1a22",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "30px 0",
    }}
  >
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke={color || "#374151"}
        strokeWidth="1.2"
      />
      <path d="M3 9h18" stroke={color || "#374151"} strokeWidth="1.2" />
      <circle cx="7" cy="6" r="1" fill={color || "#374151"} />
      <circle cx="10.5" cy="6" r="1" fill={color || "#374151"} />
      <path
        d="M8 14l2 2 4-4"
        stroke={color || "#374151"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
    <span style={{ fontSize: "12px", color: "#4b5563", textAlign: "center" }}>
      {title}
    </span>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

const Divider = () => (
  <hr
    style={{
      border: "none",
      borderTop: "0.5px solid rgba(255,255,255,0.08)",
      margin: "20px 0",
    }}
  />
);

const sectionLabelStyle = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "12px",
  marginTop: 0,
};

const ProjectModal = ({ project, onClose }) => {
  const { t } = useTranslation(); // i18n untuk Modal
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  useScrollLock(true);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 280);
  }, [onClose]);

  useEffect(() => {
    const h = (e) => e.key === "Escape" && triggerClose();
    window.addEventListener("keydown", h);
    if (modalRef.current) modalRef.current.focus();
    return () => window.removeEventListener("keydown", h);
  }, [triggerClose]);

  // Safeguard array jika belum termuat sempurna
  const infoArray = Array.isArray(project.info) ? project.info : [];

  const statusItem = infoArray.find(
    (item) => item.label === "Status" || item.label === "Status",
  );
  const isLive = statusItem
    ? statusItem.value.toLowerCase().includes("live") &&
      !statusItem.value.toLowerCase().includes("not") &&
      !statusItem.value.toLowerCase().includes("tidak")
    : false;

  const validScreenshots = Array.isArray(project.screenshots)
    ? project.screenshots.filter((shot) => shot.src)
    : [];

  const disabledBtnStyle = {
    flex: 1,
    padding: "11px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "not-allowed",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && triggerClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: isClosing
          ? "backdropFadeOut 0.28s ease forwards"
          : "backdropFadeIn 0.3s ease forwards",
        willChange: "opacity",
        transform: "translateZ(0)",
      }}
    >
      <div
        ref={modalRef}
        tabIndex={0}
        className="custom-scrollbar"
        onWheel={(e) => e.stopPropagation()}
        style={{
          background: "#111116",
          borderRadius: "20px 0 0 20px",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "72vh",
          overflowY: "auto",
          overflowX: "hidden",
          border: "0.5px solid rgba(255,255,255,0.12)",
          boxShadow: `0 0 60px -10px ${project.accentColor}30`,
          outline: "none",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          animation: isClosing
            ? "modalPopOut 0.28s cubic-bezier(0.4,0,1,1) forwards"
            : "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div
          style={{
            padding: "24px 28px 18px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            position: "sticky",
            top: 0,
            background: "#111116",
            zIndex: 20,
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            transform: "translateZ(0)",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              {project.title}
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
              {project.subtitle}
            </p>
          </div>
          <button
            onClick={triggerClose}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              border: "none",
              background: "rgba(255,255,255,0.07)",
              color: "#9ca3af",
              fontSize: "16px",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "24px 28px 32px", flex: 1 }}>
          <p style={sectionLabelStyle}>{t("projects_ui.preview")}</p>
          <div
            className="custom-scrollbar"
            style={{
              width: "100%",
              maxHeight: "380px",
              overflowY: "auto",
              borderRadius: "12px",
              border: "0.5px solid rgba(255,255,255,0.1)",
              background: "#1a1a22",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              transform: "translateZ(0)",
            }}
          >
            {validScreenshots.length > 0 ? (
              validScreenshots.map((shot, i) => (
                <img
                  key={i}
                  src={shot.src}
                  alt={shot.label}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ))
            ) : (
              <ThumbnailPlaceholder
                color={project.accentColor}
                title={t("projects_ui.preview_unavailable")}
              />
            )}
          </div>

          <Divider />
          <p style={sectionLabelStyle}>{t("projects_ui.description")}</p>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {project.fullDesc}
          </p>

          <Divider />
          <p style={sectionLabelStyle}>{t("projects_ui.tech_stack")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Array.isArray(project.techStack) &&
              project.techStack.map((tech, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    fontSize: "12.5px",
                    color: "#d1d5db",
                  }}
                >
                  <div
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: tech.color,
                    }}
                  />
                  {tech.name}
                </div>
              ))}
          </div>

          <Divider />
          <p style={sectionLabelStyle}>{t("projects_ui.project_details")}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {infoArray.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    margin: "0 0 3px",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#e5e7eb",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Divider />
          <div style={{ display: "flex", gap: "12px" }}>
            {isLive ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: `1px solid ${project.accentColor}40`,
                  background: `${project.accentColor}15`,
                  color: project.accentColor,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {t("projects_ui.live_demo")}
              </a>
            ) : (
              <span
                style={disabledBtnStyle}
                title={t("projects_ui.not_live_tooltip")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {t("projects_ui.live_demo")}
              </span>
            )}

            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "#d1d5db",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <svg
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                {t("projects_ui.repositories")}
              </a>
            ) : (
              <span
                style={disabledBtnStyle}
                title={t("projects_ui.private_repo_tooltip")}
              >
                <svg
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                {t("projects_ui.repositories")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────

const ProjectCard = ({
  project,
  onClick,
  animClass,
  revealIndex,
  sectionVisible,
}) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`project-card-reveal ${sectionVisible ? "visible" : ""} ${animClass}`}
      style={{
        transitionDelay: sectionVisible ? `${revealIndex * 0.12}s` : "0s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16/10",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#1a1a22",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          position: "relative",
        }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <ThumbnailPlaceholder
            color={project.accentColor}
            title={project.title}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "transform 0.25s cubic-bezier(0.34,1.4,0.64,1)",
            }}
          >
            {t("projects_ui.view_details")}
          </span>
        </div>
      </div>

      <div style={{ padding: "16px 4px 8px" }}>
        <h3
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: hovered ? "#fff" : "#e5e7eb",
            margin: "0 0 4px",
            transition: "color 0.2s ease",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            color: hovered ? project.accentColor : "#6b7280",
            margin: 0,
            transition: "color 0.2s ease",
          }}
        >
          {project.category}
        </p>
      </div>
    </div>
  );
};

// ─── NavButton ────────────────────────────────────────────────────────────────

const NavBtn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      border: `0.5px solid ${disabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.18)"}`,
      background: "transparent",
      color: disabled ? "#374151" : "#d1d5db",
      fontSize: "22px",
      cursor: disabled ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
    }}
  >
    {children}
  </button>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Projects = () => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";
  const CARDS = isMobile ? 1 : isTablet ? 2 : 3;

  // Memindahkan definisi projectsData ke dalam komponen agar bisa menggunakan t()
  const projectsData = useMemo(
    () => [
      {
        id: "komanstra-secure-ht-box",
        title: t("projects_items.komanstra.title"),
        subtitle: t("projects_items.komanstra.subtitle"),
        category: t("projects_items.komanstra.category"),
        thumbnail: komanstraThumb,
        fullDesc: t("projects_items.komanstra.fullDesc"),
        screenshots: [{ label: "Key Management UI", src: detailSSKomanstra }],
        techStack: [
          { name: "Flutter", color: "#38bdf8" },
          { name: "Dart", color: "#4ade80" },
          { name: "Firebase Auth & Cloud Firestore", color: "#fb923c" },
          { name: "Flutter Secure Storage", color: "#64748b" },
          { name: "Local Biometrics (local_auth)", color: "#a855f7" },
          { name: "USB Serial Communication (UART)", color: "#14b8a6" },
          { name: "SharedPreferences", color: "#cbd5e1" },
        ],
        info: t("projects_items.komanstra.info", { returnObjects: true }),
        liveUrl: null,
        repoUrl: null,
        accentColor: "#38bdf8",
      },
      {
        id: "malware-analyzer",
        title: t("projects_items.analyzer.title"),
        subtitle: t("projects_items.analyzer.subtitle"),
        category: t("projects_items.analyzer.category"),
        thumbnail: analystThumb,
        fullDesc: t("projects_items.analyzer.fullDesc"),
        screenshots: [{ label: "Dashboard Analysis", src: detailSSAnalystMal }],
        techStack: [
          { name: "Python", color: "#38bdf8" },
          { name: "Django", color: "#38bdf8" },
          { name: "Daphne (ASGI)", color: "#38bdf8" },
          { name: "Poetry", color: "#38bdf8" },
          { name: "KVM / QEMU", color: "#fb923c" },
          { name: "Libvirt", color: "#fb923c" },
          { name: "Virt-Manager", color: "#fb923c" },
          { name: "MongoDB", color: "#34d399" },
          { name: "Elasticsearch", color: "#34d399" },
          { name: "Docker", color: "#4ade80" },
          { name: "MISP", color: "#6ee7b7" },
          { name: "MobSF", color: "#6ee7b7" },
          { name: "VirusTotal API", color: "#6ee7b7" },
          { name: "Arkime", color: "#c084fc" },
          { name: "Nginx", color: "#f472b6" },
          { name: "Apache Guacamole", color: "#f472b6" },
          { name: "Linux (Ubuntu)", color: "#f472b6" },
          { name: "HTMX", color: "#f472b6" },
          { name: "Chart.js", color: "#f472b6" },
        ],
        info: t("projects_items.analyzer.info", { returnObjects: true }),
        liveUrl: null,
        repoUrl: null,
        accentColor: "#38bdf8",
      },
      {
        id: "yogtrip",
        title: t("projects_items.yogtrip.title"),
        subtitle: t("projects_items.yogtrip.subtitle"),
        category: t("projects_items.yogtrip.category"),
        thumbnail: yogtripThumb,
        fullDesc: t("projects_items.yogtrip.fullDesc"),
        screenshots: [{ label: "Home", src: detailSSYogtrip }],
        techStack: [
          { name: "Python", color: "#3776AB" },
          { name: "Flask", color: "#000000" },
          { name: "MySQL", color: "#4479A1" },
          { name: "Neo4j", color: "#4581C3" },
          { name: "Cypher", color: "#000000" },
          { name: "HTML/CSS/JS", color: "#E34F26" },
        ],
        info: t("projects_items.yogtrip.info", { returnObjects: true }),
        liveUrl: "https://your-live-url.com",
        repoUrl:
          "https://github.com/mateusapsitumorang/yogyakarta-tour-recommender",
        accentColor: "#38bdf8",
      },
      {
        id: "localine",
        title: t("projects_items.localine.title"),
        subtitle: t("projects_items.localine.subtitle"),
        category: t("projects_items.localine.category"),
        thumbnail: localineThumb,
        fullDesc: t("projects_items.localine.fullDesc"),
        screenshots: [{ label: "Home", src: detailSSLocaline }],
        techStack: [
          { name: "React", color: "#61DAFB" },
          { name: "Tailwind CSS", color: "#38bdf8" },
        ],
        info: t("projects_items.localine.info", { returnObjects: true }),
        liveUrl: "https://your-live-url.com",
        repoUrl: "https://github.com/mateusapsitumorang/Lokaliine",
        accentColor: "#38bdf8",
      },
    ],
    [t],
  );
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Derive activeProject dari projectsData yang fresh:
  const activeProject = activeProjectId
    ? projectsData.find((p) => p.id === activeProjectId)
    : null;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [dir, setDir] = useState(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const timerRef = useRef(null);
  const [sectionRef, sectionVisible] = useReveal(0.1);

  const [headingRef, headingVisible] = useReveal(0.4);

  const maxIndex = projectsData.length - CARDS;

  useEffect(() => {
    setIndex(0);
    setVisibleIndex(0);
    setPhase("idle");
    setDir(null);
  }, [CARDS]);

  const navigate = useCallback(
    (newIndex, direction) => {
      if (phase !== "idle" || newIndex === index) return;
      setDir(direction);
      setPhase("exiting");
      timerRef.current = setTimeout(() => {
        setVisibleIndex(newIndex);
        setIndex(newIndex);
        setPhase("entering");
        timerRef.current = setTimeout(() => {
          setPhase("idle");
          setDir(null);
        }, 400);
      }, 260);
    },
    [phase, index],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const prev = () => navigate(Math.max(0, index - 1), "right");
  const next = () => navigate(Math.min(maxIndex, index + 1), "left");

  const exitClass =
    dir === "left" ? "carousel-card-exit-left" : "carousel-card-exit-right";
  const enterClass =
    dir === "left" ? "carousel-card-enter-left" : "carousel-card-enter-right";
  const animClass =
    phase === "exiting" ? exitClass : phase === "entering" ? enterClass : "";

  const gridCols = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(3, 1fr)";

  const carouselGap = isMobile ? "0px" : "28px";

  return (
    <section id="projects" className="container">
      <style>{CAROUSEL_CSS}</style>
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
            showBorder={false}
          >
            {t("projects.title")}
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
          {t("projects.subtitle")}
        </p>
      </div>
      {/* ── Carousel ── */}
      <div
        ref={sectionRef}
        style={{
          overflow: "visible",
          padding: isMobile ? "20px 0" : "50px 50px",
          margin: isMobile ? "-20px 0" : "-50px -50px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: carouselGap,
          }}
        >
          {projectsData
            .slice(visibleIndex, visibleIndex + CARDS)
            .map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                animClass={animClass}
                revealIndex={i}
                sectionVisible={sectionVisible}
                onClick={() =>
                  phase === "idle" && setActiveProjectId(project.id)
                }
              />
            ))}
        </div>
      </div>

      {/* ── Navigation dots + arrows ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginTop: isMobile ? "8px" : "0",
        }}
      >
        <NavBtn onClick={prev} disabled={index === 0 || phase !== "idle"}>
          ‹
        </NavBtn>

        <div style={{ display: "flex", gap: "8px" }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i, i > index ? "left" : "right")}
              style={{
                width: index === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                border: "none",
                background: index === i ? "#fff" : "rgba(255,255,255,0.22)",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        <NavBtn onClick={next} disabled={index >= maxIndex || phase !== "idle"}>
          ›
        </NavBtn>
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProjectId(null)}
        />
      )}
    </section>
  );
};

/* ════════════════════════════════════════════════════════════
   GRADIENT TEXT
════════════════════════════════════════════════════════════ */
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

export default Projects;
