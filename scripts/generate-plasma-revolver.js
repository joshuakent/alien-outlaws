/**
 * Plasma Revolver Sprite Generator
 *
 * This script generates a futuristic plasma-revolver sprite for the game.
 * The sprite sheet contains 4 frames for animation.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating plasma revolver sprite...');

// Define sprite dimensions
const frameWidth = 32;
const frameHeight = 16;
const frameCount = 4;
const width = frameWidth;
const height = frameHeight * frameCount;

// Create canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Color palette
const colors = {
	energyCore: '#ff00ff', // Bright magenta
	energyGlow: '#ff80ff', // Light magenta
	barrelMetal: '#81858a', // Gunmetal
	darkMetal: '#3A3F42', // Dark metal for handle and details
	highlight: '#ffffff', // White for highlights
	energyPulse: '#cc00ff' // Darker magenta for energy pulse
};

// Function to draw a single frame of the plasma revolver
function drawPlasmaRevolverFrame(frameY, pulsePosition) {
	// Clear frame space
	ctx.clearRect(0, frameY, frameWidth, frameHeight);

	// Draw handle/grip
	ctx.fillStyle = colors.darkMetal;
	ctx.beginPath();
	ctx.roundRect(1, frameY + frameHeight - 10, 8, 8, 2);
	ctx.fill();

	// Draw revolver body
	ctx.fillStyle = colors.barrelMetal;
	ctx.beginPath();
	ctx.roundRect(8, frameY + frameHeight / 2 - 4, 16, 8, 3);
	ctx.fill();

	// Draw barrel
	ctx.fillStyle = colors.barrelMetal;
	ctx.beginPath();
	ctx.roundRect(20, frameY + frameHeight / 2 - 2, 10, 4, 1);
	ctx.fill();

	// Draw energy core
	ctx.fillStyle = colors.energyCore;
	ctx.beginPath();
	ctx.arc(14, frameY + frameHeight / 2, 3, 0, Math.PI * 2);
	ctx.fill();

	// Draw energy pulse in the barrel (varies by frame)
	ctx.fillStyle = colors.energyPulse;
	ctx.beginPath();
	ctx.arc(20 + pulsePosition, frameY + frameHeight / 2, 2, 0, Math.PI * 2);
	ctx.fill();

	// Add glow around energy core
	const glowGradient = ctx.createRadialGradient(14, frameY + frameHeight / 2, 1, 14, frameY + frameHeight / 2, 6);
	glowGradient.addColorStop(0, 'rgba(255, 0, 255, 0.7)');
	glowGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
	ctx.fillStyle = glowGradient;
	ctx.beginPath();
	ctx.arc(14, frameY + frameHeight / 2, 6, 0, Math.PI * 2);
	ctx.fill();

	// Add highlight to barrel
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.fillRect(10, frameY + frameHeight / 2 - 3, 12, 1);

	// Add small detail lines
	ctx.strokeStyle = colors.darkMetal;
	ctx.lineWidth = 1;

	// Detail on barrel
	ctx.beginPath();
	ctx.moveTo(22, frameY + frameHeight / 2 - 2);
	ctx.lineTo(22, frameY + frameHeight / 2 + 2);
	ctx.stroke();

	// Add highlight reflection
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.beginPath();
	ctx.arc(26, frameY + frameHeight / 2 - 1, 1, 0, Math.PI * 2);
	ctx.fill();
}

// Generate each frame with variations
// Frame 1: Energy pulse near the core
drawPlasmaRevolverFrame(0, 2);

// Frame 2: Energy pulse moving through barrel
drawPlasmaRevolverFrame(frameHeight, 4);

// Frame 3: Energy pulse near the end of barrel
drawPlasmaRevolverFrame(frameHeight * 2, 6);

// Frame 4: Energy pulse at barrel end (firing)
drawPlasmaRevolverFrame(frameHeight * 3, 8);

// Add glow to final frame to show firing effect
const glowGradient = ctx.createRadialGradient(
	30,
	frameHeight * 3 + frameHeight / 2,
	1,
	30,
	frameHeight * 3 + frameHeight / 2,
	5
);
glowGradient.addColorStop(0, 'rgba(255, 0, 255, 0.9)');
glowGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
ctx.fillStyle = glowGradient;
ctx.beginPath();
ctx.arc(30, frameHeight * 3 + frameHeight / 2, 5, 0, Math.PI * 2);
ctx.fill();

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(imagesDir, 'plasma-revolver.png'), buffer);

console.log('Plasma revolver sprite generated successfully!');
console.log(`Saved to: assets/images/plasma-revolver.png`);
console.log(`Dimensions: ${width}x${height} pixels (${frameCount} frames of ${frameWidth}x${frameHeight})`);
console.log('Frame 1-4: Firing animation showing energy pulse moving through the barrel');
