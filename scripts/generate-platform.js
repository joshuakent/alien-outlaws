/**
 * Platform Graphics Generator
 *
 * This script generates a space-themed platform image used for the jumping platforms in the game.
 * It creates futuristic spacecraft/space station style platforms with energy elements.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating space platform image...');

// Platform dimensions
const width = 192;
const height = 48;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Color palette for space theme
const colors = {
	spaceMetal: '#2C3E50',
	darkMetal: '#1A2530',
	lightMetal: '#95A5A6',
	energy: '#00ccff',
	energyGlow: '#80e5ff',
	purpleEnergy: '#9933ff',
	warning: '#ffcc00',
	highlight: '#ffffff',
	shadow: '#000000'
};

// Create transparent background
ctx.clearRect(0, 0, width, height);

// Draw main platform shape (metal base)
const platformGradient = ctx.createLinearGradient(0, 0, 0, height);
platformGradient.addColorStop(0, colors.lightMetal);
platformGradient.addColorStop(0.4, colors.spaceMetal);
platformGradient.addColorStop(1, colors.darkMetal);

ctx.fillStyle = platformGradient;
ctx.beginPath();
ctx.roundRect(0, 0, width, height, 10);
ctx.fill();

// Add metal panel divisions
ctx.strokeStyle = colors.darkMetal;
ctx.lineWidth = 2;

// Horizontal division
ctx.beginPath();
ctx.moveTo(10, height / 2);
ctx.lineTo(width - 10, height / 2);
ctx.stroke();

// Vertical divisions
for (let i = 1; i < 4; i++) {
	const x = i * (width / 4);
	ctx.beginPath();
	ctx.moveTo(x, 5);
	ctx.lineTo(x, height - 5);
	ctx.stroke();
}

// Add tech details - energy conduits
const conduitY = height / 4;
const conduitHeight = 6;

// Energy conduit
ctx.fillStyle = colors.darkMetal;
ctx.fillRect(15, conduitY - conduitHeight / 2, width - 30, conduitHeight);

// Energy flow
ctx.fillStyle = colors.energy;
ctx.fillRect(18, conduitY - conduitHeight / 2 + 1, width - 36, conduitHeight - 2);

// Energy pulse effect
for (let i = 0; i < 5; i++) {
	const pulseX = 18 + i * ((width - 36) / 4);
	const pulseWidth = 10;
	ctx.fillStyle = colors.energyGlow;
	ctx.fillRect(pulseX, conduitY - conduitHeight / 2 + 1, pulseWidth, conduitHeight - 2);
}

// Add tech panels
function drawTechPanel(x, y, width, height, mainColor) {
	// Panel base
	ctx.fillStyle = colors.darkMetal;
	ctx.fillRect(x, y, width, height);

	// Panel interior
	ctx.fillStyle = mainColor;
	ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

	// Add highlight
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.fillRect(x + 3, y + 3, width - 6, 2);
}

// Bottom tech panels with warning stripes
const panelHeight = 12;
for (let i = 0; i < 4; i++) {
	const panelX = 15 + i * ((width - 30) / 4);
	const panelWidth = (width - 30) / 4 - 10;

	// Alternate between energy and warning panels
	const panelColor = i % 2 === 0 ? colors.energy : colors.warning;
	drawTechPanel(panelX, height - panelHeight - 5, panelWidth, panelHeight, panelColor);
}

// Add glow effect to platform edges
const glowGradient = ctx.createLinearGradient(0, 0, 0, height);
glowGradient.addColorStop(0, 'rgba(0, 204, 255, 0.4)');
glowGradient.addColorStop(1, 'rgba(0, 204, 255, 0)');

ctx.fillStyle = glowGradient;
ctx.beginPath();
ctx.roundRect(0, 0, width, height, 10);
ctx.fill();

// Add tech details - circular indicators
function drawIndicator(x, y, radius, color) {
	// Outer ring
	ctx.strokeStyle = colors.darkMetal;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.stroke();

	// Inner circle
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
	ctx.fill();

	// Light shine
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	ctx.beginPath();
	ctx.arc(x - radius / 3, y - radius / 3, radius / 3, 0, Math.PI * 2);
	ctx.fill();
}

// Add three indicators on the right side
drawIndicator(width - 20, height / 4, 6, colors.energy);
drawIndicator(width - 20, height / 2, 6, colors.purpleEnergy);
drawIndicator(width - 20, (3 * height) / 4, 6, colors.warning);

// Add spacecraft docking clamps at ends
function drawDockingClamp(x, y, direction) {
	const clampWidth = 15;
	const clampHeight = height - 10;

	// Clamp base
	ctx.fillStyle = colors.darkMetal;
	ctx.beginPath();
	if (direction === 'left') {
		ctx.moveTo(x, y);
		ctx.lineTo(x + clampWidth, y + 10);
		ctx.lineTo(x + clampWidth, y + clampHeight - 10);
		ctx.lineTo(x, y + clampHeight);
	} else {
		ctx.moveTo(x + clampWidth, y);
		ctx.lineTo(x, y + 10);
		ctx.lineTo(x, y + clampHeight - 10);
		ctx.lineTo(x + clampWidth, y + clampHeight);
	}
	ctx.closePath();
	ctx.fill();

	// Clamp details
	ctx.strokeStyle = colors.lightMetal;
	ctx.lineWidth = 1;

	// Draw horizontal lines
	for (let i = 1; i < 4; i++) {
		const lineY = y + (clampHeight / 4) * i;
		ctx.beginPath();
		if (direction === 'left') {
			ctx.moveTo(x, lineY);
			ctx.lineTo(x + clampWidth - 2, lineY);
		} else {
			ctx.moveTo(x + clampWidth, lineY);
			ctx.lineTo(x + 2, lineY);
		}
		ctx.stroke();
	}
}

// Draw docking clamps at both ends
drawDockingClamp(0, 5, 'left');
drawDockingClamp(width - 15, 5, 'right');

// Add some space dust/stars
for (let i = 0; i < 20; i++) {
	const starX = Math.random() * width;
	const starY = Math.random() * height;
	const starSize = Math.random() * 1.5 + 0.5;

	ctx.fillStyle = colors.highlight;
	ctx.globalAlpha = Math.random() * 0.5 + 0.5;
	ctx.beginPath();
	ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
	ctx.fill();
}
ctx.globalAlpha = 1.0;

// Add top edge highlight
ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
ctx.beginPath();
ctx.roundRect(2, 2, width - 4, 6, 5);
ctx.fill();

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'platform.png'), buffer);

console.log('Space platform image saved to: assets/images/platform.png');
console.log('Dimensions: ' + width + 'x' + height + ' pixels');
