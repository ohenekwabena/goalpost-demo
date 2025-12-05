# React Pond - Seed Interaction Experience

A React-based implementation of the seed planting interaction experience using @pixi/react.

## Features

- 🌱 **Seed Panel** - Right-side panel with animated, draggable seed
- ✨ **Drag & Drop** - Smooth drag interaction with shimmering light trails
- 🌊 **Underwater Background** - Background with water overlay and displacement effects
- 💧 **Ambient Particles** - Drifting particles that create an underwater atmosphere
- 🌀 **Ripple Effects** - Expanding ripples when seeds are planted
- 💬 **AI Assistant** - Floating dialog bubbles with smooth animations
- 🎯 **Entity Nodes** - Glowing nodes that represent planted intentions
- 🎨 **Resonance Options** - Interactive options to set node themes (Care, Connection, Growth, Peace)

## Components

- **App.jsx** - Main application component with state management
- **BackgroundLayer.jsx** - Underwater background with displacement filter
- **SeedPanel.jsx** - Right panel with draggable seed
- **DragTrail.jsx** - Visual trail following the dragged seed
- **AmbientParticles.jsx** - Floating ambient particles
- **RippleEffect.jsx** - Expanding ripple animation
- **AIAssistant.jsx** - Animated dialog bubble
- **EntityNode.jsx** - Planted seed node with pulsing animation
- **ResonanceOptions.jsx** - Interactive resonance selection buttons

## How to Run

From the project root:

```bash
npm run dev
```

Then navigate to:
```
http://localhost:5173/react-pond.html
```

## Interaction Flow

1. **Drag the seed** from the right panel onto the underwater field
2. **Light trails** shimmer behind your cursor
3. **Drop the seed** anywhere on the field to plant it
4. **Ripples expand** and particles converge to the planted location
5. **AI Assistant appears** asking "Would you like to offer something?"
6. The seed **transforms into an entity node** labeled "Mindful Collaboration Goal"
7. **AI reflects** on the resonance theme
8. **Select a resonance** type (Care, Connection, Growth, Peace)
9. The node **glows with the chosen color**

## Technical Details

- Built with **React 18** and **@pixi/react**
- Uses **PixiJS v8** for rendering
- Functional components with React Hooks
- Smooth animations using requestAnimationFrame
- Responsive to window size
