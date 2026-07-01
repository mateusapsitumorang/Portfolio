import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";

import img1 from "../../assets/certificate/img-1.webp";
import img2 from "../../assets/certificate/img-2.webp";
import img3 from "../../assets/certificate/img-3.webp";
import img4 from "../../assets/certificate/img-4.webp";
import img5 from "../../assets/certificate/img-5.webp";
import img6 from "../../assets/certificate/img-6.webp";
import img7 from "../../assets/certificate/img-7.webp";
import img8 from "../../assets/certificate/img-8.webp";
import img9 from "../../assets/certificate/img-9.webp";
import img10 from "../../assets/certificate/img-10.webp";
import img11 from "../../assets/certificate/img-11.webp";
import img12 from "../../assets/certificate/img-12.webp";
import img13 from "../../assets/certificate/img-13.webp";
import img14 from "../../assets/certificate/img-14.webp";
import img15 from "../../assets/certificate/img-15.webp";
import img16 from "../../assets/certificate/img-16.webp";
import img17 from "../../assets/certificate/img-17.webp";
import img18 from "../../assets/certificate/img-18.webp";
import img19 from "../../assets/certificate/img-19.webp";
import img20 from "../../assets/certificate/img-20.webp";

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

// Blogs data — title keys map to i18n, screens are static imports
const blogsData = [
  {
    id: "20",
    titleKey: "certificates_items.cert20.title",
    screens: img20,
    dateKey: "certificates_items.cert20.date",
  },
  {
    id: "19",
    titleKey: "certificates_items.cert19.title",
    screens: img19,
    dateKey: "certificates_items.cert19.date",
  },
  {
    id: "18",
    titleKey: "certificates_items.cert18.title",
    screens: img18,
    dateKey: "certificates_items.cert18.date",
  },
  {
    id: "17",
    titleKey: "certificates_items.cert17.title",
    screens: img17,
    dateKey: "certificates_items.cert17.date",
  },
  {
    id: "16",
    titleKey: "certificates_items.cert16.title",
    screens: img16,
    dateKey: "certificates_items.cert16.date",
  },
  {
    id: "15",
    titleKey: "certificates_items.cert15.title",
    screens: img15,
    dateKey: "certificates_items.cert15.date",
  },
  {
    id: "14",
    titleKey: "certificates_items.cert14.title",
    screens: img14,
    dateKey: "certificates_items.cert14.date",
  },
  {
    id: "13",
    titleKey: "certificates_items.cert13.title",
    screens: img13,
    dateKey: "certificates_items.cert13.date",
  },
  {
    id: "12",
    titleKey: "certificates_items.cert12.title",
    screens: img12,
    dateKey: "certificates_items.cert12.date",
  },
  {
    id: "11",
    titleKey: "certificates_items.cert11.title",
    screens: img11,
    dateKey: "certificates_items.cert11.date",
  },
  {
    id: "10",
    titleKey: "certificates_items.cert10.title",
    screens: img10,
    dateKey: "certificates_items.cert10.date",
  },
  {
    id: "9",
    titleKey: "certificates_items.cert9.title",
    screens: img9,
    dateKey: "certificates_items.cert9.date",
  },
  {
    id: "8",
    titleKey: "certificates_items.cert8.title",
    screens: img8,
    dateKey: "certificates_items.cert8.date",
  },
  {
    id: "7",
    titleKey: "certificates_items.cert7.title",
    screens: img7,
    dateKey: "certificates_items.cert7.date",
  },
  {
    id: "6",
    titleKey: "certificates_items.cert6.title",
    screens: img6,
    dateKey: "certificates_items.cert6.date",
  },
  {
    id: "5",
    titleKey: "certificates_items.cert5.title",
    screens: img5,
    dateKey: "certificates_items.cert5.date",
  },
  {
    id: "4",
    titleKey: "certificates_items.cert4.title",
    screens: img4,
    dateKey: "certificates_items.cert4.date",
  },
  {
    id: "3",
    titleKey: "certificates_items.cert3.title",
    screens: img3,
    dateKey: "certificates_items.cert3.date",
  },
  {
    id: "2",
    titleKey: "certificates_items.cert2.title",
    screens: img2,
    dateKey: "certificates_items.cert2.date",
  },
  {
    id: "1",
    titleKey: "certificates_items.cert1.title",
    screens: img1,
    dateKey: "certificates_items.cert1.date",
  },
];

