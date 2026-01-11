import React, { useEffect, useState } from 'react';

const AnimatedParticles = ({ radius, isActive }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = Math.min(Math.floor(radius / 5) + 3, 12);
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: ['#f97316', '#10b981', '#3b82f6', '#6366f1'][Math.floor(Math.random() * 4)]
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    
    return () => clearInterval(interval);
  }, [radius]);
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: particle.color,
            opacity: isActive ? particle.opacity : particle.opacity * 0.3,
            animation: `particleFloat ${particle.speed * 3}s ease-in-out infinite`,
            animationDelay: `${particle.id * 0.2}s`,
            transition: 'opacity 0.5s ease'
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedParticles;