import React, { useRef, useEffect, useState } from "react";
import "./LightRays.css";

/**
 * LightRays — CSS-only version
 *
 * Sebelumnya pakai WebGL canvas shader yang berjalan 60fps terus-menerus,
 * menghabiskan CPU/GPU bahkan saat idle.
 *
 * Sekarang pakai CSS radial-gradient + CSS animation murni.
 * Browser bisa menghentikan animasi otomatis saat tab tidak aktif
 * atau elemen di luar viewport.
 *
 * @param {string}  raysColor     - Warna sinar (hex)
 * @param {number}  raysSpeed     - Kecepatan animasi (1 = normal)
 * @param {boolean} followMouse   - Sinar mengikuti mouse (pakai CSS custom property)
 * @param {number}  mouseInfluence - Seberapa kuat pengaruh mouse (0-1)
 * @param {number}  opacity       - Opacity keseluruhan (0-1)
 * @param {string}  className     - Class tambahan
 */
const LightRays = ({
  raysColor = "#38bdf8",
  raysSpeed = 1,
  followMouse = false,
  mouseInfluence = 0.15,
  opacity = 0.6,
  className = "",
}) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 10 });

  // Konversi hex ke RGB untuk rgba()
  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return "56, 189, 248";
    return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
  };

  const rgbColor = hexToRgb(raysColor);

  // Mouse tracking (hanya jika followMouse = true)
  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse]);

  // CSS custom properties untuk animasi
  const containerStyle = {
    "--rays-color": rgbColor,
    "--rays-speed": `${8 / raysSpeed}s`, // speed 1 = 8s, speed 2 = 4s, speed 0.5 = 16s
    "--rays-opacity": opacity,
    "--mouse-x": `${mousePos.x}%`,
    "--mouse-y": `${mousePos.y}%`,
    "--mouse-influence": mouseInfluence,
  };

  return (
    <div
      ref={containerRef}
      className={`light-rays-css ${followMouse ? "follow-mouse" : ""} ${className}`}
      style={containerStyle}
    >
      {/* Layer 1: Sinar utama dari atas */}
      <div className="ray-layer ray-main" />

      {/* Layer 2: Sinar kedua dari samping */}
      <div className="ray-layer ray-side" />

      {/* Layer 3: Sinar ambient lembut */}
      <div className="ray-layer ray-ambient" />

      {/* Overlay grain/noise subtle (CSS only) */}
      <div className="ray-noise" />
    </div>
  );
};

export default LightRays;
