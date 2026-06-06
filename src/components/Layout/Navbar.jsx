import { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import LogoM from "../../assets/LogoM.png";

const NAV_ITEMS = [
  "about",
  "experience",
  "projects",
  "cv",
  "education",
  "certificates",
];

const Navbar = () => {
  const [active, setActive] = useState("#about");
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 1 });
  const [menuOpen, setMenuOpen] = useState(false);
  const linkRefs = useRef({});
  const navLinksRef = useRef(null);

  const updatePill = useCallback((hash) => {
    if (!hash || !NAV_ITEMS.includes(hash.replace("#", ""))) {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const key = hash.replace("#", "");
    const el = linkRefs.current[key];
    const container = navLinksRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId === "contact") {
            setActive(null);
            updatePill(null);
          } else {
            setActive(`#${sectionId}`);
            updatePill(`#${sectionId}`);
          }
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -60% 0px",
    });
    NAV_ITEMS.forEach((item) => {
      const section = document.getElementById(item);
      if (section) observer.observe(section);
    });
    const contactSection = document.getElementById("contact");
    if (contactSection) observer.observe(contactSection);
    return () => observer.disconnect();
  }, [updatePill]);

  // Tutup menu saat klik di luar
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e) => {
      if (
        !e.target.closest(".floating-navbar") &&
        !e.target.closest(".mobile-menu")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [menuOpen]);

  // Handle resize - close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleNavClick = (item) => {
    setActive(`#${item}`);
    updatePill(`#${item}`);
    setMenuOpen(false);

    const section = document.getElementById(item);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="floating-navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-logo" aria-label="Home">
          <img
            src={LogoM}
            alt=""
            style={{ width: "60px", height: "60px", objectFit: "contain" }}
            aria-hidden="true"
          />
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links" ref={navLinksRef} role="menubar">
          <div
            className="nav-pill"
            style={{
              ...pillStyle,
              position: "absolute",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 0,
              pointerEvents: "none",
              height: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "999px",
            }}
            aria-hidden="true"
          />
          {NAV_ITEMS.map((item) => (
            <li key={item} role="none">
              <a
                href={`#${item}`}
                ref={(el) => (linkRefs.current[item] = el)}
                className={active === `#${item}` ? "active-pill" : ""}
                onClick={() => handleNavClick(item)}
                role="menuitem"
                aria-current={active === `#${item}` ? "page" : undefined}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right-group">
          <a
            href="#contact"
            className="nav-btn"
            onClick={() => {
              setActive(null);
              updatePill(null);
              setMenuOpen(false);
              const contactSection = document.getElementById("contact");
              if (contactSection)
                contactSection.scrollIntoView({ behavior: "smooth" });
            }}
            role="menuitem"
          >
            Contact
          </a>
          {/* Hamburger button — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`hamburger-line ${menuOpen ? "open-1" : ""}`} aria-hidden="true" />
            <span className={`hamburger-line ${menuOpen ? "open-2" : ""}`} aria-hidden="true" />
            <span className={`hamburger-line ${menuOpen ? "open-3" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        role="menu"
        aria-orientation="vertical"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu__list">
          {NAV_ITEMS.map((item) => (
            <li key={item} role="none">
              <a
                href={`#${item}`}
                className={`mobile-menu__link ${active === `#${item}` ? "mobile-menu__link--active" : ""}`}
                onClick={() => handleNavClick(item)}
                role="menuitem"
                aria-current={active === `#${item}` ? "page" : undefined}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
