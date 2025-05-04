// components/MouseTrail.tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MouseTrail() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    const speed = 0.15;

    const updatePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Calculate next position with easing
      trailX += (mouseX - trailX) * speed;
      trailY += (mouseY - trailY) * speed;
      
      // Apply smooth transform
      gsap.set(trail, {
        x: trailX - 5,
        y: trailY - 5,
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updatePosition);
    animate();

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <div
      ref={trailRef}
      className="fixed w-2 h-2 bg-gray-800 rounded-full pointer-events-none mix-blend-difference z-50"
      style={{ willChange: 'transform' }}
    />
  );
}