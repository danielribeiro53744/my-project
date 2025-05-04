// components/mouse/MagneticMouse.tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MagneticMouse() {
  const magneticArea = useRef<HTMLDivElement>(null);
  const magneticContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magneticArea.current || !magneticContent.current) return;

    const area = magneticArea.current;
    const content = magneticContent.current;
    
    const xTo = gsap.quickTo(content, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(content, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const handleMove = (e: MouseEvent) => {
      const { width, height, left, top } = area.getBoundingClientRect();
      const x = e.clientX - (left + width/2);
      const y = e.clientY - (top + height/2);
      const distance = Math.sqrt(x * x + y * y);
      const { magneticStrength = '0.3' } = area.dataset;
      
      if (distance < 200) { // Magnetic radius
        const strength = parseFloat(magneticStrength || '0.3');
        xTo(x * strength);
        yTo(y * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    area.addEventListener('mousemove', handleMove);
    area.addEventListener('mouseleave', handleLeave);

    return () => {
      area.removeEventListener('mousemove', handleMove);
      area.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div 
      ref={magneticArea}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      data-magnetic-strength="0.3"
    >
      <div 
        ref={magneticContent}
        className="absolute top-1/2 left-1/2 w-8 h-8 bg-primary rounded-full mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}