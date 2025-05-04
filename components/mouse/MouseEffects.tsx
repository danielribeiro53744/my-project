// components/MouseEffects.tsx
"use client";

import { useEffect, useState } from 'react';
import { MouseTrail } from './MouseTrail';
import { ParticleMouse } from './ParticleMouse';
import { SvgMouseTracer } from './SvgMouseTracer';
import { MagneticMouse } from './MagneticMouse';
import { RGBLightTrail } from './RGBLightTrail';
import { MouseTrailBrighter } from './MouseTrailBrighter';

export function MouseEffects() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Only enable one at a time */}
      <MouseTrail />
      {/* <MouseTrailBrighter /> */}
      {/* <ParticleMouse /> */}
      {/* <SvgMouseTracer /> */}
      {/* <MagneticMouse /> */}
      {/* <RGBLightTrail /> */}
    </>
  );
}