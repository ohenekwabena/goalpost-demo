"use client";

import React, { useState, useEffect } from "react";
import type { Graphics as PixiGraphics, Texture, FederatedPointerEvent } from "pixi.js";
import { Assets } from "pixi.js";

interface Resonance {
  type: string;
  color: number;
}

interface EntityNodeProps {
  x: number;
  y: number;
  label: string;
  resonance: Resonance | null;
  onRemove?: () => void;
}

function EntityNode({ x, y, label, resonance, onRemove }: EntityNodeProps) {
  const [scale, setScale] = useState<number>(0);
  const [pulsePhase, setPulsePhase] = useState<number>(0);
  const [seedTexture, setSeedTexture] = useState<Texture | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // Load seed texture
    Assets.load("/assets/seed.png")
      .then(() => {
        setSeedTexture(Assets.get<Texture>("/assets/seed.png"));
      })
      .catch((err) => {
        console.error("Failed to load seed texture:", err);
      });
  }, []);

  useEffect(() => {
    // Animate in
    const duration = 600;
    const startTime = Date.now();

    const animateIn = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setScale(eased);

      if (progress < 1) {
        requestAnimationFrame(animateIn);
      }
    };

    requestAnimationFrame(animateIn);
  }, []);

  useEffect(() => {
    // Pulsing animation
    let animationFrameId: number;

    const animate = () => {
      setPulsePhase((prev) => prev + 0.02);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const pulseScale = 1 + Math.sin(pulsePhase) * 0.05;
  const glowAlpha = 0.3 + Math.sin(pulsePhase) * 0.2;
  const glowColor = resonance ? resonance.color : 0x88ddff;

  return (
    <pixiContainer
      x={x}
      y={y}
      scale={scale * pulseScale}
      alpha={scale}
      eventMode="static"
      cursor="pointer"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDown={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        if (onRemove) onRemove();
      }}
    >
      {/* Outer glow ring */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.circle(0, 0, 70);
          g.fill({ color: glowColor, alpha: glowAlpha * 0.3 });
        }}
      />

      {/* Middle glow ring */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.circle(0, 0, 55);
          g.fill({ color: glowColor, alpha: glowAlpha * 0.5 });
        }}
      />

      {/* Inner glow */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.circle(0, 0, 45);
          g.fill({ color: glowColor, alpha: glowAlpha });
        }}
      />

      {/* Seed sprite */}
      {seedTexture && <pixiSprite texture={seedTexture} anchor={0.5} scale={0.035} />}

      {/* Remove indicator (X) when hovered */}
      {isHovered && (
        <pixiContainer y={-50}>
          <pixiGraphics
            draw={(g: PixiGraphics) => {
              g.clear();
              g.circle(0, 0, 15);
              g.fill({ color: 0xff4444, alpha: 0.9 });
            }}
          />
          <pixiText
            text="×"
            anchor={0.5}
            y={-1}
            style={{
              fontFamily: "Arial",
              fontSize: 20,
              fill: 0xffffff,
              fontWeight: "bold",
            }}
          />
        </pixiContainer>
      )}

      {/* Label */}
      <pixiText
        text={label}
        anchor={0.5}
        y={60}
        style={{
          fontFamily: "Arial",
          fontSize: 12,
          fill: 0xffffff,
          align: "center",
          wordWrap: true,
          wordWrapWidth: 150,
        }}
      />
    </pixiContainer>
  );
}

export default EntityNode;
