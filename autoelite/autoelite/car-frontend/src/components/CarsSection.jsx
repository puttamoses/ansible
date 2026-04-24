// src/components/CarsSection.jsx
import React, { useState } from "react";
import CarCard from "./CarCard";

const FILTERS = ["All", "Maruti Suzuki", "Skoda", "SUV", "Sedan", "Hatchback"];

export default function CarsSection({ cars, loading, onBook }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? cars
      : cars.filter((c) => c.brand === active || c.type === active);

  return (
    <section id="cars" className="px-10 py-24">
      {/* Heading */}
      <div className="mb-10">
        <div className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-2">
          Our Fleet
        </div>
        <h2 className="font-display text-5xl font-extrabold text-white tracking-tight">
          EXPLORE CARS
        </h2>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer
              ${active === f
                ? "bg-red-600 text-white border-red-600"
                : "bg-transparent text-white/50 border-white/20 hover:border-white/40 hover:text-white"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="shimmer h-48" />
              <div className="p-5 space-y-3">
                <div className="shimmer h-3 w-24 rounded" />
                <div className="shimmer h-6 w-36 rounded" />
                <div className="shimmer h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-white/30 text-center py-20 text-lg">No cars found for this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} onBook={onBook} />
          ))}
        </div>
      )}
    </section>
  );
}
