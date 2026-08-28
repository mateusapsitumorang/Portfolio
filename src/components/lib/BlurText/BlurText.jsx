import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy],
  );

  // ── PERUBAHAN: hapus filter: blur() dari animasi ──
  // Efek "blur" divisualkan cukup lewat opacity + sedikit pergeseran y,
  // jauh lebih murah untuk browser (cukup compositing, tanpa filter pass)
  const defaultFrom = useMemo(
    () =>
      direction === "top" ? { opacity: 0, y: -50 } : { opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      { opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const { animateKeyframes, totalDuration, times } = useMemo(() => {
    const kf = buildKeyframes(fromSnapshot, toSnapshots);
    const sc = toSnapshots.length + 1;
    const td = stepDuration * (sc - 1);
    const t = Array.from({ length: sc }, (_, i) =>
      sc === 1 ? 0 : i / (sc - 1),
    );
    return { animateKeyframes: kf, totalDuration: td, times: t };
  }, [fromSnapshot, toSnapshots, stepDuration]);

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {elements.map((segment, index) => (
        <motion.span
          className="inline-block"
          key={index}
          initial={fromSnapshot}
          animate={inView ? animateKeyframes : fromSnapshot}
          // ── PERUBAHAN: will-change HANYA aktif selama animasi berjalan ──
          // Sebelumnya will-change dipasang permanen lewat className,
          // sekarang di-set via style dan dilepas begitu animasi selesai
          style={{ willChange: inView ? "opacity, transform" : "auto" }}
          transition={{
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={() => {
            if (index === elements.length - 1 && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
