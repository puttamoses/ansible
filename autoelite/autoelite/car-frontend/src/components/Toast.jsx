// src/components/Toast.jsx
import React, { useEffect, useCallback } from "react";

export default function Toast({ message, isError, onHide }) {
  const hide = useCallback(onHide, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 3000);
    return () => clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl text-sm font-medium
                   shadow-2xl fade-up border max-w-xs
                   ${isError
                     ? "bg-red-950 border-red-500/40 text-red-300"
                     : "bg-green-950 border-green-500/40 text-green-300"}`}
    >
      {message}
    </div>
  );
}
