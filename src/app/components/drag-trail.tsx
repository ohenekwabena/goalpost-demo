"use client";

import React from "react";
import type { Graphics as PixiGraphics } from "pixi.js";

interface Point {
  x: number;
  y: number;
}

interface DragTrailProps {
  points: Point[];
}

function DragTrail({ points }: DragTrailProps) {
  if (points.length < 2) return null;

  return (
    <pixiGraphics
      draw={(g: PixiGraphics) => {
        g.clear();

        for (let i = 0; i < points.length - 1; i++) {
          const point = points[i];
          const alpha = (i / points.length) * 0.5;
          const width = (i / points.length) * 3;

          const nextPoint = points[i + 1];

          g.moveTo(point.x, point.y);
          g.lineTo(nextPoint.x, nextPoint.y);
          g.stroke({
            width: width,
            color: 0xaaeeff,
            alpha: alpha,
          });
        }
      }}
    />
  );
}

export default DragTrail;
