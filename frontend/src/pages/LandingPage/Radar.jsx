import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Radar() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Círculos concêntricos */}
        <circle cx="100" cy="100" r="80" fill="url(#radarGradient)" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />

        {/* Linhas de grade */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2" />

        {/* Scanner rotativo */}
        <g transform={`rotate(${rotation} 100 100)`}>
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="20" 
            stroke="url(#scanGradient)" 
            strokeWidth="2"
            opacity="0.8"
          />
        </g>

        {/* Pontos de localização */}
        <motion.circle
          cx="130"
          cy="70"
          r="3"
          fill="#ec4899"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="70"
          cy="130"
          r="3"
          fill="#0ea5e9"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="140"
          cy="140"
          r="3"
          fill="#14b8a6"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Centro */}
        <circle cx="100" cy="100" r="4" fill="#8b5cf6" />
      </svg>
    </div>
  );
}
