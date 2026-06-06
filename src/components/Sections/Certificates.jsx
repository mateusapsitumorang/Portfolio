import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";

// --- IMPORT GAMBAR SESUAI NAMA FILE ASLI ---
import img1 from "../../assets/certificate/img-1.jpg";
import img2 from "../../assets/certificate/img-2.jpg";
import img3 from "../../assets/certificate/img-3.jpg";
import img4 from "../../assets/certificate/img-4.jpg";
import img5 from "../../assets/certificate/img-5.jpg";
import img6 from "../../assets/certificate/img-6.jpg";
import img7 from "../../assets/certificate/img-7.jpg";
import img8 from "../../assets/certificate/img-8.jpg";
import img9 from "../../assets/certificate/img-9.jpg";
import img10 from "../../assets/certificate/img-10.jpg";
import img11 from "../../assets/certificate/img-11.jpg";
import img12 from "../../assets/certificate/img-12.jpg";
import img13 from "../../assets/certificate/img-13.jpg";
import img14 from "../../assets/certificate/img-14.jpg";
import img15 from "../../assets/certificate/img-15.jpg";
import img16 from "../../assets/certificate/img-16.jpg";
import img17 from "../../assets/certificate/img-17.jpg";
import img18 from "../../assets/certificate/img-18.jpg";
import img19 from "../../assets/certificate/img-19.jpg";
import img20 from "../../assets/certificate/img-20.jpg";

