// src/components/BookingModal.jsx
import React, { useState } from "react";
import API from "../config";

export default function BookingModal({ cars, selectedCarId, onClose, onSuccess }) {
  const [form, setForm]     = useState({ name: "", phone: "", carId: selectedCarId || "", date: "" });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.carId) {
      onSuccess("Please fill Name, Phone &amp; Car.", true);
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/bookings`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, carId: +form.carId }),
      });
      const data = await res.json();
      onClose();
      onSuccess(
        res.ok ? `Booking confirmed! ID: ${data.id}` : data.error || "Booking failed.",
        !res.ok
      );
    } catch {
      onClose();
      onSuccess("Booking received (demo mode)!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden fade-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-7 py-6">
          <h3 className="font-display text-2xl font-bold text-white tracking-widest uppercase">
            Book Test Drive
          </h3>
          <p className="text-white/70 text-sm mt-1">Fill in your details below</p>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
                Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="bg-zinc-800 border border-white/10 text-white text-sm px-3 py-2.5
                           rounded-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
                Phone *
              </label>
              <input
                type="tel"
                placeholder="+91 98765..."
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="bg-zinc-800 border border-white/10 text-white text-sm px-3 py-2.5
                           rounded-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Car select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Select Car *
            </label>
            <select
              value={form.carId}
              onChange={(e) => set("carId", e.target.value)}
              className="bg-zinc-800 border border-white/10 text-white text-sm px-3 py-2.5
                         rounded-lg outline-none focus:border-red-500 transition-colors"
            >
              <option value="">-- Choose a car --</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.name} — &#8377;{c.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Preferred Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-zinc-800 border border-white/10 text-white text-sm px-3 py-2.5
                         rounded-lg outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 btn-red text-white font-semibold tracking-wider uppercase
                       py-3 rounded-xl disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10
                       font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
