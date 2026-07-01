import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mendeteksi posisi scroll
  const toggleVisibility = () => {
    // Tombol muncul setelah di-scroll 300px ke bawah
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fungsi untuk scroll mulus ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    // Membersihkan event listener saat komponen dilepas
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom:
              "120px" /* Ditaruh sedikit tinggi agar tidak tertutup GradualBlur */,
            right: "30px",
            width: "45px",
            height: "45px",
            backgroundColor: "#38bdf8" /* Warna tema biru Anda */,
            color: "#ffffff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            zIndex: 9999 /* Pastikan z-index tinggi agar selalu di atas */,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            transition: "opacity 0.3s ease-in-out",
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
