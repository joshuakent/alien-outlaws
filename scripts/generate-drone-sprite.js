/**
 * Hovering Drone Sprite Generator
 *
 * This script generates a simple hovering drone sprite sheet with frames for animations.
 * It requires the 'canvas' and 'fs-extra' packages.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating hovering drone sprite sheet...');

// Create a sprite sheet with 8 frames (2x4 grid)
// 48x48 pixels per frame = 96x192 total (smaller than character sprites)
const frameSize = 48;
const canvasWidth = frameSize * 2; // 2 columns
const canvasHeight = frameSize * 4; // 4 rows
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Fill background with transparent
ctx.clearRect(0, 0, canvasWidth, canvasHeight);

// Define colors for the hovering drone
const bodyColor = '#444444'; // Dark gray metallic body
const accentColor = '#00aaff'; // Blue accents/lights
const glassColor = '#88ccff'; // Transparent glass dome
const propellerColor = '#222222'; // Dark propeller
const glowColor = '#00ccff'; // Energy glow
const warningColor = '#ff3300'; // Warning lights
const lensColor = '#ff0000'; // Red camera lens

// Function to draw the drone at a specific frame position
function drawDroneFrame(frameX, frameY, variant) {
	const x = frameX * frameSize;
	const y = frameY * frameSize;

	// Clear the frame
	ctx.clearRect(x, y, frameSize, frameSize);

	// Draw frame number for reference
	ctx.fillStyle = '#ffffff44';
	ctx.font = '10px Arial';
	ctx.fillText(`${frameX + frameY * 2}`, x + 4, y + 10);

	// Base position (center of frame)
	const centerX = x + frameSize / 2;
	const centerY = y + frameSize / 2;

	// Draw the drone with different states based on variant
	switch (variant) {
		case 'hover1':
			drawDrone(centerX, centerY, 0, 0, 0);
			break;
		case 'hover2':
			drawDrone(centerX, centerY, 0, -1, 15);
			break;
		case 'hover3':
			drawDrone(centerX, centerY, 0, 0, 30);
			break;
		case 'hover4':
			drawDrone(centerX, centerY, 0, 1, 45);
			break;
		case 'move1':
			drawDrone(centerX, centerY, -2, -1, 60, true);
			break;
		case 'move2':
			drawDrone(centerX, centerY, -1, 0, 75, true);
			break;
		case 'move3':
			drawDrone(centerX, centerY, 1, 1, 90, true);
			break;
		case 'move4':
			drawDrone(centerX, centerY, 2, 0, 105, true);
			break;
	}
}

// Main function to draw the drone with various parameters
function drawDrone(x, y, offsetX, offsetY, propellerAngle = 0, isMoving = false) {
	// Adjust position based on offset
	x += offsetX;
	y += offsetY;

	// Glow effect beneath the drone
	const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
	gradient.addColorStop(0, glowColor + '33'); // Light blue glow, transparent
	gradient.addColorStop(1, glowColor + '00'); // Transparent
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(x, y, 15, 0, Math.PI * 2);
	ctx.fill();

	// Draw propellers (rotating based on propellerAngle)
	const propellerLength = 16;

	// Top propeller
	ctx.save();
	ctx.translate(x, y - 12);
	ctx.rotate((propellerAngle * Math.PI) / 180);
	ctx.fillStyle = propellerColor;
	ctx.fillRect(-propellerLength / 2, -1, propellerLength, 2);
	ctx.fillRect(-1, -propellerLength / 2, 2, propellerLength);

	// Propeller center
	ctx.beginPath();
	ctx.arc(0, 0, 3, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Bottom propeller
	ctx.save();
	ctx.translate(x, y + 12);
	ctx.rotate((-propellerAngle * Math.PI) / 180); // Rotate in opposite direction
	ctx.fillStyle = propellerColor;
	ctx.fillRect(-propellerLength / 2, -1, propellerLength, 2);
	ctx.fillRect(-1, -propellerLength / 2, 2, propellerLength);

	// Propeller center
	ctx.beginPath();
	ctx.arc(0, 0, 3, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Main body (oval shaped)
	ctx.fillStyle = bodyColor;
	ctx.beginPath();
	ctx.ellipse(x, y, 10, 8, 0, 0, Math.PI * 2);
	ctx.fill();

	// Glass dome on top
	ctx.fillStyle = glassColor;
	ctx.beginPath();
	ctx.ellipse(x, y - 4, 6, 4, 0, 0, Math.PI);
	ctx.fill();

	// Accent lights on the side (flashing if moving)
	if (isMoving && Math.floor(Date.now() / 100) % 2 === 0) {
		ctx.fillStyle = warningColor;
	} else {
		ctx.fillStyle = accentColor;
	}

	// Left light
	ctx.beginPath();
	ctx.arc(x - 9, y, 2, 0, Math.PI * 2);
	ctx.fill();

	// Right light
	ctx.beginPath();
	ctx.arc(x + 9, y, 2, 0, Math.PI * 2);
	ctx.fill();

	// Camera/sensor underneath
	ctx.fillStyle = bodyColor;
	ctx.beginPath();
	ctx.ellipse(x, y + 4, 4, 3, 0, 0, Math.PI * 2);
	ctx.fill();

	// Camera lens
	ctx.fillStyle = lensColor;
	ctx.beginPath();
	ctx.arc(x, y + 4, 2, 0, Math.PI * 2);
	ctx.fill();

	// Additional detail - antennas
	ctx.strokeStyle = '#666666';
	ctx.lineWidth = 1;

	// Left antenna
	ctx.beginPath();
	ctx.moveTo(x - 6, y - 4);
	ctx.lineTo(x - 8, y - 10);
	ctx.stroke();

	// Right antenna
	ctx.beginPath();
	ctx.moveTo(x + 6, y - 4);
	ctx.lineTo(x + 8, y - 10);
	ctx.stroke();

	// Antenna tops
	ctx.fillStyle = accentColor;
	ctx.beginPath();
	ctx.arc(x - 8, y - 10, 1, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x + 8, y - 10, 1, 0, Math.PI * 2);
	ctx.fill();
}

// Draw each animation frame
// Hovering animation (frames 0-3)
drawDroneFrame(0, 0, 'hover1');
drawDroneFrame(1, 0, 'hover2');
drawDroneFrame(0, 1, 'hover3');
drawDroneFrame(1, 1, 'hover4');

// Moving animation (frames 4-7)
drawDroneFrame(0, 2, 'move1');
drawDroneFrame(1, 2, 'move2');
drawDroneFrame(0, 3, 'move3');
drawDroneFrame(1, 3, 'move4');

// Save the sprite sheet
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'hovering-drone.png'), buffer);

console.log('Hovering drone sprite sheet generated successfully!');
console.log('Saved to: assets/images/hovering-drone.png');
console.log('\nThe sprite sheet contains:');
console.log('- Frames 0-3: Hovering animation');
console.log('- Frames 4-7: Moving animation');
console.log('\nEach frame is 48x48 pixels, arranged in a 2x4 grid (96x192 total).');
