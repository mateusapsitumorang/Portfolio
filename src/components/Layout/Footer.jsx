import React from "react";
import "./Footer.css";
import LogoM from "../../assets/LogoM.png";
import { FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

const FOOTER_ITEMS = [
  "about",
  "experience",
  "projects",
  "cv",
  "education",
  "certificates",
  "contact",
];

const SOCIAL_ICONS = [
  { Icon: FaGithub, href: "https://github.com/mateusapsitumorang" },
  {
    Icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/mateus-appuwan-situmorang/",
  },
  { Icon: FaInstagram, href: "https://www.instagram.com/mateussitumorang/" },
];

const Footer = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="floating-footer">
      {/* TOP: Logo + Nav Links */}
      <div className="footer-top">
        <div className="footer-logo">
          <img src={LogoM} alt="Logo" />
        </div>
        <ul className="footer-links">
          {FOOTER_ITEMS.map((item) => (
            <li key={item}>
              <a href={`#${item}`} onClick={(e) => handleScroll(e, item)}>
                {item === "cv"
                  ? "CV"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* DIVIDER */}
      <div className="footer-divider" />

      {/* MIDDLE: Description */}
      <p className="footer-desc">
        Building secure, scalable, and high-performance digital solutions.
        Crafted with passion, driven by curiosity, and powered by clean,
        reliable code. I focus on creating meaningful digital experiences that
        not only solve real-world problems but also support long-term growth,
        innovation, and business success.
      </p>

      {/* SOCIAL ICONS */}
      <div className="footer-socials">
        {SOCIAL_ICONS.map(({ Icon, href }, i) => (
          <a key={i} href={href} className="footer-social-icon">
            <Icon />
          </a>
        ))}
      </div>

      {/* BOTTOM: Copyright */}
      <div className="footer-copyright">
        © {new Date().getFullYear()} Mateus Appuwan Situmorang
      </div>
    </footer>
  );
};

export default Footer;
