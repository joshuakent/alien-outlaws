/**
 * Tileset Generator
 *
 * This script generates a simple tileset for the game with various terrain tiles.
 * It requires the 'canvas' and 'fs-extra' packages.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating tileset...');

// Create a tileset with 8x8 tiles (64 total tiles)
// 32x32 pixels per tile = 256x256 total
const tileSize = 32;
const tilesWide = 8;
const tilesHigh = 8;
const canvasWidth = tileSize * tilesWide;
const canvasHeight = tileSize * tilesHigh;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Fill canvas with black for transparent detection
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// Define colors for the tileset
const groundColor = '#8b4513'; // Brown for ground
const grassColor = '#3c8d24'; // Green for grass
const stoneColor = '#888888'; // Gray for stone/rocks
const sandColor = '#dbc972'; // Tan for sand
const metalColor = '#4a6484'; // Bluish metal for platforms
const accentColor = '#cc5500'; // Rusty orange accent
const crystalColor = '#9966ff'; // Purple for crystals
const iceColor = '#a0e0ff'; // Light blue for ice

// Helper function to draw a single tile
function drawTile(tileX, tileY, type) {
	const x = tileX * tileSize;
	const y = tileY * tileSize;

	// Draw tile ID for reference
	ctx.fillStyle = '#ffffff22';
	ctx.font = '8px Arial';
	ctx.fillText(`${tileX + tileY * tilesWide}`, x + 2, y + 8);

	// Draw different tile types
	switch (type) {
		case 'empty':
			// Empty/transparent tile
			break;

		case 'ground':
			drawGroundTile(x, y);
			break;

		case 'ground-top':
			drawGroundTopTile(x, y);
			break;

		case 'platform-left':
			drawPlatformLeftTile(x, y);
			break;

		case 'platform-middle':
			drawPlatformMiddleTile(x, y);
			break;

		case 'platform-right':
			drawPlatformRightTile(x, y);
			break;

		case 'ground-left':
			drawGroundLeftTile(x, y);
			break;

		case 'ground-right':
			drawGroundRightTile(x, y);
			break;

		case 'ground-single':
			drawGroundSingleTile(x, y);
			break;

		case 'stone':
			drawStoneTile(x, y);
			break;

		case 'crystal':
			drawCrystalTile(x, y);
			break;

		case 'sand':
			drawSandTile(x, y);
			break;

		case 'metal-floor':
			drawMetalFloorTile(x, y);
			break;

		case 'metal-wall':
			drawMetalWallTile(x, y);
			break;

		case 'ice':
			drawIceTile(x, y);
			break;

		case 'crate':
			drawCrateTile(x, y);
			break;

		case 'spike':
			drawSpikeTile(x, y);
			break;
	}
}

// Specific tile drawing functions
function drawGroundTile(x, y) {
	// Base ground color
	ctx.fillStyle = groundColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Add some texture/noise
	ctx.fillStyle = '#00000033';
	for (let i = 0; i < 10; i++) {
		const dotX = x + Math.random() * tileSize;
		const dotY = y + Math.random() * tileSize;
		const dotSize = 1 + Math.random() * 3;
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawGroundTopTile(x, y) {
	// Base ground color
	ctx.fillStyle = groundColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Grass top
	ctx.fillStyle = grassColor;
	ctx.fillRect(x, y, tileSize, 6);

	// Grass texture
	ctx.fillStyle = '#ffffff33';
	for (let i = 0; i < 8; i++) {
		const grassX = x + Math.random() * tileSize;
		ctx.fillRect(grassX, y, 1, 2 + Math.random() * 4);
	}

	// Dirt texture
	ctx.fillStyle = '#00000033';
	for (let i = 0; i < 8; i++) {
		const dotX = x + Math.random() * tileSize;
		const dotY = y + 6 + Math.random() * (tileSize - 6);
		const dotSize = 1 + Math.random() * 2;
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawPlatformLeftTile(x, y) {
	// Metal platform base
	ctx.fillStyle = metalColor;
	ctx.fillRect(x, y, tileSize, tileSize / 2);

	// Left edge detail
	ctx.fillStyle = accentColor;
	ctx.fillRect(x, y, 4, tileSize / 2);

	// Top edge highlight
	ctx.fillStyle = '#ffffff33';
	ctx.fillRect(x, y, tileSize, 2);

	// Rivet details
	ctx.fillStyle = '#555555';
	ctx.beginPath();
	ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(x + 6, y + 10, 2, 0, Math.PI * 2);
	ctx.fill();
}

function drawPlatformMiddleTile(x, y) {
	// Metal platform base
	ctx.fillStyle = metalColor;
	ctx.fillRect(x, y, tileSize, tileSize / 2);

	// Top edge highlight
	ctx.fillStyle = '#ffffff33';
	ctx.fillRect(x, y, tileSize, 2);

	// Texture details
	ctx.fillStyle = '#00000022';
	for (let i = 0; i < 5; i++) {
		const lineX = x + 4 + i * 6;
		ctx.fillRect(lineX, y + 4, 2, tileSize / 2 - 8);
	}
}

function drawPlatformRightTile(x, y) {
	// Metal platform base
	ctx.fillStyle = metalColor;
	ctx.fillRect(x, y, tileSize, tileSize / 2);

	// Right edge detail
	ctx.fillStyle = accentColor;
	ctx.fillRect(x + tileSize - 4, y, 4, tileSize / 2);

	// Top edge highlight
	ctx.fillStyle = '#ffffff33';
	ctx.fillRect(x, y, tileSize, 2);

	// Rivet details
	ctx.fillStyle = '#555555';
	ctx.beginPath();
	ctx.arc(x + tileSize - 6, y + 6, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(x + tileSize - 6, y + 10, 2, 0, Math.PI * 2);
	ctx.fill();
}

function drawGroundLeftTile(x, y) {
	// Base ground
	ctx.fillStyle = groundColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Left edge detail
	ctx.fillStyle = '#00000033';
	ctx.fillRect(x, y, 4, tileSize);

	// Texture
	ctx.fillStyle = '#00000033';
	for (let i = 0; i < 8; i++) {
		const dotX = x + 4 + Math.random() * (tileSize - 4);
		const dotY = y + Math.random() * tileSize;
		const dotSize = 1 + Math.random() * 2;
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawGroundRightTile(x, y) {
	// Base ground
	ctx.fillStyle = groundColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Right edge detail
	ctx.fillStyle = '#00000033';
	ctx.fillRect(x + tileSize - 4, y, 4, tileSize);

	// Texture
	ctx.fillStyle = '#00000033';
	for (let i = 0; i < 8; i++) {
		const dotX = x + Math.random() * (tileSize - 4);
		const dotY = y + Math.random() * tileSize;
		const dotSize = 1 + Math.random() * 2;
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawGroundSingleTile(x, y) {
	// Base ground
	ctx.fillStyle = groundColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Top grass
	ctx.fillStyle = grassColor;
	ctx.fillRect(x, y, tileSize, 6);

	// Edge details
	ctx.fillStyle = '#00000033';
	ctx.fillRect(x, y, 4, tileSize);
	ctx.fillRect(x + tileSize - 4, y, 4, tileSize);

	// Grass texture
	ctx.fillStyle = '#ffffff33';
	for (let i = 0; i < 8; i++) {
		const grassX = x + Math.random() * tileSize;
		ctx.fillRect(grassX, y, 1, 2 + Math.random() * 4);
	}
}

function drawStoneTile(x, y) {
	// Base stone
	ctx.fillStyle = stoneColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Texture/cracks
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 1;

	// Draw some random cracks
	for (let i = 0; i < 3; i++) {
		const startX = x + Math.random() * tileSize;
		const startY = y + Math.random() * tileSize;

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(startX + (Math.random() * 10 - 5), startY + (Math.random() * 10 - 5));
		ctx.stroke();
	}

	// Highlights
	ctx.fillStyle = '#ffffff33';
	ctx.beginPath();
	ctx.arc(x + 10 + Math.random() * 10, y + 10 + Math.random() * 10, 4, 0, Math.PI * 2);
	ctx.fill();
}

function drawCrystalTile(x, y) {
	// Base stone background
	ctx.fillStyle = stoneColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Draw crystals
	ctx.fillStyle = crystalColor;

	// Main crystal
	ctx.beginPath();
	ctx.moveTo(x + 16, y + 5);
	ctx.lineTo(x + 22, y + 15);
	ctx.lineTo(x + 16, y + 25);
	ctx.lineTo(x + 10, y + 15);
	ctx.closePath();
	ctx.fill();

	// Smaller crystals
	ctx.beginPath();
	ctx.moveTo(x + 8, y + 10);
	ctx.lineTo(x + 12, y + 15);
	ctx.lineTo(x + 8, y + 20);
	ctx.lineTo(x + 4, y + 15);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(x + 24, y + 8);
	ctx.lineTo(x + 28, y + 13);
	ctx.lineTo(x + 24, y + 18);
	ctx.lineTo(x + 20, y + 13);
	ctx.closePath();
	ctx.fill();

	// Crystal glow
	const gradient = ctx.createRadialGradient(x + 16, y + 16, 0, x + 16, y + 16, 16);
	gradient.addColorStop(0, crystalColor + '44');
	gradient.addColorStop(1, crystalColor + '00');
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(x + 16, y + 16, 16, 0, Math.PI * 2);
	ctx.fill();
}

function drawSandTile(x, y) {
	// Base sand
	ctx.fillStyle = sandColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Texture
	ctx.fillStyle = '#00000022';
	for (let i = 0; i < 15; i++) {
		const dotX = x + Math.random() * tileSize;
		const dotY = y + Math.random() * tileSize;
		const dotSize = 1 + Math.random() * 1.5;
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}

	// Highlights
	ctx.fillStyle = '#ffffff33';
	for (let i = 0; i < 8; i++) {
		const dotX = x + Math.random() * tileSize;
		const dotY = y + Math.random() * tileSize;
		const dotSize = 0.5 + Math.random();
		ctx.beginPath();
		ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawMetalFloorTile(x, y) {
	// Base metal
	ctx.fillStyle = metalColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Grid pattern
	ctx.fillStyle = '#00000033';

	// Horizontal lines
	for (let i = 0; i < 4; i++) {
		ctx.fillRect(x, y + 8 * i, tileSize, 1);
	}

	// Vertical lines
	for (let i = 0; i < 4; i++) {
		ctx.fillRect(x + 8 * i, y, 1, tileSize);
	}

	// Rivet details
	ctx.fillStyle = '#555555';
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			ctx.beginPath();
			ctx.arc(x + 8 + i * 8, y + 8 + j * 8, 1.5, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

function drawMetalWallTile(x, y) {
	// Base metal
	ctx.fillStyle = metalColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Wall pattern - horizontal plates
	ctx.fillStyle = '#00000033';

	// Plate edges
	for (let i = 0; i < 4; i++) {
		ctx.fillRect(x, y + 8 * i, tileSize, 2);
	}

	// Rivet details
	ctx.fillStyle = '#555555';
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 3; j++) {
			ctx.beginPath();
			ctx.arc(x + 6 + i * 20, y + 5 + j * 8, 2, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

function drawIceTile(x, y) {
	// Base ice
	ctx.fillStyle = iceColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Ice texture with highlights
	ctx.fillStyle = '#ffffff55';

	// Random highlight areas
	for (let i = 0; i < 3; i++) {
		const hlX = x + Math.random() * tileSize;
		const hlY = y + Math.random() * tileSize;
		const hlSize = 2 + Math.random() * 4;

		ctx.beginPath();
		ctx.arc(hlX, hlY, hlSize, 0, Math.PI * 2);
		ctx.fill();
	}

	// Ice cracks
	ctx.strokeStyle = '#ffffff55';
	ctx.lineWidth = 1;

	// Draw some random cracks
	for (let i = 0; i < 4; i++) {
		const startX = x + Math.random() * tileSize;
		const startY = y + Math.random() * tileSize;

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(startX + (Math.random() * 12 - 6), startY + (Math.random() * 12 - 6));
		ctx.stroke();
	}
}

function drawCrateTile(x, y) {
	// Crate base
	ctx.fillStyle = '#a67c52'; // Wooden color
	ctx.fillRect(x, y, tileSize, tileSize);

	// Crate border
	ctx.fillStyle = '#7d5a3c'; // Darker wood
	ctx.fillRect(x, y, tileSize, 4);
	ctx.fillRect(x, y + tileSize - 4, tileSize, 4);
	ctx.fillRect(x, y, 4, tileSize);
	ctx.fillRect(x + tileSize - 4, y, 4, tileSize);

	// Crate cross boards
	ctx.fillRect(x, y + tileSize / 2 - 2, tileSize, 4);
	ctx.fillRect(x + tileSize / 2 - 2, y, 4, tileSize);

	// Wood grain texture
	ctx.strokeStyle = '#00000022';
	ctx.lineWidth = 1;

	// Horizontal wood grain
	for (let i = 0; i < 6; i++) {
		const y1 = y + 6 + i * 4;
		if (y1 > y + tileSize / 2 - 2 && y1 < y + tileSize / 2 + 2) continue;
		if (y1 > y + tileSize - 4) continue;

		ctx.beginPath();
		ctx.moveTo(x + 4, y1);
		ctx.lineTo(x + tileSize - 4, y1);
		ctx.stroke();
	}

	// Vertical wood grain
	for (let i = 0; i < 6; i++) {
		const x1 = x + 6 + i * 4;
		if (x1 > x + tileSize / 2 - 2 && x1 < x + tileSize / 2 + 2) continue;
		if (x1 > x + tileSize - 4) continue;

		ctx.beginPath();
		ctx.moveTo(x1, y + 4);
		ctx.lineTo(x1, y + tileSize - 4);
		ctx.stroke();
	}
}

function drawSpikeTile(x, y) {
	// Base ground
	ctx.fillStyle = stoneColor;
	ctx.fillRect(x, y, tileSize, tileSize);

	// Spikes - triangles pointing up
	ctx.fillStyle = '#555555'; // Dark metal

	// Draw 4 spikes
	for (let i = 0; i < 4; i++) {
		const spikeX = x + 4 + i * 8;

		ctx.beginPath();
		ctx.moveTo(spikeX, y + 6);
		ctx.lineTo(spikeX + 4, y + 20);
		ctx.lineTo(spikeX - 4, y + 20);
		ctx.closePath();
		ctx.fill();
	}

	// Spike highlights
	ctx.fillStyle = '#ffffff33';
	for (let i = 0; i < 4; i++) {
		const spikeX = x + 4 + i * 8;

		ctx.beginPath();
		ctx.moveTo(spikeX, y + 6);
		ctx.lineTo(spikeX + 1, y + 10);
		ctx.lineTo(spikeX - 1, y + 10);
		ctx.closePath();
		ctx.fill();
	}
}

// Draw the tileset
// Row 1: Basic ground and platform tiles
drawTile(0, 0, 'ground');
drawTile(1, 0, 'ground-top');
drawTile(2, 0, 'ground-left');
drawTile(3, 0, 'ground-right');
drawTile(4, 0, 'ground-single');
drawTile(5, 0, 'platform-left');
drawTile(6, 0, 'platform-middle');
drawTile(7, 0, 'platform-right');

// Row 2: Materials and obstacles
drawTile(0, 1, 'stone');
drawTile(1, 1, 'crystal');
drawTile(2, 1, 'sand');
drawTile(3, 1, 'ice');
drawTile(4, 1, 'metal-floor');
drawTile(5, 1, 'metal-wall');
drawTile(6, 1, 'crate');
drawTile(7, 1, 'spike');

// Rows 3-8: Empty for future expansion
// These could be filled with more tile variants, decorations, etc.

// Save the tileset
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'tileset.png'), buffer);

console.log('Tileset generated successfully!');
console.log('Saved to: assets/images/tileset.png');
console.log('\nThe tileset contains:');
console.log('- Row 1: Basic ground and platform tiles');
console.log('- Row 2: Materials and obstacles');
console.log('\nEach tile is 32x32 pixels, arranged in an 8x8 grid (256x256 total).');
