// components/ParticleMouse.tsx
"use client";

import { useEffect, useRef } from 'react';

export function ParticleMouse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const particles: Particle[] = [];
    const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      velocity: { x: number; y: number };
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocity = {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        };
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
      }

      draw() {
        ctx!.globalAlpha = 1 - this.life / this.maxLife;
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life++;
        this.draw();
        return this.life < this.maxLife;
      }
    }

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let lastEmit = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = (timestamp: number) => {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // Emit new particles (throttled)
      if (timestamp - lastEmit > 50) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(mouseX, mouseY));
        }
        lastEmit = timestamp;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
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