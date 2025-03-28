/**
 * Alien Rustler Sprite Generator
 *
 * This script generates a simple alien rustler sprite sheet with frames for animations.
 * It requires the 'canvas' and 'fs-extra' packages.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating alien rustler sprite sheet...');

// Create a sprite sheet with 16 frames (4x4 grid)
// 64x64 pixels per frame = 256x256 total
const canvasWidth = 256;
const canvasHeight = 256;
const frameSize = 64;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Fill background with transparent
ctx.clearRect(0, 0, canvasWidth, canvasHeight);

// Define colors for the alien rustler
const skinColor = '#5cd65c'; // Green alien skin
const eyeColor = '#ff0000'; // Red eyes
const bodyColor = '#ff6600'; // Orange body/suit
const beltColor = '#440044'; // Dark purple belt
const legsColor = '#663311'; // Brown legs
const bootsColor = '#222222'; // Dark boots
const weaponColor = '#aaaaaa'; // Silver weapon
const antennaColor = '#5cd65c'; // Green antenna
const glowColor = '#88ff88'; // Glow effect for the alien

// Draw each frame
// We'll create:
// - 4 frames for idle animation (0-3)
// - 8 frames for running animation (4-11)
// - 4 frames for jumping animation (12-15)

// Helper function to draw the alien at a specific frame position
function drawAlienFrame(frameX, frameY, variant) {
	const x = frameX * frameSize;
	const y = frameY * frameSize;

	// Clear the frame
	ctx.clearRect(x, y, frameSize, frameSize);

	// Draw frame number for reference
	ctx.fillStyle = '#ffffff44';
	ctx.font = '10px Arial';
	ctx.fillText(`${frameX + frameY * 4}`, x + 4, y + 10);

	// Base position (center of frame)
	const centerX = x + frameSize / 2;
	const centerY = y + frameSize / 2;

	// Draw the alien with different poses based on variant
	switch (variant) {
		case 'idle1':
			drawAlien(centerX, centerY, 0, 0); // straight
			break;
		case 'idle2':
			drawAlien(centerX, centerY, 0, -1); // slight up
			break;
		case 'idle3':
			drawAlien(centerX, centerY, 0, 0); // normal
			break;
		case 'idle4':
			drawAlien(centerX, centerY, 0, 1); // slight down
			break;
		case 'run1':
			drawAlien(centerX, centerY, -3, -2, true, 20);
			break;
		case 'run2':
			drawAlien(centerX, centerY, -2, -1, true, 10);
			break;
		case 'run3':
			drawAlien(centerX, centerY, 0, 0, true, 0);
			break;
		case 'run4':
			drawAlien(centerX, centerY, 2, 1, true, -10);
			break;
		case 'run5':
			drawAlien(centerX, centerY, 3, 2, true, -20);
			break;
		case 'run6':
			drawAlien(centerX, centerY, 2, 1, true, -10);
			break;
		case 'run7':
			drawAlien(centerX, centerY, 0, 0, true, 0);
			break;
		case 'run8':
			drawAlien(centerX, centerY, -2, -1, true, 10);
			break;
		case 'jump1':
			drawAlien(centerX, centerY, 0, -3, false, 0, 'prep');
			break;
		case 'jump2':
			drawAlien(centerX, centerY - 5, 0, -2, false, 0, 'up');
			break;
		case 'jump3':
			drawAlien(centerX, centerY - 8, 0, 0, false, 0, 'peak');
			break;
		case 'jump4':
			drawAlien(centerX, centerY - 3, 0, 3, false, 0, 'down');
			break;
	}
}

// Main function to draw the alien with various parameters
function drawAlien(x, y, offsetX, offsetY, isRunning = false, legAngle = 0, jumpState = '') {
	// Adjust position based on offset
	x += offsetX;
	y += offsetY;

	// Add a subtle glow effect behind the alien
	const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
	gradient.addColorStop(0, glowColor + '44'); // Semi-transparent
	gradient.addColorStop(1, glowColor + '00'); // Transparent
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(x, y, 20, 0, Math.PI * 2);
	ctx.fill();

	// Body (adjusted based on the animation state)
	ctx.fillStyle = bodyColor;
	ctx.beginPath();
	ctx.ellipse(x, y, 12, 15, 0, 0, Math.PI * 2);
	ctx.fill();

	// Belt
	ctx.fillStyle = beltColor;
	ctx.fillRect(x - 12, y + 5, 24, 3);

	// Legs
	ctx.fillStyle = legsColor;

	// Dynamic leg positioning for running animation
	if (isRunning || jumpState === 'prep' || jumpState === 'down') {
		// Left leg
		ctx.save();
		ctx.translate(x - 6, y + 10);
		ctx.rotate(((legAngle - 10) * Math.PI) / 180);
		ctx.fillRect(-2, 0, 4, 14);
		ctx.restore();

		// Right leg
		ctx.save();
		ctx.translate(x + 6, y + 10);
		ctx.rotate(((-legAngle + 10) * Math.PI) / 180);
		ctx.fillRect(-2, 0, 4, 14);
		ctx.restore();
	} else if (jumpState === 'up' || jumpState === 'peak') {
		// Legs positioned for jumping
		ctx.fillRect(x - 8, y + 10, 4, 12);
		ctx.fillRect(x + 4, y + 10, 4, 12);
	} else {
		// Standing position
		ctx.fillRect(x - 8, y + 10, 4, 14);
		ctx.fillRect(x + 4, y + 10, 4, 14);
	}

	// Boots
	ctx.fillStyle = bootsColor;

	if (isRunning || jumpState === 'prep' || jumpState === 'down') {
		// Dynamic boots for running
		ctx.save();
		ctx.translate(x - 6, y + 24);
		ctx.rotate(((legAngle - 10) * Math.PI) / 180);
		ctx.fillRect(-3, -1, 6, 4);
		ctx.restore();

		ctx.save();
		ctx.translate(x + 6, y + 24);
		ctx.rotate(((-legAngle + 10) * Math.PI) / 180);
		ctx.fillRect(-3, -1, 6, 4);
		ctx.restore();
	} else if (jumpState === 'up' || jumpState === 'peak') {
		// Boots positioned for jumping
		ctx.fillRect(x - 9, y + 22, 6, 4);
		ctx.fillRect(x + 3, y + 22, 6, 4);
	} else {
		// Standing position
		ctx.fillRect(x - 9, y + 24, 6, 4);
		ctx.fillRect(x + 3, y + 24, 6, 4);
	}

	// Head - alien has bigger head than human
	ctx.fillStyle = skinColor;
	ctx.beginPath();
	ctx.arc(x, y - 15, 10, 0, Math.PI * 2);
	ctx.fill();

	// Antennas
	ctx.fillStyle = antennaColor;

	// Left antenna
	ctx.save();
	ctx.translate(x - 5, y - 22);
	ctx.rotate(-0.3);
	ctx.fillRect(-1, -8, 2, 8);

	// Antenna top
	ctx.beginPath();
	ctx.arc(-1, -8, 3, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Right antenna
	ctx.save();
	ctx.translate(x + 5, y - 22);
	ctx.rotate(0.3);
	ctx.fillRect(-1, -8, 2, 8);

	// Antenna top
	ctx.beginPath();
	ctx.arc(-1, -8, 3, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Large alien eyes (oval shaped)
	ctx.fillStyle = eyeColor;

	// Left eye
	ctx.beginPath();
	ctx.ellipse(x - 4, y - 15, 3, 4, 0.3, 0, Math.PI * 2);
	ctx.fill();

	// Right eye
	ctx.beginPath();
	ctx.ellipse(x + 4, y - 15, 3, 4, -0.3, 0, Math.PI * 2);
	ctx.fill();

	// Mouth (small line)
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(x - 3, y - 10);
	ctx.lineTo(x + 3, y - 10);
	ctx.stroke();

	// Alien weapon - ray gun
	ctx.fillStyle = weaponColor;

	// Gun handle
	ctx.fillRect(x + 10, y + 2, 2, 6);

	// Gun barrel
	ctx.fillRect(x + 10, y + 0, 6, 3);

	// Energy cell
	ctx.fillStyle = '#00ffff'; // Cyan for energy
	ctx.beginPath();
	ctx.arc(x + 12, y + 5, 1.5, 0, Math.PI * 2);
	ctx.fill();

	// Add the glowing effect to the eyes
	const eyeGlow = ctx.createRadialGradient(x, y - 15, 0, x, y - 15, 10);
	eyeGlow.addColorStop(0, '#ff666644'); // Red glow, semi-transparent
	eyeGlow.addColorStop(1, '#ff000000'); // Transparent
	ctx.fillStyle = eyeGlow;
	ctx.beginPath();
	ctx.arc(x, y - 15, 10, 0, Math.PI * 2);
	ctx.fill();
}

// Draw each animation frame
// Idle animation (frames 0-3)
drawAlienFrame(0, 0, 'idle1');
drawAlienFrame(1, 0, 'idle2');
drawAlienFrame(2, 0, 'idle3');
drawAlienFrame(3, 0, 'idle4');

// Run animation (frames 4-11)
drawAlienFrame(0, 1, 'run1');
drawAlienFrame(1, 1, 'run2');
drawAlienFrame(2, 1, 'run3');
drawAlienFrame(3, 1, 'run4');
drawAlienFrame(0, 2, 'run5');
drawAlienFrame(1, 2, 'run6');
drawAlienFrame(2, 2, 'run7');
drawAlienFrame(3, 2, 'run8');

// Jump animation (frames 12-15)
drawAlienFrame(0, 3, 'jump1');
drawAlienFrame(1, 3, 'jump2');
drawAlienFrame(2, 3, 'jump3');
drawAlienFrame(3, 3, 'jump4');

// Save the sprite sheet
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'alien-rustler.png'), buffer);

console.log('Alien rustler sprite sheet generated successfully!');
console.log('Saved to: assets/images/alien-rustler.png');
console.log('\nThe sprite sheet contains:');
console.log('- Frames 0-3: Idle animation');
console.log('- Frames 4-11: Running animation');
console.log('- Frames 12-15: Jumping animation');
console.log('\nEach frame is 64x64 pixels, arranged in a 4x4 grid (256x256 total).');