function GradientText({
  children,
  colors = ["#38bdf8", "#c084fc", "#38bdf8", "#c084fc", "#38bdf8"],
  animationSpeed = 4,
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
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;
    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const ct = elapsedRef.current % fullCycle;
      progress.set(
        ct < animationDuration
          ? (ct / animationDuration) * 100
          : 100 - ((ct - animationDuration) / animationDuration) * 100,
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

  return (
    <motion.span
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{
        backgroundImage: `linear-gradient(to right, ${[...colors, colors[0]].join(", ")})`,
        backgroundSize: "300% 100%",
        backgroundRepeat: "repeat",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        backgroundPosition,
      }}
    >
      {children}
    </motion.span>
  );
}

const blogs = [
  {
    id: "19",
    title: "Badan Siber dan Sandi Negara Internship",
    screens: img20,
    create_at: "June 2026",
  },
  {
    id: "19",
    title: "Essential Integrity at Work",
    screens: img19,
    create_at: "June 2026",
  },
  {
    id: "18",
    title: "Essential Emotional Resilience",
    screens: img18,
    create_at: "June 2026",
  },
  {
    id: "17",
    title: "Essential Skills Adaptability",
    screens: img17,
    create_at: "June 2026",
  },
  {
    id: "16",
    title: "Essential Skills Self Efficacy",
    screens: img16,
    create_at: "June 2026",
  },
  {
    id: "15",
    title: "Essential Skills Digital Literacy",
    screens: img15,
    create_at: "June 2026",
  },
  {
    id: "14",
    title: "Essential Skills Social Influence",
    screens: img14,
    create_at: "June 2026",
  },
  {
    id: "13",
    title: "Essential Skills Emotional Intelligence",
    screens: img13,
    create_at: "March 2026",
  },
  {
    id: "12",
    title: "Essential Skills Digital Disruption & Transformation",
    screens: img12,
    create_at: "January 2026",
  },
  {
    id: "11",
    title: "Essential Skills Design Thinking",
    screens: img11,
    create_at: "December 2025",
  },

  {
    id: "10",
    title:
      "Programming for Everyone Certificate (Getting Started with Python).",
    screens: img10,
    create_at: "July 2025",
  },
  {
    id: "9",
    title:
      "CSSLP Masterclass Ultimate Certificate - Secure Software Development.",
    screens: img9,
    create_at: "July 2025",
  },
  {
    id: "8",
    title: "Certificate of Accomplishment SAP01 - SAP Overview.",
    screens: img8,
    create_at: "June 2025",
  },
  {
    id: "7",
    title: "Python Basic Certificate from HackerRank.",
    screens: img7,
    create_at: "October 2024",
  },
  {
    id: "6",
    title: "Certificate of 3rd Place in Web Development IT Days.",
    screens: img6,
    create_at: "October 2024",
  },
  {
    id: "5",
    title: "Real Work Lecture Certificate.",
    screens: img5,
    create_at: "July 2024",
  },
  {
    id: "4",
    title: "Sanata Dharma University Initiation Committee Certificate.",
    screens: img4,
    create_at: "September 2023",
  },
  {
    id: "3",
    title:
      "Certificate of the Student Executive Board of Science and Technology.",
    screens: img3,
    create_at: "December 2023",
  },
  {
    id: "2",
    title:
      "Sadar Lingkungan Certificate (DARLING) Faculty of Science and Technology.",
    screens: img2,
    create_at: "September 2023",
  },
  {
    id: "1",
    title:
      "General Election Commission of BEM Faculty of Science and Technology Certificate.",
    screens: img1,
    create_at: "October 2022",
  },
];

export const Certificates = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigasi Kanan - Kiri
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogs.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogs.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="certificates" className="container">
      {/* --- Bagian Judul & Subtitle --- */}
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
            Certificate
          </GradientText>
        </h2>
        <p
          className="exp-subtitle"
          style={{
            color: "#ffffff",
            textAlign: "center",
            margin: "12px auto 0",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          Below is a list of certificates and certifications I have received.
        </p>
      </div>

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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Container Carousel */}
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {blogs.map((cert) => (
              <div key={cert.id} className="slide-item">
                {/* Teks Pindah ke Bawah Kiri & Hilang Saat Hover */}
                <div className="text-overlay">
                  <p className="cert-date">{cert.create_at}</p>
                  <h3 className="cert-title">{cert.title}</h3>
                </div>

                {/* Gambar (Gelap ke Terang) */}
                <img
                  src={cert.screens}
                  alt={cert.title}
                  className="slide-image"
                />
              </div>
            ))}
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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Titik / Dots Navigasi */}
        <div className="dots-container">
          {blogs.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* --- CSS DALAM FILE --- */}
      <style>{`
        .carousel-wrapper {
          position: relative;
          
          /* UBAH LEBAR CAROUSEL DI SINI */
          /* Contoh: 900px, 1000px, atau 80% */
          max-width: 900px; 
          
          margin: 0 auto;
        }

        .carousel-container {
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          
          /* UBAH TINGGI CAROUSEL DI SINI */
          /* Contoh: 400px, 500px, atau 600px */
          height: 500px; 
        }

        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.6s ease-in-out;
        }

        .slide-item {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        /* Teks di Bawah Kiri */
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

        /* Menghilangkan Teks Saat Hover */
        .slide-item:hover .text-overlay {
          opacity: 0;
        }

        .cert-date {
          color: #38bdf8;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .cert-title {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 700;
          line-height: 1.3;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.4s ease, opacity 0.4s ease;
          
          /* UBAH OPACITY / KECERAHAN GAMBAR SAAT BELUM DI-HOVER DI SINI */
          /* Nilai 0 (Gelap Gulita/Transparan) sampai 1 (Terang Normal) */
          filter: brightness(0.4); 
          /* Jika ingin menggunakan opacity murni (transparan tembus pandang), hapus 'filter' di atas dan gunakan: opacity: 0.5; */
        }

        /* Gambar kembali normal/terang 100% saat di-hover */
        .slide-item:hover .slide-image {
          filter: brightness(1); 
          /* Jika di atas menggunakan opacity, ubah yang ini menjadi: opacity: 1; */
        }

        /* Tombol Navigasi Kanan-Kiri */
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent; 
          color: white;
          border: none;
          font-size: 2.5rem; 
          cursor: pointer;
          z-index: 20;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .nav-button:hover {
          color: #38bdf8; 
          transform: translateY(-50%) scale(1.1);
        }

        .nav-button.prev { left: 20px; }
        .nav-button.next { right: 20px; }

        /* Titik Navigasi (Dots) */
        .dots-container {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 20;
          pointer-events: none; 
        }

        .carousel-container:hover ~ .dots-container {
          opacity: 0; 
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          pointer-events: auto; 
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .dot.active {
          background: #38bdf8;
          transform: scale(1.2);
        }

        /* Responsif untuk layar kecil */
        @media (max-width: 768px) {
          .nav-button.prev { left: 10px; font-size: 2.5rem; }
          .nav-button.next { right: 10px; font-size: 2.5rem; }
          .text-overlay { bottom: 40px; left: 20px; max-width: 90%; }
          .cert-title { font-size: 1.2rem; }
          
          /* Tinggi carousel di HP */
          .carousel-container { height: 350px; }
        }
      `}</style>
    </section>
  );
};

export default Certificates;
