import { Container, Graphics, Sprite, Text } from "pixi.js";

export function createSeedPanel(app) {
  const panel = new Container();

  // Panel background
  const panelBg = new Graphics();
  const panelWidth = 200;
  const panelHeight = app.screen.height;

  panelBg.rect(0, 0, panelWidth, panelHeight);
  panelBg.fill({ color: 0x0a3d5c, alpha: 0.7 });

  panel.addChild(panelBg);

  // Position panel on the right side
  panel.x = app.screen.width - panelWidth;
  panel.y = 0;

  // Title text
  const title = new Text({
    text: "Make an Offering",
    style: {
      fontFamily: "Arial",
      fontSize: 20,
      fill: 0xffffff,
      align: "center",
    },
  });
  title.anchor.set(0.5);
  title.x = panelWidth / 2;
  title.y = 40;
  panel.addChild(title);

  // Create the seed sprite
  const seed = createSeed();
  seed.x = panelWidth / 2;
  seed.y = 120;
  panel.addChild(seed);

  // Instructions text
  const instructions = new Text({
    text: "Drag the seed into the field to create a new offering",
    style: {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xaaddff,
      align: "center",
      lineHeight: 22,
    },
  });
  instructions.anchor.set(0.5);
  instructions.x = panelWidth / 2;
  instructions.y = 220;
  panel.addChild(instructions);

  return { panel, seed, panelWidth };
}

export function createSeed() {
  const seedContainer = new Container();

  // Outer glow
  const outerGlow = new Graphics();
  outerGlow.circle(0, 0, 35);
  outerGlow.fill({ color: 0x88ddff, alpha: 0.2 });
  seedContainer.addChild(outerGlow);

  // Middle glow
  const middleGlow = new Graphics();
  middleGlow.circle(0, 0, 25);
  middleGlow.fill({ color: 0xaaeeff, alpha: 0.4 });
  seedContainer.addChild(middleGlow);

  // Core seed
  const core = new Graphics();
  core.circle(0, 0, 15);
  core.fill({ color: 0xffffff, alpha: 0.9 });
  seedContainer.addChild(core);

  // Inner sparkle
  const sparkle = new Graphics();
  sparkle.circle(0, 0, 8);
  sparkle.fill({ color: 0xffffaa, alpha: 0.8 });
  seedContainer.addChild(sparkle);

  // Make it interactive
  seedContainer.eventMode = "static";
  seedContainer.cursor = "pointer";

  return seedContainer;
}

export function animateSeed(seed, time) {
  // Gentle pulsing animation
  const scale = 1 + Math.sin(time * 0.002) * 0.1;
  seed.scale.set(scale);

  // Gentle rotation
  seed.rotation += 0.002;
}
