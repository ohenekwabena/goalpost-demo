"use client";

import React, { useEffect, useState, useRef } from "react";
import { Assets, DisplacementFilter, Sprite as PixiSprite, Texture, Container as PixiContainer } from "pixi.js";

function BackgroundLayer() {
  const [backgroundLoaded, setBackgroundLoaded] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [textures, setTextures] = useState<{
    background: Texture | null;
    overlay: Texture | null;
  }>({ background: null, overlay: null });
  const containerRef = useRef<PixiContainer>(null);

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
    const loadAssets = async () => {
      try {
        const assets = [
          { alias: "background", src: "/assets/sea-bed-2.jpg" },
          { alias: "overlay", src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png" },
          { alias: "displacement", src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png" },
        ];

        await Assets.load(assets);

        // Get loaded textures
        const backgroundTexture = Assets.get<Texture>("background");
        const overlayTexture = Assets.get<Texture>("overlay");

        setTextures({
          background: backgroundTexture,
          overlay: overlayTexture,
        });

        setBackgroundLoaded(true);
      } catch (error) {
        console.error("Failed to load background assets:", error);
      }
    };

    loadAssets();
  }, []);

  useEffect(() => {
    if (!backgroundLoaded || !containerRef.current) return;

    // Create and apply displacement filter after container is ready
    const displacementSprite = PixiSprite.from("displacement");
    displacementSprite.texture.source.addressMode = "repeat";

    const filter = new DisplacementFilter({
      sprite: displacementSprite,
      scale: 50,
    });

    containerRef.current.filters = [filter];

    return () => {
      if (containerRef.current) {
        containerRef.current.filters = null;
      }
    };
  }, [backgroundLoaded]);

  if (!backgroundLoaded || dimensions.width === 0 || !textures.background || !textures.overlay) return null;

  return (
    <pixiContainer ref={containerRef}>
      <pixiSprite
        texture={textures.background}
        anchor={0.5}
        x={dimensions.width / 2}
        y={dimensions.height / 2}
        width={dimensions.width * 1.2}
        height={dimensions.width * 1.2 * (dimensions.height / dimensions.width)}
      />

      <WaterOverlay width={dimensions.width} height={dimensions.height} texture={textures.overlay} />
    </pixiContainer>
  );
}

interface WaterOverlayProps {
  width: number;
  height: number;
  texture: Texture;
}

function WaterOverlay({ width, height, texture }: WaterOverlayProps) {
  const [tilePosition, setTilePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setTilePosition((prev) => ({
        x: prev.x - 1,
        y: prev.y - 1,
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <pixiTilingSprite texture={texture} width={width} height={height} tilePosition={tilePosition} />;
}

export default BackgroundLayer;
