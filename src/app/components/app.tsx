"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Text, Sprite, TilingSprite } from "pixi.js";
import type { Graphics as PixiGraphics, FederatedPointerEvent, Texture } from "pixi.js";
import { Assets } from "pixi.js";
import BackgroundLayer from "./background-layer";
import SeedPanel from "./seed-panel";
import DragTrail from "./drag-trail";
import AmbientParticles from "./ambient-particles";
import RippleEffect from "./ripple-effect";
import AIAssistant from "./ai-assistant";
import EntityNode from "./entity-node";
import ResonanceOptions from "./resonance-options";

// Extend PixiJS components to make them available as JSX
extend({ Container, Graphics, Text, Sprite, TilingSprite });

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Resonance {
  type: string;
  color: number;
}

interface EntityNodeType {
  id: number;
  x: number;
  y: number;
  label: string;
  resonance: Resonance | null;
}

interface AIAssistantState {
  x: number;
  y: number;
  message: string;
  step: string;
}

interface ResonanceOptionsState {
  x: number;
  y: number;
}

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [draggedSeed, setDraggedSeed] = useState<Point | null>(null);
  const [trailPoints, setTrailPoints] = useState<Point[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [entityNodes, setEntityNodes] = useState<EntityNodeType[]>([]);
  const [aiAssistant, setAiAssistant] = useState<AIAssistantState | null>(null);
  const [resonanceOptions, setResonanceOptions] = useState<ResonanceOptionsState | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputPosition, setInputPosition] = useState<Point | null>(null);
  const [particleTarget, setParticleTarget] = useState<Point | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [nodeToRemove, setNodeToRemove] = useState<number | null>(null);

  const panelWidth = 200;

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

  const handleSeedDragStart = useCallback((event: FederatedPointerEvent) => {
    const position = event.data.global;
    setDraggedSeed({ x: position.x, y: position.y });
    setTrailPoints([]);
  }, []);

  const handleSeedDragMove = useCallback(
    (event: FederatedPointerEvent) => {
      if (!draggedSeed) return;

      const position = event.data.global;
      setDraggedSeed({ x: position.x, y: position.y });

      setTrailPoints((prev) => {
        const newPoints = [...prev, { x: position.x, y: position.y }];
        return newPoints.slice(-30); // Keep last 30 points
      });
    },
    [draggedSeed]
  );

  const handleSeedDragEnd = useCallback(
    (event: FederatedPointerEvent) => {
      if (!draggedSeed) return;

      const position = event.data.global;
      const panelLeft = dimensions.width - panelWidth;

      // Check if dropped outside the panel (on the field)
      if (position.x < panelLeft) {
        // Seed is planted!
        handleSeedPlanted(position.x, position.y);
      }

      // Cleanup
      setDraggedSeed(null);
      setTrailPoints([]);
    },
    [draggedSeed, panelWidth, dimensions.width]
  );

  const handleSeedPlanted = useCallback((x: number, y: number) => {
    // Create ripple effect
    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);

    // Show AI assistant and input
    setTimeout(() => {
      setAiAssistant({
        x,
        y,
        message: "Would you like to offer something?",
        step: "initial",
      });
      setShowInput(true);
      setInputPosition({ x, y });
    }, 500);
  }, []);

  const handleInputSubmit = useCallback(() => {
    if (!userInput.trim() || !inputPosition) return;

    handleUserIntention(inputPosition.x, inputPosition.y, userInput);
    setUserInput("");
    setShowInput(false);
    setInputPosition(null);
  }, [userInput, inputPosition]);

  const handleUserIntention = useCallback((x: number, y: number, intention: string) => {
    // Hide AI initial question
    setAiAssistant(null);

    // Create entity node
    const newNode: EntityNodeType = {
      id: Date.now(),
      x,
      y,
      label: "Mindful Collaboration Goal",
      resonance: null,
    };
    setEntityNodes((prev) => [...prev, newNode]);

    // Show AI reflection after animation
    setTimeout(() => {
      setAiAssistant({
        x,
        y,
        message: "This feels like Care and Connection. Does that resonate?",
        step: "reflecting",
      });

      // Show resonance options
      setResonanceOptions({ x, y });

      // Remove auto-select demo code - now user drags to select
    }, 800);
  }, []);

  const handleResonanceSelect = useCallback(
    (type: string, color: number) => {
      setEntityNodes((prev) => prev.map((node) => (!node.resonance ? { ...node, resonance: { type, color } } : node)));
      setResonanceOptions(null);

      // Get the position of the node that just got resonance assigned
      const targetNode = entityNodes.find((node) => !node.resonance);
      if (targetNode) {
        setParticleTarget({ x: targetNode.x, y: targetNode.y });

        // Clear particle target after gathering animation completes
        setTimeout(() => {
          setParticleTarget(null);
        }, 3000);
      }

      // Hide AI assistant after selection
      setTimeout(() => {
        setAiAssistant(null);
      }, 1500);
    },
    [entityNodes]
  );

  const handleRemoveNode = useCallback((nodeId: number) => {
    setNodeToRemove(nodeId);
    setShowConfirmDialog(true);
  }, []);

  const confirmRemoveNode = useCallback(() => {
    if (nodeToRemove !== null) {
      setEntityNodes((prev) => prev.filter((node) => node.id !== nodeToRemove));
    }
    setShowConfirmDialog(false);
    setNodeToRemove(null);
  }, [nodeToRemove]);

  const cancelRemoveNode = useCallback(() => {
    setShowConfirmDialog(false);
    setNodeToRemove(null);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Application width={dimensions.width} height={dimensions.height} background={0x000000} resizeTo={window}>
        <BackgroundLayer />

        <AmbientParticles target={particleTarget} />

        {ripples.map((ripple) => (
          <RippleEffect
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onComplete={() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id))}
          />
        ))}

        <DragTrail points={trailPoints} />

        {draggedSeed && <SeedSprite x={draggedSeed.x} y={draggedSeed.y} scale={1.2} />}

        {entityNodes.map((node: EntityNodeType) => (
          <EntityNode
            key={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            resonance={node.resonance}
            onRemove={() => handleRemoveNode(node.id)}
          />
        ))}

        {aiAssistant && (
          <AIAssistant
            x={aiAssistant.x}
            y={aiAssistant.y}
            message={aiAssistant.message}
            screenWidth={dimensions.width}
            screenHeight={dimensions.height}
          />
        )}

        {resonanceOptions && (
          <ResonanceOptions x={resonanceOptions.x} y={resonanceOptions.y} onSelect={handleResonanceSelect} />
        )}

        <SeedPanel
          panelWidth={panelWidth}
          onDragStart={handleSeedDragStart}
          onDragMove={handleSeedDragMove}
          onDragEnd={handleSeedDragEnd}
        />
      </Application>

      {showInput && inputPosition && (
        <div
          style={{
            position: "absolute",
            left: inputPosition.x - 150,
            top: inputPosition.y + 80,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleInputSubmit();
              }
            }}
            placeholder="Describe what you want to offer..."
            autoFocus
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: "2px solid #4a9dcc",
              borderRadius: "8px",
              backgroundColor: "rgba(26, 77, 109, 0.95)",
              color: "#ffffff",
              outline: "none",
              minWidth: "300px",
              fontFamily: "Arial, sans-serif",
            }}
          />
          <button
            onClick={handleInputSubmit}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#4a9dcc",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              fontWeight: "500",
            }}
          >
            Create
          </button>
        </div>
      )}

      {showConfirmDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(26, 77, 109, 0.98)",
              padding: "32px",
              borderRadius: "12px",
              border: "2px solid #4a9dcc",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#ffffff",
                fontSize: "18px",
                marginBottom: "24px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Are you sure you want to take back this offering?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={cancelRemoveNode}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  backgroundColor: "#6b7280",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveNode}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "500",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple seed sprite component for dragging
interface SeedSpriteProps {
  x: number;
  y: number;
  scale?: number;
}

function SeedSprite({ x, y, scale = 1 }: SeedSpriteProps) {
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

  return (
    <pixiContainer x={x} y={y} scale={scale}>
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
      {seedTexture && <pixiSprite texture={seedTexture} anchor={0.5} scale={0.035} />}
    </pixiContainer>
  );
}

export default App;
