import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";
import Ferrofluid from "../lib/Ferrofluid/Ferrofluid";
import LogoLoop from "../lib/LogoLoop/LogoLoop";
import "../lib/LogoLoop/LogoLoop.css";
import Footer from "../layout/Footer";

import ArkimeLogo from "../../assets/logo/Arkime.webp";
import GuacamoleLogo from "../../assets/logo/Guacamole.webp";
import MISPLogo from "../../assets/logo/MISP.webp";
import MobsfLogo from "../../assets/logo/Mobsf.webp";
import QemuLogo from "../../assets/logo/Qemu.webp";
import VMLogo from "../../assets/logo/VM.webp";

import PhotoshopLogo from "../../assets/logo/Photoshop.webp";
import PremiereLogo from "../../assets/logo/Premiere.webp";
import WordLogo from "../../assets/logo/Word.webp";
import ExcelLogo from "../../assets/logo/Excel.webp";

import {
  SiFlutter,
  SiDart,
  SiFirebase,
  SiPython,
  SiDjango,
  SiPoetry,
  SiLinux,
  SiMongodb,
  SiElasticsearch,
  SiDocker,
  SiNginx,
  SiHtmx,
  SiChartdotjs,
  SiFlask,
  SiMysql,
  SiNeo4J,
  SiReact,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si";

import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

const WA_NUMBER = "628992152017";
const EMAIL_TO = "mateusapsitumorang@gmail.com";
const STORAGE_KEY = "contact_chat_messages";

const iconStyle = { width: "auto", objectFit: "contain", display: "block" };

const techLogos = [
  { node: <SiFlutter />, title: "Flutter" },
  { node: <SiDart />, title: "Dart" },
  { node: <SiFirebase />, title: "Firebase" },
  { node: <SiPython />, title: "Python" },
  { node: <SiDjango />, title: "Django" },
  { node: <SiPoetry />, title: "Poetry" },
  { node: <SiMongodb />, title: "MongoDB" },
  { node: <SiElasticsearch />, title: "Elasticsearch" },
  { node: <SiDocker />, title: "Docker" },
  { node: <SiNginx />, title: "Nginx" },
  { node: <SiLinux />, title: "Ubuntu" },
  { node: <SiHtmx />, title: "HTMX" },
  { node: <SiChartdotjs />, title: "Chart.js" },
  { node: <SiFlask />, title: "Flask" },
  { node: <SiMysql />, title: "MySQL" },
  { node: <SiNeo4J />, title: "Neo4j" },
  { node: <SiReact />, title: "React" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiGithub />, title: "Github" },
  {
    node: <img src={QemuLogo} alt="KVM/QEMU" style={iconStyle} />,
    title: "KVM/QEMU",
  },
  {
    node: <img src={VMLogo} alt="Virt-Manager" style={iconStyle} />,
    title: "Virt-Manager",
  },
  {
    node: <img src={MISPLogo} alt="MISP" style={iconStyle} />,
    title: "MISP",
  },
  {
    node: <img src={MobsfLogo} alt="MobSF" style={iconStyle} />,
    title: "MobSF",
  },
  {
    node: <img src={ArkimeLogo} alt="Arkime" style={iconStyle} />,
    title: "Arkime",
  },
  {
    node: <img src={GuacamoleLogo} alt="Apache Guacamole" style={iconStyle} />,
    title: "Apache Guacamole",
  },
  {
    node: <img src={PhotoshopLogo} alt="Adobe Photoshop" style={iconStyle} />,
    title: "Adobe Photoshop",
  },
  {
    node: <img src={PremiereLogo} alt="Adobe Premiere" style={iconStyle} />,
    title: "Adobe Premiere",
  },
  {
    node: <img src={WordLogo} alt="Microsoft Word" style={iconStyle} />,
    title: "Microsoft Word",
  },
  {
    node: <img src={ExcelLogo} alt="Microsoft Excel" style={iconStyle} />,
    title: "Microsoft Excel",
  },
];

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const isMobile = window.innerWidth < 768;
  const [visible, setVisible] = useState(isMobile);

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
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // ← tambahkan ini
      },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

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

function getNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function getTimestamp() {
  return {
    time: getNow(),
    date: new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

const S = {
  wrapper: {
    position: "relative",
    fontFamily: "Poppins, sans-serif",
    overflow: "hidden",
    scrollMarginTop: "10px",
  },
  ferroLayer: { position: "absolute", inset: 0, zIndex: 0 },
  logoLoopWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    pointerEvents: "none",
    fadeOutColor: "#000000",
    backgroundColor: "#15344c",
    color: "#ffffff",
    padding: "16px 0",
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    background: "transparent",
  },
  section: {
    position: "relative",
    zIndex: 2,
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    paddingTop: "100px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#60a5fa",
    marginBottom: "2px",
  },
  sectionTitle: {
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: 700,
    color: "#f1f5f9",
    textAlign: "center",
    margin: 0,
  },
  sectionSub: {
    fontSize: "14px",
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: "28px",
    lineHeight: 1.6,
  },
  card: {
    width: "100%",
    maxWidth: "860px",
    display: "grid",
    gridTemplateColumns: "1fr",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    boxShadow:
      "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  leftPanel: {
    borderRight: "none",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    minHeight: "400px",
  },
  msgsArea: {
    flex: 1,
    padding: "14px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    scrollBehavior: "smooth",
  },
  leaveMsg: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#60a5fa",
    textAlign: "center",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "8px 0 2px",
  },
  timeLabel: {
    fontSize: "10px",
    color: "#475569",
    textAlign: "center",
    margin: "2px 0 6px",
  },
  msgWrapOut: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "8px",
  },
  msgMeta: {
    fontSize: "10px",
    color: "#64748b",
    marginBottom: "2px",
    padding: "0 4px",
    textAlign: "right",
  },
  bubbleOut: {
    alignSelf: "flex-end",
    background: "rgba(37, 99, 235, 0.75)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    padding: "8px 13px",
    borderRadius: "18px 18px 4px 18px",
    fontSize: "13px",
    lineHeight: 1.5,
    maxWidth: "78%",
    minWidth: "48px",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    border: "1px solid rgba(96,165,250,0.20)",
  },
  bubbleTimeRight: {
    fontSize: "10px",
    color: "#93c5fd",
    marginTop: "2px",
    paddingRight: "4px",
    textAlign: "right",
  },
  namePrompt: {
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(13, 20, 36, 0.50)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  nameInput: {
    flex: 1,
    background: "rgba(30, 41, 59, 0.60)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "7px 13px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    backdropFilter: "blur(8px)",
  },
  nameOkBtn: {
    background: "#2563eb",
    border: "none",
    borderRadius: "12px",
    padding: "6px 14px",
    fontSize: "13px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  chatInputRow: {
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(13, 20, 36, 0.50)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  chatInput: {
    flex: 1,
    background: "rgba(30, 41, 59, 0.60)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "20px",
    padding: "8px 14px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    backdropFilter: "blur(8px)",
  },
  sendBtn: (disabled) => ({
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: disabled ? "rgba(30,41,59,0.50)" : "#2563eb",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s",
  }),
  rightPanel: {
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "rgba(15, 23, 42, 0.20)",
  },
  rightTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: 0,
  },
  rightSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 0",
    lineHeight: 1.55,
  },
  divider: { height: "1px", background: "rgba(255,255,255,0.07)" },
  quickRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  quickCard: (hue) => ({
    background:
      hue === "wa" ? "rgba(5, 46, 22, 0.50)" : "rgba(23, 37, 84, 0.50)",
    border: `1px solid ${hue === "wa" ? "rgba(22,101,52,0.60)" : "rgba(30,64,175,0.60)"}`,
    borderRadius: "14px",
    padding: "14px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    backdropFilter: "blur(8px)",
    transition: "transform 0.15s, box-shadow 0.15s",
  }),
  quickIcon: (hue) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: hue === "wa" ? "#4ade80" : "#60a5fa",
  }),
  quickLabel: { fontSize: "11px", color: "#64748b", fontWeight: 500 },
  quickName: (hue) => ({
    fontSize: "13px",
    fontWeight: 600,
    color: hue === "wa" ? "#4ade80" : "#60a5fa",
  }),
  formLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#475569",
    marginBottom: "5px",
    display: "block",
  },
  formInput: {
    width: "100%",
    background: "rgba(10, 15, 30, 0.50)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "9px 13px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    backdropFilter: "blur(8px)",
  },
  formTextarea: {
    width: "100%",
    background: "rgba(10, 15, 30, 0.50)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "9px 13px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "none",
    lineHeight: 1.5,
    transition: "border-color 0.2s",
    backdropFilter: "blur(8px)",
  },
  actionRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  actionBtn: (type, disabled) => ({
    padding: "10px 12px",
    borderRadius: "10px",
    border:
      type === "wa"
        ? "1px solid rgba(22,101,52,0.50)"
        : "1px solid rgba(30,64,175,0.50)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    opacity: disabled ? 0.4 : 1,
    transition: "opacity 0.2s, transform 0.1s",
    background: type === "wa" ? "rgba(22,101,52,0.60)" : "rgba(30,64,175,0.60)",
    color: type === "wa" ? "#4ade80" : "#60a5fa",
    backdropFilter: "blur(8px)",
  }),
  successBadge: {
    background: "rgba(5, 46, 22, 0.55)",
    border: "1px solid rgba(22,101,52,0.60)",
    borderRadius: "10px",
    padding: "9px 13px",
    fontSize: "13px",
    color: "#4ade80",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    backdropFilter: "blur(8px)",
  },
};

