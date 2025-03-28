/**
 * Sheriff Sprite Generator
 *
 * This script generates a simple sheriff sprite sheet with frames for animations.
 * It requires the 'canvas' and 'fs-extra' packages.
 *
 * Installation:
 * npm install canvas fs-extra
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating sheriff sprite sheet...');

// Create a sprite sheet with 16 frames (4x4 grid)
// 64x64 pixels per frame = 256x256 total
const canvasWidth = 256;
const canvasHeight = 256;
const frameSize = 64;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Fill background with transparent
ctx.clearRect(0, 0, canvasWidth, canvasHeight);

// Define colors
const hatColor = '#3a1f04'; // Dark brown
const faceColor = '#f5d6b8'; // Light skin tone
const bodyColor = '#1a3b8a'; // Blue coat
const beltColor = '#8a4204'; // Brown belt
const legsColor = '#333333'; // Dark gray pants
const bootsColor = '#3a1f04'; // Dark brown boots
const gunColor = '#777777'; // Gray gun
const starColor = '#ffcc00'; // Gold star

// Draw each frame
// We'll create:
// - 4 frames for idle animation (0-3)
// - 8 frames for running animation (4-11)
// - 4 frames for jumping animation (12-15)

// Helper function to draw the sheriff at a specific frame position
function drawSheriffFrame(frameX, frameY, variant) {
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

	// Draw the sheriff with different poses based on variant
	switch (variant) {
		case 'idle1':
			drawSheriff(centerX, centerY, 0, 0); // straight
			break;
		case 'idle2':
			drawSheriff(centerX, centerY, 0, 1); // slight up
			break;
		case 'idle3':
			drawSheriff(centerX, centerY, 0, 2); // slight down
			break;
		case 'idle4':
			drawSheriff(centerX, centerY, 0, 1); // slight up again
			break;
		case 'run1':
			drawSheriff(centerX, centerY, -4, -2, true, 20);
			break;
		case 'run2':
			drawSheriff(centerX, centerY, -2, -1, true, 10);
			break;
		case 'run3':
			drawSheriff(centerX, centerY, 0, 0, true, 0);
			break;
		case 'run4':
			drawSheriff(centerX, centerY, 2, 1, true, -10);
			break;
		case 'run5':
			drawSheriff(centerX, centerY, 4, 2, true, -20);
			break;
		case 'run6':
			drawSheriff(centerX, centerY, 2, 1, true, -10);
			break;
		case 'run7':
			drawSheriff(centerX, centerY, 0, 0, true, 0);
			break;
		case 'run8':
			drawSheriff(centerX, centerY, -2, -1, true, 10);
			break;
		case 'jump1':
			drawSheriff(centerX, centerY, 0, -5, false, 0, 'prep');
			break;
		case 'jump2':
			drawSheriff(centerX, centerY - 5, 0, -3, false, 0, 'up');
			break;
		case 'jump3':
			drawSheriff(centerX, centerY - 8, 0, 0, false, 0, 'peak');
			break;
		case 'jump4':
			drawSheriff(centerX, centerY - 3, 0, 5, false, 0, 'down');
			break;
	}
}

// Main function to draw the sheriff with various parameters
function drawSheriff(x, y, offsetX, offsetY, isRunning = false, legAngle = 0, jumpState = '') {
	// Adjust position based on offset
	x += offsetX;
	y += offsetY;

	// Body (adjusted based on the animation state)
	ctx.fillStyle = bodyColor;
	ctx.beginPath();
	ctx.ellipse(x, y, 12, 15, 0, 0, Math.PI * 2);
	ctx.fill();

	// Belt
	ctx.fillStyle = beltColor;
	ctx.fillRect(x - 12, y + 6, 24, 4);

	// Legs
	ctx.fillStyle = legsColor;

	// Dynamic leg positioning for running animation
	if (isRunning || jumpState === 'prep' || jumpState === 'down') {
		// Left leg
		ctx.save();
		ctx.translate(x - 6, y + 10);
		ctx.rotate(((legAngle - 10) * Math.PI) / 180);
		ctx.fillRect(-2, 0, 4, 15);
		ctx.restore();

		// Right leg
		ctx.save();
		ctx.translate(x + 6, y + 10);
		ctx.rotate(((-legAngle + 10) * Math.PI) / 180);
		ctx.fillRect(-2, 0, 4, 15);
		ctx.restore();
	} else if (jumpState === 'up' || jumpState === 'peak') {
		// Legs positioned for jumping
		ctx.fillRect(x - 8, y + 10, 4, 13);
		ctx.fillRect(x + 4, y + 10, 4, 13);
	} else {
		// Standing position
		ctx.fillRect(x - 8, y + 10, 4, 15);
		ctx.fillRect(x + 4, y + 10, 4, 15);
	}

	// Boots
	ctx.fillStyle = bootsColor;

	if (isRunning || jumpState === 'prep' || jumpState === 'down') {
		// Dynamic boots for running
		ctx.save();
		ctx.translate(x - 6, y + 25);
		ctx.rotate(((legAngle - 10) * Math.PI) / 180);
		ctx.fillRect(-3, -1, 6, 5);
		ctx.restore();

		ctx.save();
		ctx.translate(x + 6, y + 25);
		ctx.rotate(((-legAngle + 10) * Math.PI) / 180);
		ctx.fillRect(-3, -1, 6, 5);
		ctx.restore();
	} else if (jumpState === 'up' || jumpState === 'peak') {
		// Boots positioned for jumping
		ctx.fillRect(x - 9, y + 23, 6, 4);
		ctx.fillRect(x + 3, y + 23, 6, 4);
	} else {
		// Standing position
		ctx.fillRect(x - 9, y + 25, 6, 4);
		ctx.fillRect(x + 3, y + 25, 6, 4);
	}

	// Head
	ctx.fillStyle = faceColor;
	ctx.beginPath();
	ctx.arc(x, y - 15, 8, 0, Math.PI * 2);
	ctx.fill();

	// Hat
	ctx.fillStyle = hatColor;
	ctx.fillRect(x - 12, y - 18, 24, 4); // Brim
	ctx.fillRect(x - 8, y - 26, 16, 8); // Top

	// Eyes (simple dots)
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.arc(x - 3, y - 16, 1, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(x + 3, y - 16, 1, 0, Math.PI * 2);
	ctx.fill();

	// Mouth (simple line)
	ctx.beginPath();
	ctx.moveTo(x - 2, y - 12);
	ctx.lineTo(x + 2, y - 12);
	ctx.stroke();

	// Sheriff star
	ctx.fillStyle = starColor;
	drawStar(x - 6, y - 5, 5, 6, 0.5);

	// Gun holster
	ctx.fillStyle = beltColor;
	ctx.fillRect(x + 8, y + 6, 6, 8);

	// Gun
	ctx.fillStyle = gunColor;
	ctx.fillRect(x + 10, y + 6, 3, 5);
}

// Function to draw a star shape
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
	let rot = (Math.PI / 2) * 3;
	let x = cx;
	let y = cy;
	let step = Math.PI / spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - outerRadius);

	for (let i = 0; i < spikes; i++) {
		x = cx + Math.cos(rot) * outerRadius;
		y = cy + Math.sin(rot) * outerRadius;
		ctx.lineTo(x, y);
		rot += step;

		x = cx + Math.cos(rot) * innerRadius;
		y = cy + Math.sin(rot) * innerRadius;
		ctx.lineTo(x, y);
		rot += step;
	}

	ctx.lineTo(cx, cy - outerRadius);
	ctx.closePath();
	ctx.fill();
}

// Draw each animation frame
// Idle animation (frames 0-3)
drawSheriffFrame(0, 0, 'idle1');
drawSheriffFrame(1, 0, 'idle2');
drawSheriffFrame(2, 0, 'idle3');
drawSheriffFrame(3, 0, 'idle4');

// Run animation (frames 4-11)
drawSheriffFrame(0, 1, 'run1');
drawSheriffFrame(1, 1, 'run2');
drawSheriffFrame(2, 1, 'run3');
drawSheriffFrame(3, 1, 'run4');
drawSheriffFrame(0, 2, 'run5');
drawSheriffFrame(1, 2, 'run6');
drawSheriffFrame(2, 2, 'run7');
drawSheriffFrame(3, 2, 'run8');

// Jump animation (frames 12-15)
drawSheriffFrame(0, 3, 'jump1');
drawSheriffFrame(1, 3, 'jump2');
drawSheriffFrame(2, 3, 'jump3');
drawSheriffFrame(3, 3, 'jump4');

// Save the sprite sheet
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'sheriff.png'), buffer);

console.log('Sheriff sprite sheet generated successfully!');
console.log('Saved to: assets/images/sheriff.png');
console.log('\nThe sprite sheet contains:');
console.log('- Frames 0-3: Idle animation');
console.log('- Frames 4-11: Running animation');
console.log('- Frames 12-15: Jumping animation');
console.log('\nEach frame is 64x64 pixels, arranged in a 4x4 grid (256x256 total).');
