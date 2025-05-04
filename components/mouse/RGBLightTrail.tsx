// components/mouse/RGBLightTrail.tsx
"use client";

import { useEffect, useRef } from 'react';

export function RGBLightTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      time: number;
      life: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.time = 0;
        this.life = Math.random() * 100 + 50;
      }

      draw() {
        ctx!.globalAlpha = 1 - this.time / this.life;
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.time++;
        this.draw();
        return this.time < this.life;
      }
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // Create new particles at mouse position
      if (particlesRef.current.length < 100) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            new Particle(mouseRef.current.x, mouseRef.current.y)
          );
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter(p => p.update());

      animationId = requestAnimationFrame(animate);
    };

    // Mouse movement handler
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-40"
    />
  );
}