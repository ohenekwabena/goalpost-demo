"use client";

import React, { useState, useEffect } from "react";
import type { Graphics as PixiGraphics, Texture } from "pixi.js";
import { Assets } from "pixi.js";

interface AIAssistantProps {
  x: number;
  y: number;
  message: string;
  screenWidth: number;
  screenHeight: number;
}

function AIAssistant({ x, y, message, screenWidth, screenHeight }: AIAssistantProps) {
  const [alpha, setAlpha] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.8);
  const [floatOffset, setFloatOffset] = useState<number>(0);
  const [octopusTexture, setOctopusTexture] = useState<Texture | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const bubbleWidth = 280;
  const margin = 20;

  // Calculate bubble height based on message length
  const estimatedLines = Math.ceil(message.length / 35);
  const bubbleHeight = Math.max(70, 30 + estimatedLines * 20);

  // Calculate optimal position to keep octopus visible
  const calculatePosition = () => {
    let posX = x + 80;
    let posY = y - 120;

    // Check right boundary
    if (posX + bubbleWidth + margin > screenWidth) {
      posX = x - bubbleWidth - 80;
    }

    // Check left boundary
    if (posX < margin) {
      posX = margin;
    }

    // Check top boundary
    if (posY < margin) {
      posY = y + 80;
    }

    // Check bottom boundary
    if (posY + bubbleHeight + margin > screenHeight) {
      posY = screenHeight - bubbleHeight - margin;
    }

    return { posX, posY };
  };

  const { posX, posY } = calculatePosition();

  useEffect(() => {
    // Load octopus texture
    Assets.load("/assets/octopus-1.png")
      .then(() => {
        setOctopusTexture(Assets.get<Texture>("/assets/octopus-1.png"));
      })
      .catch((err) => {
        console.error("Failed to load octopus texture:", err);
      });
  }, []);

  useEffect(() => {
    // Animate in
    const duration = 300;
    const startTime = Date.now();

    const animateIn = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAlpha(progress);
      setScale(0.8 + progress * 0.2);

      if (progress < 1) {
        requestAnimationFrame(animateIn);
      }
    };

    requestAnimationFrame(animateIn);
  }, []);

  useEffect(() => {
    // Floating animation with vertical movement
    let animationFrameId: number;

    const animate = () => {
      const time = Date.now() * 0.001;
      setFloatOffset(Math.sin(time) * 8); // Gentle hover
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    // Trigger fade out before component unmounts
    return () => {
      setIsFadingOut(true);
    };
  }, []);

  return (
    <pixiContainer x={posX} y={posY + floatOffset} alpha={alpha} scale={scale}>
      {/* Octopus sprite */}
      {octopusTexture && <pixiSprite texture={octopusTexture} anchor={{ x: 0.5, y: 0.8 }} scale={0.25} y={-20} />}

      {/* Speech bubble */}
      <pixiGraphics
        y={20}
        draw={(g: PixiGraphics) => {
          g.clear();
          g.roundRect(0, 0, bubbleWidth, bubbleHeight, 15);
          g.fill({ color: 0x1a4d6d, alpha: 0.95 });
          g.roundRect(0, 0, bubbleWidth, bubbleHeight, 15);
          g.stroke({ width: 2, color: 0x4a9dcc, alpha: 0.8 });
        }}
      />

      {/* Message text */}
      <pixiText
        text={message}
        x={15}
        y={30}
        style={{
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0xffffff,
          align: "left",
          wordWrap: true,
          wordWrapWidth: bubbleWidth - 30,
          lineHeight: 18,
        }}
      />
    </pixiContainer>
  );
}

export default AIAssistant;
