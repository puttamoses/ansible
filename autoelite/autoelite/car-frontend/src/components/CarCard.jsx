// src/components/CarCard.jsx
import React from "react";

export default function CarCard({ car, onBook }) {
  return (
    <div className="card-hover bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
         onClick={() => onBook(car.id)}>
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-zinc-800">
        <img
          src={car.img}
          alt={car.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-xs font-bold tracking-widest uppercase
                         bg-red-600 text-white px-2.5 py-1 rounded">
          {car.badge || car.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">
          {car.brand}
        </div>
        <div className="font-display text-2xl font-bold text-white mb-3">
          {car.name}
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[car.type, car.fuel].map((t) => (
            <span key={t} className="text-xs font-medium bg-white/5 text-white/50
                                     px-3 py-1 rounded-full border border-white/10">
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="font-display text-xl font-bold text-white">₹{car.price}</div>
            <div className="text-xs text-white/30 mt-0.5">Starting price</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBook(car.id); }}
            className="text-red-500 border border-red-500/50 text-xs font-semibold tracking-wider
                       uppercase px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white
                       hover:border-red-600 transition-all"
          >
            Book Drive
          </button>
        </div>
      </div>
    </div>
  );
}
