import { useEffect, useRef } from "react";

/**
 * DecryptedText
 * ─────────────────────────────────────────────────────────────
 * MASALAH DI VERSI LAMA:
 *   setInterval(() => {
 *     const next = text.split("").map(...);  // alokasi array baru tiap tick
 *     setChars(next);                         // ⚠️ trigger React re-render
 *   }, speed);
 *
 *   setChars() artinya React harus re-render komponen ini setiap tick
 *   (default tiap 100ms). Tiap re-render, .map() di JSX membuat ulang
 *   N elemen <span> (N = panjang teks) dan React harus diff semuanya.
 *   Kalau ada 2 instance jalan bersamaan (heading + role, masing-masing
 *   sequential), itu dua re-render-storm independen di waktu yang sama.
 *   Inilah penyumbang utama beban "Scripting" yang muncul di profiling.
 *
 * PERBAIKAN:
 *   Span-span dibuat SEKALI saat mount (jumlahnya tetap = panjang teks,
 *   tidak pernah berubah). Animasi decrypt selanjutnya memanipulasi
 *   `textContent` dan `className` tiap span secara langsung lewat ref
 *   array — di luar siklus render React sama sekali. Tidak ada
 *   setState dipanggil per tick, jadi tidak ada re-render, tidak ada
 *   reconciliation, tidak ada alokasi array baru per tick.
 *
 *   React hanya re-render SEKALI di akhir (opsional, untuk memicu
 *   onAnimationComplete) — bukan di setiap langkah animasi.
 */
export default function DecryptedText({
  text,
  speed = 100,
  className = "",
  encryptedClassName = "",
  animateOn = "view",
  sequential = false,
}) {
  const containerRef = useRef(null);
  const spanRefs = useRef([]);
  const hasAnimated = useRef(false);
  const intervalRef = useRef(null);
  const elementRef = useRef(null);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const spans = spanRefs.current;
    let iteration = 0;
    const len = text.length;

    intervalRef.current = setInterval(() => {
      for (let index = 0; index < len; index++) {
        const span = spans[index];
        if (!span) continue;

        if (index < iteration) {
          // Sudah settle ke huruf asli — set sekali, lalu skip terus
          if (span.textContent !== text[index]) {
            span.textContent = text[index];
            span.className = className;
          }
        } else {
          span.textContent = Math.random().toString(36)[2] ?? "?";
          span.className = encryptedClassName;
        }
      }

      iteration += sequential ? 1 / 3 : len; // non-sequential: langsung selesai 1 tick

      if (iteration >= len) {
        clearInterval(intervalRef.current);
        for (let index = 0; index < len; index++) {
          const span = spans[index];
          if (span) {
            span.textContent = text[index];
            span.className = className;
          }
        }
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === "mount") {
      startAnimation();
      return () => clearInterval(intervalRef.current);
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateOn, text, speed, sequential]);

  return (
    <span ref={elementRef} className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          ref={(el) => (spanRefs.current[index] = el)}
          className={encryptedClassName}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
