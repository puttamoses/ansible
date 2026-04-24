// src/components/Navbar.jsx
import React from "react";

export default function Navbar({ onBookClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16
                    bg-black/80 backdrop-blur-md border-b border-white/10">
      {/* Logo */}
      <div className="font-display text-xl font-extrabold tracking-widest text-white">
        AUTO<span className="text-red-600">ELITE</span>
      </div>

      {/* Links */}
      <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-white/60">
        <a href="#cars" className="hover:text-white transition-colors">Cars</a>
        <a href="#cars" className="hover:text-white transition-colors">Book Drive</a>
      </div>

      {/* CTA */}
      <button
        onClick={onBookClick}
        className="btn-red text-white text-sm font-semibold tracking-wider uppercase
                   px-5 py-2.5 rounded-lg cursor-pointer"
      >
        Book Test Drive
      </button>
    </nav>
  );
}
