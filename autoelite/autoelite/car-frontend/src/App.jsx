// src/App.jsx
import React, { useState, useEffect } from "react";
import API from "./config";
import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import CarsSection  from "./components/CarsSection";
import BookingModal from "./components/BookingModal";
import Toast        from "./components/Toast";

// Demo data shown when backend is offline
const DEMO_CARS = [
  { id:1, brand:"Maruti Suzuki", name:"Swift",  price:"6.49 L",  type:"Hatchback", fuel:"Petrol", badge:"Best Seller", img:"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80" },
  { id:2, brand:"Maruti Suzuki", name:"Brezza", price:"10.49 L", type:"SUV",       fuel:"Petrol", badge:"Top Rated",   img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80" },
  { id:3, brand:"Skoda",         name:"Kushaq", price:"17.99 L", type:"SUV",       fuel:"Petrol", badge:"Popular",     img:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80" },
  { id:4, brand:"Skoda",         name:"Slavia", price:"19.99 L", type:"Sedan",     fuel:"Petrol", badge:"Premium",     img:"https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&q=80" },
];

export default function App() {
  const [cars,          setCars]          = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [toast,         setToast]         = useState({ msg: "", error: false });

  // Fetch cars from backend
  useEffect(() => {
    async function fetchCars() {
      try {
        const res  = await fetch(`${API}/api/cars`);
        const data = await res.json();
        setCars(data);
      } catch {
        console.warn("Backend offline — using demo data");
        setCars(DEMO_CARS);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  function openModal(carId = null) {
    setSelectedCarId(carId);
    setModalOpen(true);
  }

  function showToast(msg, error = false) {
    setToast({ msg, error });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar onBookClick={() => openModal()} />

      <Hero onBookClick={() => openModal()} />

      <CarsSection
        cars={cars}
        loading={loading}
        onBook={openModal}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-8 text-white/30 text-sm">
        <div className="font-display text-lg font-bold text-white tracking-widest mb-1">
          AUTO<span className="text-red-600">ELITE</span>
        </div>
        © 2024 AutoElite. All rights reserved.
      </footer>

      {/* Modal */}
      {modalOpen && (
        <BookingModal
          cars={cars}
          selectedCarId={selectedCarId}
          onClose={() => setModalOpen(false)}
          onSuccess={showToast}
        />
      )}

      {/* Toast */}
      <Toast
        message={toast.msg}
        isError={toast.error}
        onHide={() => setToast({ msg: "", error: false })}
      />
    </div>
  );
}
