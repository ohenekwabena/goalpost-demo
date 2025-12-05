"use client";

import React, { useState, useEffect } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";

interface Ripple {
  radius: number;
  alpha: number;
}

interface RippleEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([
    { radius: 0, alpha: 1 },
    { radius: -20, alpha: 1 },
    { radius: -40, alpha: 1 },
  ]);

  useEffect(() => {
    let animationFrameId: number;
    const maxRadius = 150;
    const speed = 2;
    let completed = false;

    const animate = () => {
      setRipples((prev) => {
        const updated = prev.map((ripple) => ({
          radius: ripple.radius + speed,
          alpha: 1 - Math.max(0, ripple.radius) / maxRadius,
        }));

        // Check if all ripples are done
        if (updated.every((r) => r.radius >= maxRadius) && !completed) {
          completed = true;
          onComplete?.();
          return prev;
        }

        return updated;
      });

      if (!completed) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onComplete]);

  return (
    <pixiContainer x={x} y={y}>
      {ripples.map((ripple, index) => {
        if (ripple.radius < 0) return null;

        return (
          <pixiGraphics
            key={index}
            alpha={ripple.alpha}
            draw={(g: PixiGraphics) => {
              g.clear();
              g.circle(0, 0, ripple.radius);
              g.stroke({
                width: 2,
                color: 0x88ddff,
              });
            }}
          />
        );
      })}
    </pixiContainer>
  );
}

export default RippleEffect;
