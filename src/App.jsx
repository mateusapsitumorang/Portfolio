import React from "react";
import LightRays from "./components/lib/LightRays/LightRays";
import GradualBlur from "./components/lib/GradualBlur/GradualBlur";

import Navbar from "./components/Layout/Navbar";
import ScrollToTop from "./components/lib/ScrollToTop/ScrollToTop";
import Experience from "./components/Sections/Experience";
import About from "./components/Sections/About";
import Projects from "./components/Sections/Projects";
import CV from "./components/Sections/CV";
import Education from "./components/Sections/Education";
import Certificates from "./components/Sections/Certificates";
import Contact from "./components/Sections/Contact";

function App() {
  return (
    <div style={{ position: "relative" }}>
      {/* 1. Background Animasi Sinar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <LightRays raysColor="#38bdf8" raysSpeed={1.5} followMouse={true} />
      </div>

      {/* 2. Navbar Liquid Glass */}
      <Navbar />

      {/* 3. Konten Portfolio */}
      <main>
        <About />
        <Experience />
        <Projects />
        <CV />
        <Education />
        <Certificates />
        <Contact />
      </main>

      {/* 4. Efek Gradasi Blur di bagian bawah layar saat di-scroll */}
      <GradualBlur
        target="page"
        position="bottom"
        height="100px"
        strength={3}
        zIndex={50}
      />
      <ScrollToTop />
    </div>
  );
}

export default App;
