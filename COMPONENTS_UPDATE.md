# PixiJS React Components - Updated

All components have been successfully updated to use the proper @pixi/react v8 syntax with `pixi` prefixes.

## Key Changes Made:

### 1. **Component Naming Convention**
- Changed from `<Container>` to `<pixiContainer>`
- Changed from `<Graphics>` to `<pixiGraphics>`
- Changed from `<Text>` to `<pixiText>`
- Changed from `<Sprite>` to `<pixiSprite>`
- Changed from `<TilingSprite>` to `<pixiTilingSprite>`
- Changed from `<Stage>` to `<Application>`

### 2. **TypeScript Types**
- All components now have proper TypeScript interfaces for props
- Using `type` imports for PixiJS types: `import type { Graphics as PixiGraphics, FederatedPointerEvent } from 'pixi.js'`
- Removed direct imports of components from `@pixi/react` (they're auto-generated from extend)

### 3. **Event Handler Naming**
- Changed `onpointerdown` → `onPointerDown`
- Changed `onglobalpointermove` → `onGlobalPointerMove`  
- Changed `onpointerup` → `onPointerUp`
- Changed `onpointerupoutside` → `onPointerUpOutside`

### 4. **Graphics Drawing Callbacks**
- All `draw` callbacks now properly type the graphics parameter: `draw={(g: PixiGraphics) => { ... }}`

### 5. **Application Props**
- Changed from `<Stage options={{ ... }}>` to `<Application background={...} resizeTo={...}>`
- Props are passed directly to Application, not wrapped in `options` object

### 6. **Responsive Design**
- All components track window dimensions with `useState` and resize listeners
- Dimensions are properly typed as `{ width: number; height: number }`
- Components return `null` until dimensions are initialized

### 7. **Animation Frame Types**
- All `requestAnimationFrame` IDs properly typed as `number`
- Proper cleanup in `useEffect` return functions

## Component List:
✅ **ai-assistant.tsx** - Dialog bubbles with floating animation
✅ **ambient-particles.tsx** - Background particle system
✅ **background-layer.tsx** - Background with displacement filter and tiling sprite
✅ **drag-trail.tsx** - Trail effect for dragging
✅ **entity-node.tsx** - Interactive nodes with pulse animation
✅ **ripple-effect.tsx** - Ripple animation effect
✅ **resonance-options.tsx** - Option buttons
✅ **seed-panel.tsx** - Side panel with draggable seed
✅ **app.tsx** - Main application component

All components are now error-free and follow @pixi/react v8 best practices!
