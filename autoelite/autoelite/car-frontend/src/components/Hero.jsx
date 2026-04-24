// src/components/Hero.jsx
import React from "react";

export default function Hero({ onBookClick }) {
  return (
    <section className="relative min-h-screen flex items-center px-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Red glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl fade-up">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase
                         text-red-500 border border-red-500/50 px-3 py-1.5 rounded-full mb-6">
          2024 Collection
        </span>
        <h1 className="font-display text-7xl md:text-8xl font-extrabold leading-none text-white mb-6 tracking-tight">
          DRIVE<br />
          YOUR<br />
          <span className="text-red-600">DREAM.</span>
        </h1>
        <p className="text-white/60 text-lg font-light mb-10 max-w-md leading-relaxed">
          Explore premium cars from Maruti Suzuki &amp; Skoda. Compare models, check prices,
          and book a test drive instantly.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => document.getElementById("cars").scrollIntoView({ behavior: "smooth" })}
            className="btn-red text-white font-semibold tracking-wider uppercase px-8 py-3.5 rounded-xl cursor-pointer"
          >
            Explore Cars
          </button>
          <button
            onClick={onBookClick}
            className="text-white font-semibold tracking-wider uppercase px-8 py-3.5 rounded-xl
                       border border-white/20 hover:border-white/50 transition-colors cursor-pointer"
          >
            Book Drive
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-14 left-10 flex gap-12 z-10">
        {[["6+", "Models"], ["2", "Brands"], ["24/7", "Support"]].map(([val, label]) => (
          <div key={label}>
            <div className="font-display text-4xl font-extrabold text-white">{val}</div>
            <div className="text-xs font-medium tracking-widest uppercase text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
