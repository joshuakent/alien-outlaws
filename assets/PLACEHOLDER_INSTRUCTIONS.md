# Creating Real Placeholder Assets

This file provides instructions for creating actual PNG images for placeholders
instead of empty files that cause animation errors.

## Installation Requirements

To generate proper placeholder PNGs, you need to install the 'canvas' and 'fs-extra' npm packages:

```
npm install canvas fs-extra
```

## Manual Placeholder Creation

Until you have proper assets, you can use these free resources:

### For Spritesheets
1. Use the Universal LPC Spritesheet Character Generator: https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. OpenGameArt.org: https://opengameart.org/content/lpc-collection

### For Audio
1. FreeSound.org: https://freesound.org/
2. OpenGameArt.org: https://opengameart.org/content/collections
3. Pixabay: https://pixabay.com/sound-effects/

### For Background Images & UI
1. Create simple gradients using any image editor
2. Generate simple UI elements using applications like Figma or even MS Paint

## Placeholder Asset Specifications

### Player Character (sheriff.png)
- Size: 64x64px spritesheet with 16 frames (4×4 grid)
- Frames 0-3: Idle animation
- Frames 4-11: Run animation
- Frames 12-15: Jump animation

### Enemies
1. alien-rustler.png: 64x64px spritesheet with 8 frames (4×2 grid)
2. hovering-drone.png: 48x48px spritesheet with 4 frames (2×2 grid)

### Weapons
1. plasma-revolver.png: 32x16px spritesheet with 4 frames
2. lasso.png: 48x48px spritesheet with 4 frames

### Terrain
1. ground.png: 400x32px texture
2. platform.png: 200x32px texture
3. tileset.png: 128x128px tileset

### UI Elements
1. health-bar.png: 100x20px image
2. ammo-indicator.png: 100x20px image
3. logo.png: 200x100px image
4. loading-bar.png: 200x20px image

### Background
1. bg-far.png: 800x600px image
2. bg-mid.png: 800x600px image
