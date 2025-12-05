"use client";

import React, { useState, useEffect } from "react";
import type { Graphics as PixiGraphics, FederatedPointerEvent, Texture } from "pixi.js";
import { Assets } from "pixi.js";

interface SeedPanelProps {
  panelWidth: number;
  onDragStart: (event: FederatedPointerEvent) => void;
  onDragMove: (event: FederatedPointerEvent) => void;
  onDragEnd: (event: FederatedPointerEvent) => void;
}

function SeedPanel({ panelWidth, onDragStart, onDragMove, onDragEnd }: SeedPanelProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [seedScale, setSeedScale] = useState<number>(1);
  const [seedRotation, setSeedRotation] = useState<number>(0);
  const [seedTexture, setSeedTexture] = useState<Texture | null>(null);

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
    let frameId: number;

    const animate = () => {
      const time = Date.now();
      setSeedScale(1 + Math.sin(time * 0.002) * 0.1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <pixiContainer x={dimensions.width - panelWidth} y={0}>
      {/* Panel background */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.rect(0, 0, panelWidth, dimensions.height);
          g.fill({ color: 0x0a3d5c, alpha: 0.7 });
        }}
      />

      {/* Title */}
      <pixiText
        text="Make an Offering"
        anchor={0.5}
        x={panelWidth / 2}
        y={40}
        style={{
          fontFamily: "Arial",
          fontSize: 20,
          fill: 0xffffff,
          align: "center",
        }}
      />

      {/* Seed */}
      <Seed
        x={panelWidth / 2}
        y={120}
        scale={seedScale}
        rotation={seedRotation}
        texture={seedTexture}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      />

      {/* Instructions */}
      <pixiText
        text="Drag the seed into the field to create a new offering"
        anchor={0.5}
        x={panelWidth / 2}
        y={220}
        style={{
          fontFamily: "Arial",
          fontSize: 14,
          fill: 0xaaddff,
          align: "center",
          wordWrap: true,
          wordWrapWidth: panelWidth - 40,
          lineHeight: 22,
        }}
      />
    </pixiContainer>
  );
}
interface SeedProps {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  texture: Texture | null;
  onDragStart: (event: FederatedPointerEvent) => void;
  onDragMove: (event: FederatedPointerEvent) => void;
  onDragEnd: (event: FederatedPointerEvent) => void;
}

function Seed({ x, y, scale, rotation, texture, onDragStart, onDragMove, onDragEnd }: SeedProps) {
  return (
    <pixiContainer
      x={x}
      y={y}
      scale={scale}
      rotation={rotation}
      eventMode="static"
      cursor="pointer"
      onPointerDown={onDragStart}
      onGlobalPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerUpOutside={onDragEnd}
    >
      {/* Outer glow */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.circle(0, 0, 25);
          g.fill({ color: 0x88ddff, alpha: 0.2 });
        }}
      />

      {/* Middle glow */}
      <pixiGraphics
        draw={(g: PixiGraphics) => {
          g.clear();
          g.circle(0, 0, 18);
          g.fill({ color: 0xaaeeff, alpha: 0.3 });
        }}
      />

      {/* Seed sprite */}
      {texture && <pixiSprite texture={texture} anchor={0.5} scale={0.035} />}
    </pixiContainer>
  );
}

export default SeedPanel;
