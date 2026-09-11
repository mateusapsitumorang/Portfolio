import React from "react";
import LightRays from "./components/lib/LightRays/LightRays";
import GradualBlur from "./components/lib/GradualBlur/GradualBlur";

import Navbar from "./components/Layout/Navbar";
import ScrollToTop from "./components/lib/ScrollToTop/ScrollToTop";
import Experience from "./components/sections/Experience";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import CV from "./components/sections/CV";
import Education from "./components/sections/Education";
import Certificates from "./components/sections/Certificates";
import Contact from "./components/sections/Contact";

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
