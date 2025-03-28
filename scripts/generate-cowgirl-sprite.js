/**
 * Cowgirl Sprite Generator
 *
 * This script generates a cowgirl character sprite sheet with animations
 * for a space western game. The cowgirl has a distinctive skirt.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating cowgirl sprite sheet...');

// Sprite dimensions
const frameWidth = 64;
const frameHeight = 64;
const frames = 16; // 4x4 grid
const rows = 4;
const cols = 4;
const width = frameWidth * cols;
const height = frameHeight * rows;

// Create canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Clear canvas with transparency
ctx.clearRect(0, 0, width, height);

// Color palette
const colors = {
	skin: '#e6c6a5', // Lighter skin tone
	hair: '#8b4513', // Brown hair
	hatBrown: '#8b4513', // Brown hat
	hatBand: '#222222', // Black hat band
	shirt: '#cc6677', // Pink/red shirt
	skirt: '#6b3e26', // Brown skirt
	vest: '#aa6633', // Tan leather vest
	boots: '#663300', // Brown boots
	outline: '#000000', // Black outline
	gunBelt: '#553311', // Brown gun belt
	buckle: '#ccaa33', // Brass buckle
	shadow: 'rgba(0,0,0,0.2)' // Shadow
};

// Helper function to draw the cowgirl character
function drawCowgirl(frameX, frameY, poseType, frameNum) {
	const x = frameX * frameWidth + frameWidth / 2;
	const y = frameY * frameHeight + frameHeight - 8; // Adjusted from -10 to -8 to match sheriff height

	// Clear frame area
	ctx.clearRect(frameX * frameWidth, frameY * frameHeight, frameWidth, frameHeight);

	// Calculate animation offsets
	let bodyOffsetY = 0;
	let legOffset = 0;
	let armOffset = 0;
	let skirtOffset = 0;
	let hairOffset = 0;

	// Apply different animation offsets based on pose type and frame number
	switch (poseType) {
		case 'idle':
			// Slight bobbing up and down
			bodyOffsetY = Math.sin((frameNum * Math.PI) / 2) * 1;
			skirtOffset = Math.sin((frameNum * Math.PI) / 2) * 0.5;
			hairOffset = Math.sin((frameNum * Math.PI) / 2) * 0.5;
			break;

		case 'run':
			// Running animation with legs and arms moving
			legOffset = Math.sin((frameNum * Math.PI) / 2) * 4;
			armOffset = Math.cos((frameNum * Math.PI) / 2) * 3;
			bodyOffsetY = Math.abs(Math.sin((frameNum * Math.PI) / 2)) * -2;
			skirtOffset = Math.sin((frameNum * Math.PI) / 2) * 2;
			hairOffset = Math.sin((frameNum * Math.PI) / 2) * 1;
			break;

		case 'jump':
			// Jump animation (different frames = different jump phases)
			if (frameNum === 0) {
				// Crouch before jump
				bodyOffsetY = 2;
			} else if (frameNum === 1) {
				// Going up
				bodyOffsetY = -3;
				legOffset = 2;
			} else if (frameNum === 2) {
				// Apex of jump
				bodyOffsetY = -4;
				legOffset = 2;
			} else {
				// Coming down
				bodyOffsetY = -1;
				legOffset = 1;
			}
			break;
	}

	// Draw shadow
	ctx.fillStyle = colors.shadow;
	ctx.beginPath();
	ctx.ellipse(x, y + 4, 10, 3, 0, 0, Math.PI * 2);
	ctx.fill();

	// Draw boots
	ctx.fillStyle = colors.boots;

	// Left boot
	ctx.beginPath();
	ctx.roundRect(x - 8 - legOffset, y - 6, 6, 8, 2);
	ctx.fill();

	// Right boot
	ctx.beginPath();
	ctx.roundRect(x + 2 + legOffset, y - 6, 6, 8, 2);
	ctx.fill();

	// Draw skirt
	ctx.fillStyle = colors.skirt;
	ctx.beginPath();
	ctx.moveTo(x - 8, y - 18 + skirtOffset);
	ctx.lineTo(x - 8, y - 6);
	ctx.lineTo(x + 8, y - 6);
	ctx.lineTo(x + 8, y - 18 + skirtOffset);
	ctx.closePath();
	ctx.fill();

	// Draw belt
	ctx.fillStyle = colors.gunBelt;
	ctx.fillRect(x - 8, y - 18, 16, 2);

	// Belt buckle
	ctx.fillStyle = colors.buckle;
	ctx.beginPath();
	ctx.roundRect(x - 2, y - 18, 4, 2, 1);
	ctx.fill();

	// Draw shirt
	ctx.fillStyle = colors.shirt;
	// Torso
	ctx.beginPath();
	ctx.roundRect(x - 8, y - 30 + bodyOffsetY, 16, 12, 4);
	ctx.fill();

	// Draw vest over shirt
	ctx.fillStyle = colors.vest;
	ctx.beginPath();
	ctx.moveTo(x - 6, y - 30 + bodyOffsetY);
	ctx.lineTo(x - 6, y - 18 + bodyOffsetY);
	ctx.lineTo(x + 6, y - 18 + bodyOffsetY);
	ctx.lineTo(x + 6, y - 30 + bodyOffsetY);
	ctx.lineTo(x + 3, y - 30 + bodyOffsetY);
	ctx.lineTo(x + 3, y - 27 + bodyOffsetY);
	ctx.lineTo(x - 3, y - 27 + bodyOffsetY);
	ctx.lineTo(x - 3, y - 30 + bodyOffsetY);
	ctx.closePath();
	ctx.fill();

	// Left arm
	ctx.fillStyle = colors.shirt;
	ctx.beginPath();
	ctx.roundRect(x - 12 - armOffset, y - 28 + bodyOffsetY, 4, 12, 2);
	ctx.fill();

	// Right arm
	ctx.beginPath();
	ctx.roundRect(x + 8 + armOffset, y - 28 + bodyOffsetY, 4, 12, 2);
	ctx.fill();

	// Draw hand guns on each side
	if (poseType === 'idle' || poseType === 'run') {
		// Gun holster on belt
		ctx.fillStyle = colors.gunBelt;
		ctx.beginPath();
		ctx.roundRect(x - 12, y - 16, 4, 6, 1);
		ctx.fill();

		// Gun handle
		ctx.fillStyle = '#555555';
		ctx.beginPath();
		ctx.roundRect(x - 11, y - 16, 2, 3, 1);
		ctx.fill();
	}

	// Draw neck
	ctx.fillStyle = colors.skin;
	ctx.beginPath();
	ctx.roundRect(x - 2, y - 32 + bodyOffsetY, 4, 3, 1);
	ctx.fill();

	// Draw head
	ctx.fillStyle = colors.skin;
	ctx.beginPath();
	ctx.arc(x, y - 38 + bodyOffsetY, 6, 0, Math.PI * 2);
	ctx.fill();

	// Draw hair
	ctx.fillStyle = colors.hair;
	ctx.beginPath();
	ctx.moveTo(x - 6, y - 44 + bodyOffsetY + hairOffset);
	ctx.lineTo(x - 6, y - 38 + bodyOffsetY + hairOffset);
	ctx.lineTo(x + 6, y - 38 + bodyOffsetY + hairOffset);
	ctx.lineTo(x + 6, y - 44 + bodyOffsetY + hairOffset);
	ctx.closePath();
	ctx.fill();

	// Draw hat
	ctx.fillStyle = colors.hatBrown;
	// Hat brim
	ctx.beginPath();
	ctx.ellipse(x, y - 40 + bodyOffsetY, 10, 2, 0, 0, Math.PI * 2);
	ctx.fill();

	// Hat top (slightly angled)
	ctx.beginPath();
	ctx.moveTo(x - 5, y - 46 + bodyOffsetY);
	ctx.lineTo(x - 4, y - 50 + bodyOffsetY);
	ctx.lineTo(x + 4, y - 50 + bodyOffsetY);
	ctx.lineTo(x + 5, y - 46 + bodyOffsetY);
	ctx.closePath();
	ctx.fill();

	// Hat band
	ctx.fillStyle = colors.hatBand;
	ctx.beginPath();
	ctx.rect(x - 5, y - 44 + bodyOffsetY, 10, 1);
	ctx.fill();

	// Hat shape refinements
	ctx.fillStyle = colors.hatBrown;
	ctx.beginPath();
	ctx.roundRect(x - 6, y - 46 + bodyOffsetY, 12, 3, 1);
	ctx.fill();

	// Draw face features
	ctx.fillStyle = colors.outline;

	// Eyes
	ctx.beginPath();
	ctx.arc(x - 2, y - 39 + bodyOffsetY, 0.5, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x + 2, y - 39 + bodyOffsetY, 0.5, 0, Math.PI * 2);
	ctx.fill();

	// Mouth (stern expression)
	ctx.beginPath();
	ctx.moveTo(x - 2, y - 35 + bodyOffsetY);
	ctx.lineTo(x + 2, y - 35 + bodyOffsetY);
	ctx.stroke();
}

// Draw idle animation frames (top row)
for (let i = 0; i < 4; i++) {
	drawCowgirl(i, 0, 'idle', i);
}

// Draw running animation frames (second row)
for (let i = 0; i < 8; i++) {
	drawCowgirl(i % 4, 1 + Math.floor(i / 4), 'run', i);
}

// Draw jumping animation frames (bottom row)
for (let i = 0; i < 4; i++) {
	drawCowgirl(i, 3, 'jump', i);
}

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'cowgirl.png'), buffer);

console.log('Cowgirl sprite sheet generated successfully!');
console.log('Saved to: assets/images/cowgirl.png');
console.log('\nThe sprite sheet contains:');
console.log('- Frames 0-3: Idle animation');
console.log('- Frames 4-11: Running animation');
console.log('- Frames 12-15: Jumping animation');
console.log('\nEach frame is 64x64 pixels, arranged in a 4x4 grid (256x256 total).');
