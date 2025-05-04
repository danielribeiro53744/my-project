// components/SvgMouseTracer.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

export function SvgMouseTracer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathData, setPathData] = useState('');

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);
      const point = `M${e.clientX},${e.clientY}`;
      setPathData(point);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      setPathData(prev => `${prev} L${e.clientX},${e.clientY}`);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      
      // Animate path disappearance
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        pathRef.current.style.strokeDasharray = `${length} ${length}`;
        pathRef.current.style.strokeDashoffset = `${length}`;
        
        const animation = pathRef.current.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          { duration: 2000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        );
        
        animation.onfinish = () => {
          setPathData('');
        };
      }
    };

    svg.addEventListener('mousedown', startDrawing);
    svg.addEventListener('mousemove', draw);
    svg.addEventListener('mouseup', stopDrawing);
    svg.addEventListener('mouseleave', stopDrawing);

    return () => {
      svg.removeEventListener('mousedown', startDrawing);
      svg.removeEventListener('mousemove', draw);
      svg.removeEventListener('mouseup', stopDrawing);
      svg.removeEventListener('mouseleave', stopDrawing);
    };
  }, [isDrawing]);

  return (
    <svg
      ref={svgRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-30"
    >
      <path
        ref={pathRef}
        d={pathData}
        stroke="#FF1461"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}