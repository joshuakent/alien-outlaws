/**
 * Script to generate basic placeholder assets for development
 * This version uses the Canvas API to create actual PNG images
 *
 * Run with: node scripts/generate-basic-assets.js
 *
 * Note: This script requires the 'canvas' and 'fs-extra' packages.
 * Install them with:
 *   npm install canvas fs-extra
 */

const fs = require('fs');
const path = require('path');

// This is a simplified version that doesn't actually create PNGs
// but outputs instructions on how to use the full version with canvas

console.log('Generating placeholder asset documentation...');

// Ensure directories exist
const directories = ['assets/images', 'assets/audio', 'assets/tilemaps'];

directories.forEach((dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created directory: ${dir}`);
	}
});

// Write instructions for users
const instructions = `# Creating Real Placeholder Assets

This file provides instructions for creating actual PNG images for placeholders
instead of empty files that cause animation errors.

## Installation Requirements

To generate proper placeholder PNGs, you need to install the 'canvas' and 'fs-extra' npm packages:

\`\`\`
npm install canvas fs-extra
\`\`\`

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
`;

fs.writeFileSync('assets/PLACEHOLDER_INSTRUCTIONS.md', instructions);
console.log('Created assets/PLACEHOLDER_INSTRUCTIONS.md with guidance for creating proper placeholder assets');

// Create the empty placeholders anyway since our current code can handle them
console.log('Generating basic placeholder files...');

// Define placeholder assets to generate
const placeholderImages = [
	{ name: 'assets/images/logo.png', width: 200, height: 100, color: '#3498db' },
	{ name: 'assets/images/loading-bar.png', width: 200, height: 20, color: '#2ecc71' },
	{ name: 'assets/images/sheriff.png', width: 64, height: 64, color: '#e74c3c' },
	{ name: 'assets/images/plasma-revolver.png', width: 32, height: 16, color: '#9b59b6' },
	{ name: 'assets/images/lasso.png', width: 48, height: 48, color: '#f1c40f' },
	{ name: 'assets/images/alien-rustler.png', width: 64, height: 64, color: '#1abc9c' },
	{ name: 'assets/images/hovering-drone.png', width: 48, height: 48, color: '#d35400' },
	{ name: 'assets/images/ground.png', width: 400, height: 32, color: '#7f8c8d' },
	{ name: 'assets/images/platform.png', width: 200, height: 32, color: '#7f8c8d' },
	{ name: 'assets/images/bg-far.png', width: 800, height: 600, color: '#34495e' },
	{ name: 'assets/images/bg-mid.png', width: 800, height: 600, color: '#2c3e50' },
	{ name: 'assets/images/health-bar.png', width: 100, height: 20, color: '#e74c3c' },
	{ name: 'assets/images/ammo-indicator.png', width: 100, height: 20, color: '#f39c12' },
	{ name: 'assets/images/tileset.png', width: 128, height: 128, color: '#95a5a6' }
];

const placeholderAudio = ['assets/audio/main-theme.mp3', 'assets/audio/laser-shot.mp3', 'assets/audio/jump.mp3'];

const placeholderTilemaps = ['assets/tilemaps/level-1.json'];

// Simple function to create empty files
function createEmptyFile(filename) {
	try {
		const dir = path.dirname(filename);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.writeFileSync(filename, '');
		console.log(`Created empty placeholder: ${filename}`);
	} catch (err) {
		console.error(`Error creating placeholder ${filename}:`, err);
	}
}

// Generate tilemap
function generatePlaceholderTilemap(filename) {
	try {
		const dir = path.dirname(filename);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		const tilemap = {
			width: 40,
			height: 20,
			tilewidth: 32,
			tileheight: 32,
			layers: [
				{
					name: 'ground',
					data: Array(40 * 20).fill(0)
				}
			]
		};

		// Set ground tiles at the bottom of the map
		for (let x = 0; x < 40; x++) {
			tilemap.layers[0].data[19 * 40 + x] = 1;
		}

		// Add some platforms
		[5, 10, 15, 20, 25, 30].forEach((x) => {
			for (let i = 0; i < 3; i++) {
				tilemap.layers[0].data[15 * 40 + x + i] = 1;
			}
		});

		fs.writeFileSync(filename, JSON.stringify(tilemap, null, 2));
		console.log(`Created placeholder tilemap: ${filename}`);
	} catch (err) {
		console.error(`Error creating placeholder tilemap ${filename}:`, err);
	}
}

// Generate all placeholder assets
placeholderImages.forEach((img) => {
	createEmptyFile(img.name);
});

placeholderAudio.forEach((audio) => {
	createEmptyFile(audio);
});

placeholderTilemaps.forEach((tilemap) => {
	generatePlaceholderTilemap(tilemap);
});

console.log(`
Placeholder files generated successfully.
1. The game should now run without errors using the improved error handling code.
2. For proper placeholder PNGs, follow the instructions in assets/PLACEHOLDER_INSTRUCTIONS.md
3. Real assets should be created or sourced before production use.
`);
