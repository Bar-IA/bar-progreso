"use client";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (window.innerWidth >= 768) return;

    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }

    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <header
  className={`
    fixed
    top-0
    left-0
    right-0
    z-50
    bg-[#F8F5F0]/95
    backdrop-blur
    border-b
    border-gray-200
    transition-transform
    duration-300

    md:translate-y-0

    ${
      showNavbar
        ? "translate-y-0"
        : "-translate-y-full"
    }
  `}
>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <div className="flex items-center">
          <a href="#top">
  <img
    src="/logo-apedirdemesa.png"
    alt="A Pedir de Mesa"
    className="h-16 w-auto cursor-pointer"
  />
</a>
        </div>

        <nav className="hidden md:flex items-center gap-10 font-medium text-sm">

          <a href="#comofunciona" className="hover:text-[#C46A2D] transition">
            Cómo funciona
          </a>

          <a href="#beneficios" className="hover:text-[#C46A2D] transition">
            Beneficios
          </a>

          <a href="#future" className="hover:text-[#C46A2D] transition">
            Para tu negocio
          </a>

          <a href="#faq" className="hover:text-[#C46A2D] transition">
            Dudas frecuentes
          </a>

        </nav>

        <a
          href="https://wa.me/34694259636?text=Hola.%20He%20visto%20A%20Pedir%20de%20Mesa%20y%20me%20gustaría%20solicitar%20una%20demostración."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block bg-[#10251D] text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
            >
              Solicitar demostración
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden">
              <Menu className="w-8 h-8 text-[#10251D]" />
              </button>

      </div>

     <div
  className={`
    md:hidden
    overflow-hidden
    transition-all
    duration-300
    border-t border-gray-200
    bg-[#F8F5F0]
    ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
  `}
>
    <div className="flex flex-col p-6 gap-5">

      <a
  href="#comofunciona"
  onClick={() => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document
        .getElementById("comofunciona")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }}
>
  Cómo funciona
</a>

      <a
  href="#beneficios"
  onClick={() => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document
        .getElementById("beneficios")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }}
>
  Beneficios
</a>

      <a
  href="#future"
  onClick={() => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document
        .getElementById("future")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }}
>
  Para tu negocio
</a>

      <a
  href="#faq"
  onClick={() => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document
        .getElementById("faq")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }}
>
  Dudas frecuentes
</a>

    </div>
  </div>

    </header>
  );
}