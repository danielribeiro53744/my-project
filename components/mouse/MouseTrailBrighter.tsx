// components/MouseTrail.tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MouseTrailBrighter() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    // Hide the default cursor
    document.body.style.cursor = 'none';

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
        x: trailX - 12, // Adjusted for new size
        y: trailY - 12,
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updatePosition);
    animate();

    return () => {
      // Restore default cursor on unmount
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <div
      ref={trailRef}
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50"
      style={{
        willChange: 'transform',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '2px solid rgba(0, 0, 0, 0.8)',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        transform: 'translate(-50%, -50%)',
        transition: 'background-color 0.2s, transform 0.2s',
      }}
    />
  );
}