export const Certificates = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const [headingRef, headingVisible] = useReveal(0.2);
  const [carouselRef, carouselVisible] = useReveal(0.1);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === blogsData.length - 1 ? 0 : prev + 1));

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? blogsData.length - 1 : prev - 1));

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <section id="certificates" className="container">
      {/* Judul */}
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
            {t("certificates.title")}
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
            marginBottom: "-2px",
          }}
        >
          {t("certificates.subtitle")}
        </p>
      </div>
      <div
        ref={carouselRef}
        style={{
          opacity: carouselVisible ? 1 : 0,
          transform: carouselVisible
            ? "translateY(0) scale(1)"
            : "translateY(32px) scale(0.98)",
          transition:
            "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) 0.2s",
        }}
      >
        {/* Carousel */}
        <div className="carousel-wrapper">
          {/* Tombol Kiri */}
          <button
            className="nav-button prev"
            onClick={prevSlide}
            aria-label="Previous"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Track */}
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {blogsData.map((cert, i) => (
                <div key={`${cert.id}-${i}`} className="slide-item">
                  <div className="text-overlay">
                    <p className="cert-date">{t(cert.dateKey)}</p>
                    <h3 className="cert-title">{t(cert.titleKey)}</h3>
                  </div>
                  <img
                    src={cert.screens}
                    alt={t(cert.titleKey)}
                    className="slide-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tombol Kanan */}
        <button
          className="nav-button next"
          onClick={nextSlide}
          aria-label="Next"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="dots-container">
          {blogsData.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* ── WRAPPER ── */
        .carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 60px; /* ruang untuk tombol nav di luar carousel */
          box-sizing: border-box;
        }

        /* ── CONTAINER ── */
        .carousel-container {
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          height: 500px;
        }

        /* ── TRACK ── */
        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.6s ease-in-out;
        }

        /* ── SLIDE ── */
        .slide-item {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        /* ── TEXT OVERLAY ── */
        .text-overlay {
          position: absolute;
          bottom: 50px;
          left: 40px;
          max-width: 80%;
          text-align: left;
          z-index: 10;
          color: white;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .slide-item:hover .text-overlay {
          opacity: 0;
        }

        .cert-date {
          color: #38bdf8;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: clamp(0.75rem, 2vw, 1.1rem);
        }
        .cert-title {
          font-size: clamp(0.9rem, 2.5vw, 1.5rem);
          margin: 0;
          font-weight: 700;
          line-height: 1.3;
        }

        /* ── GAMBAR ── */
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.4s ease;
          filter: brightness(0.4);
        }
        .slide-item:hover .slide-image {
          filter: brightness(1);
        }

        /* ── TOMBOL NAV ── */
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: white;
          border: none;
          cursor: pointer;
          z-index: 20;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .nav-button:hover {
          color: #38bdf8;
          transform: translateY(-50%) scale(1.1);
        }
        .nav-button.prev { left: 0; }
        .nav-button.next { right: 0; }

        .nav-button svg {
          width: 40px;
          height: 40px;
        }

        /* ── DOTS ── */
        .dots-container {
          position: absolute;
          bottom: -28px;
          left: 60px;
          right: 60px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          z-index: 20;
        }
        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
          flex-shrink: 0;
        }
        .dot:hover { background: rgba(255,255,255,0.8); }
        .dot.active { background: #38bdf8; transform: scale(1.2); }

        /* ══════════════════════════════════════
           BREAKPOINTS RESPONSIF
        ══════════════════════════════════════ */

        /* Desktop kecil (≤1280px) */
        @media (max-width: 1280px) {
          .carousel-wrapper { max-width: 820px; padding: 0 56px; }
          .carousel-container { height: 460px; }
          .text-overlay { bottom: 40px; left: 32px; }
        }

        /* Tablet (≤1024px) */
        @media (max-width: 1024px) {
          .carousel-wrapper { max-width: 700px; padding: 0 52px; }
          .carousel-container { height: 420px; border-radius: 14px; }
          .text-overlay { bottom: 36px; left: 28px; max-width: 85%; }
          .dots-container { left: 52px; right: 52px; gap: 7px; }
        }

        /* Tablet kecil / ponsel besar (≤768px) */
        @media (max-width: 768px) {
          .carousel-wrapper { padding: 0 44px; }
          .carousel-container { height: 320px; border-radius: 12px; }
          .text-overlay { bottom: 28px; left: 20px; max-width: 88%; }
          .nav-button svg { width: 28px; height: 28px; }
          .dots-container { left: 44px; right: 44px; bottom: -24px; gap: 6px; }
          .dot { width: 4px; height: 4px; }
        }

        /* Ponsel besar (≤480px) */
        @media (max-width: 480px) {
          .carousel-wrapper { padding: 0 36px; }
          .carousel-container { height: 240px; border-radius: 10px; }
          .text-overlay { bottom: 20px; left: 14px; max-width: 90%; }
          .nav-button svg { width: 22px; height: 22px; }
          .nav-button { padding: 4px; }
          .dots-container { left: 36px; right: 36px; bottom: -22px; gap: 5px; }
          .dot { width: 4px; height: 4px; }
        }

        /* Ponsel kecil (≤320px) */
        @media (max-width: 320px) {
          .carousel-wrapper { padding: 0 28px; }
          .carousel-container { height: 190px; border-radius: 8px; }
          .text-overlay { bottom: 14px; left: 10px; max-width: 92%; }
          .nav-button svg { width: 18px; height: 18px; }
          .dots-container { left: 28px; right: 28px; bottom: -20px; gap: 4px; }
          .dot { width: 3px; height: 3px; }
        }
      `}</style>
    </section>
  );
};

export default Certificates;
