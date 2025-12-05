"use client";

import React, { useState } from "react";
import type { Graphics as PixiGraphics, FederatedPointerEvent } from "pixi.js";

interface ResonanceOption {
  label: string;
  color: number;
  icon: string;
}

interface ResonanceOptionsProps {
  x: number;
  y: number;
  onSelect: (type: string, color: number) => void;
}

interface DraggedOption {
  label: string;
  color: number;
  x: number;
  y: number;
}

function ResonanceOptions({ x, y, onSelect }: ResonanceOptionsProps) {
  const [draggedOption, setDraggedOption] = useState<DraggedOption | null>(null);
  const options: ResonanceOption[] = [
    { label: "Care", color: 0xff8844, icon: "💧" },
    { label: "Connection", color: 0x44aaff, icon: "🧵" },
    { label: "Growth", color: 0x88dd44, icon: "🌱" },
    { label: "Peace", color: 0xaa88ff, icon: "✨" },
  ];

  const handleDragStart = (option: ResonanceOption, event: FederatedPointerEvent) => {
    const position = event.data.global;
    setDraggedOption({
      label: option.label,
      color: option.color,
      x: position.x,
      y: position.y,
    });
  };

  const handleDragMove = (event: FederatedPointerEvent) => {
    if (!draggedOption) return;
    const position = event.data.global;
    setDraggedOption({
      ...draggedOption,
      x: position.x,
      y: position.y,
    });
  };

  const handleDragEnd = () => {
    if (!draggedOption) return;

    // Check if dropped near the seed (within 100px)
    const distance = Math.sqrt(Math.pow(draggedOption.x - x, 2) + Math.pow(draggedOption.y - y, 2));

    if (distance < 100) {
      onSelect(draggedOption.label, draggedOption.color);
    }

    setDraggedOption(null);
  };

  return (
    <>
      <pixiContainer x={x} y={y + 100}>
        {options.map((option, index) => (
          <pixiContainer
            key={option.label}
            x={index * 70}
            eventMode="static"
            cursor="grab"
            onPointerDown={(e: FederatedPointerEvent) => handleDragStart(option, e)}
            onGlobalPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerUpOutside={handleDragEnd}
          >
            {/* Background circle */}
            <pixiGraphics
              draw={(g: PixiGraphics) => {
                g.clear();
                g.circle(0, 0, 25);
                g.fill({ color: option.color, alpha: 0.6 });
              }}
            />

            {/* Label */}
            <pixiText
              text={option.label}
              anchor={0.5}
              y={35}
              style={{
                fontFamily: "Arial",
                fontSize: 10,
                fill: 0xffffff,
              }}
            />
          </pixiContainer>
        ))}
      </pixiContainer>

      {/* Dragged option */}
      {draggedOption && (
        <pixiContainer x={draggedOption.x} y={draggedOption.y}>
          <pixiGraphics
            draw={(g: PixiGraphics) => {
              g.clear();
              g.circle(0, 0, 25);
              g.fill({ color: draggedOption.color, alpha: 0.8 });
            }}
          />
          <pixiText
            text={draggedOption.label}
            anchor={0.5}
            y={35}
            style={{
              fontFamily: "Arial",
              fontSize: 10,
              fill: 0xffffff,
            }}
          />
        </pixiContainer>
      )}
    </>
  );
}

export default ResonanceOptions;