const IcoWA = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.42A9.952 9.952 0 0012.004 22C17.53 22 22 17.522 22 12c0-5.523-4.47-10-9.996-10zm0 18.18a8.17 8.17 0 01-4.162-1.135l-.299-.178-3.098.902.875-3.195-.195-.31A8.184 8.184 0 013.82 12c0-4.513 3.672-8.183 8.184-8.183 4.513 0 8.182 3.67 8.182 8.183 0 4.512-3.67 8.18-8.182 8.18z" />
  </svg>
);
const IcoMail = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
);
const IcoSend = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoCheck = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IcoUser = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#60a5fa"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Contact = () => {
  const { t } = useTranslation();

  const [headingRef, headingVisible] = useReveal(0.2);
  const [cardRef, cardVisible] = useReveal(0.1);

  const [nameInput, setNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [messages, setMessages] = useState([]);

  // Load pesan realtime dari Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });
    return () => unsub();
  }, []);
  const [fName, setFName] = useState("");
  const [fMsg, setFMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore localStorage errors
    }
  }, [messages]);

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const handleSetName = () => {
    const n = nameInput.trim();
    if (!n) return;
    setUserName(n);
    setNameSet(true);
  };

  const handleSendChat = async () => {
    const txt = chatMsg.trim();
    if (!txt) return;
    const { time, date } = getTimestamp();

    await addDoc(collection(db, "messages"), {
      type: "out",
      text: txt,
      sender: userName,
      time,
      date,
      createdAt: serverTimestamp(), // untuk sorting
    });

    setChatMsg("");
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (err) {
      console.error("Gagal hapus pesan:", err);
    }
  };

  const handleWA = () => {
    const text = encodeURIComponent(
      `Hello! My name is ${fName}.\n\n${fMsg}\n\n_Sent from portfolio website._`,
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
    showSuccess();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(
      `Message from ${fName} - Portfolio Website`,
    );
    const body = encodeURIComponent(
      `Hello,\n\nMy name is ${fName}.\n\n${fMsg}\n\nBest regards,\n${fName}`,
    );
    window.open(`mailto:${EMAIL_TO}?subject=${subject}&body=${body}`);
    showSuccess();
  };

  const showSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const formOk = fName.trim() && fMsg.trim();

  return (
    <div id="contact" style={S.wrapper}>
      <div className="section-title-wrapper">
        <div style={S.wrapper}>
          {/* Ferrofluid background */}
          <div style={S.ferroLayer}>
            <Ferrofluid
              colors={["#4F46E5", "#06B6D4", "#E0F2FE"]}
              speed={0.5}
              scale={1}
              turbulence={1}
              fluidity={0.1}
              rimWidth={0.2}
              sharpness={3}
              shimmer={1}
              glow={2}
              flowDirection="down"
              opacity={1}
              mouseInteraction={true}
              mouseStrength={1}
              mouseRadius={0.3}
            />
          </div>

          {/* LogoLoop strip */}
          <div style={S.logoLoopWrap}>
            <LogoLoop
              logos={techLogos}
              speed={55}
              direction="left"
              logoHeight={28}
              gap={48}
              hoverSpeed={0}
              ariaLabel="Tech stack"
            />
          </div>

          <div style={S.overlay} />

          {/* Content */}
          {/* Content */}
          <div style={S.section}>
            <div
              ref={headingRef}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "0.5rem",
                opacity: headingVisible ? 1 : 0,
                transform: headingVisible
                  ? "translateY(0)"
                  : "translateY(24px)",
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
                  colors={[
                    "#38bdf8",
                    "#c084fc",
                    "#38bdf8",
                    "#c084fc",
                    "#38bdf8",
                  ]}
                  animationSpeed={4}
                >
                  {t("contact.title")}
                </GradientText>
              </h2>
              <p
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
                {t("contact.subtitle_line1")}
                <br />
                {t("contact.subtitle_line2")}
              </p>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 20px 60px",
            }}
          >
            <div
              ref={cardRef}
              style={{
                ...S.card,
                marginTop: "-22px",
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(32px) scale(0.98)",
                transition:
                  "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) 0.2s",
              }}
            >
              {/* LEFT */}
              <div style={S.leftPanel}>
                <div style={S.msgsArea} ref={msgsRef}>
                  <p style={S.leaveMsg}>{t("contact.leave_message")}</p>
                  <p style={S.timeLabel}>{getToday()}</p>
                  {messages.length === 0 && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#334155",
                        textAlign: "center",
                        marginTop: "16px",
                      }}
                    ></p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} style={S.msgWrapOut}>
                      {/* Nama · Tanggal + icon trash di samping */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <span style={S.msgMeta}>
                          {m.sender} · {m.date}
                        </span>
                        {m.sender === userName && (
                          <button
                            onClick={() => handleDelete(m.id)}
                            title="Hapus pesan"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0",
                              color: "#475569",
                              display: "flex",
                              alignItems: "center",
                              flexShrink: 0,
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#ef4444")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#475569")
                            }
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div style={S.bubbleOut}>{m.text}</div>
                      <p style={S.bubbleTimeRight}>{m.time}</p>
                    </div>
                  ))}
                </div>

                {!nameSet && (
                  <div style={S.namePrompt}>
                    <IcoUser />
                    <input
                      style={S.nameInput}
                      type="text"
                      placeholder={t("contact.name_placeholder")}
                      value={nameInput}
                      maxLength={30}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                    />
                    <button style={S.nameOkBtn} onClick={handleSetName}>
                      OK
                    </button>
                  </div>
                )}

                {nameSet && (
                  <div style={S.chatInputRow}>
                    <input
                      style={S.chatInput}
                      type="text"
                      placeholder={t("contact.message_placeholder")}
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    />
                    <button
                      style={S.sendBtn(!chatMsg.trim())}
                      onClick={handleSendChat}
                      disabled={!chatMsg.trim()}
                      aria-label="Send"
                    >
                      <IcoSend />
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div style={S.rightPanel}>
                <div>
                  <h3 style={S.rightTitle}>
                    {t("contact.send_message_title")}
                  </h3>
                  <p style={S.rightSub}>
                    {t("contact.send_message_sub_line1")}
                    <br />
                    {t("contact.send_message_sub_line2")}
                  </p>
                </div>
                <div style={S.divider} />
                <div style={S.quickRow}>
                  <div
                    style={S.quickCard("wa")}
                    onClick={() =>
                      window.open(`https://wa.me/${WA_NUMBER}`, "_blank")
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={S.quickIcon("wa")}>
                      <IcoWA />
                    </div>
                    <span style={S.quickLabel}>{t("contact.wa_label")}</span>
                    <span style={S.quickName("wa")}>WhatsApp</span>
                  </div>
                  <div
                    style={S.quickCard("em")}
                    onClick={() => window.open(`mailto:${EMAIL_TO}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={S.quickIcon("em")}>
                      <IcoMail />
                    </div>
                    <span style={S.quickLabel}>{t("contact.email_label")}</span>
                    <span style={S.quickName("em")}>Email</span>
                  </div>
                </div>
                <div style={S.divider} />
                <div>
                  <label style={S.formLabel}>{t("contact.form_name")}</label>
                  <input
                    style={S.formInput}
                    type="text"
                    placeholder={t("contact.form_name_placeholder")}
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2563eb";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  />
                </div>
                <div>
                  <label style={S.formLabel}>{t("contact.form_message")}</label>
                  <textarea
                    style={S.formTextarea}
                    rows={3}
                    placeholder={t("contact.form_message_placeholder")}
                    value={fMsg}
                    onChange={(e) => setFMsg(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2563eb";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  />
                </div>
                {success && (
                  <div style={S.successBadge}>
                    <IcoCheck /> {t("contact.success_message")}
                  </div>
                )}
                <div style={S.actionRow}>
                  <button
                    style={S.actionBtn("wa", !formOk)}
                    onClick={handleWA}
                    disabled={!formOk}
                    onMouseEnter={(e) => {
                      if (formOk)
                        e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <IcoWA /> WhatsApp
                  </button>
                  <button
                    style={S.actionBtn("em", !formOk)}
                    onClick={handleEmail}
                    disabled={!formOk}
                    onMouseEnter={(e) => {
                      if (formOk)
                        e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <IcoMail /> Email
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "auto" }}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
