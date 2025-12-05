"use client";

import React, { useState, useEffect } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  lifeSpeed: number;
  size: number;
}

interface AmbientParticlesProps {
  target?: { x: number; y: number } | null;
}

function AmbientParticles({ target }: AmbientParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialize dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      life: Math.random(),
      lifeSpeed: 0.001 + Math.random() * 0.002,
      size: 3 + Math.random() * 4,
    }));

    setParticles(initialParticles);
  }, [dimensions]);

  useEffect(() => {
    if (particles.length === 0) return;

    let animationFrameId: number;

    const animate = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // If there's a target, move particles towards it
          if (target) {
            const dx = target.x - particle.x;
            const dy = target.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply attraction force that gets stronger closer to target
            if (distance > 2) {
              const force = 0.08; // Stronger, faster attraction
              newX = particle.x + particle.vx + (dx / distance) * force * 15;
              newY = particle.y + particle.vy + (dy / distance) * force * 15;
            }
          } else {
            // Normal wrap around behavior when no target
            if (newX < 0) newX = dimensions.width;
            if (newX > dimensions.width) newX = 0;
            if (newY < 0) newY = dimensions.height;
            if (newY > dimensions.height) newY = 0;
          }

          // Update life
          let newLife = particle.life + particle.lifeSpeed;
          if (newLife > 1) newLife = 0;

          return {
            ...particle,
            x: newX,
            y: newY,
            life: newLife,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [particles.length, dimensions, target]);

  return (
    <pixiContainer>
      {particles.map((particle) => {
        const alpha = 0.6 + Math.sin(particle.life * Math.PI * 2) * 0.3;

        return (
          <pixiGraphics
            key={particle.id}
            x={particle.x}
            y={particle.y}
            alpha={alpha}
            draw={(g: PixiGraphics) => {
              g.clear();
              g.circle(0, 0, particle.size);
              g.fill({ color: 0xffffff, alpha: 1 });
            }}
          />
        );
      })}
    </pixiContainer>
  );
}

export default AmbientParticles;
