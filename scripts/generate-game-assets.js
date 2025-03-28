/**
 * Additional Game Assets Generator
 *
 * This script generates various game assets including:
 * - ammo-indicator
 * - bg-far (background far layer)
 * - bg-mid (background middle layer)
 * - ground
 * - health-bar
 * - lasso
 * - loading-bar
 * - logo
 *
 * It requires the 'canvas' and 'fs-extra' packages.
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
fs.ensureDirSync(imagesDir);

console.log('Generating additional game assets...');

// Color palette for western sci-fi theme
const colors = {
	// Earth tones
	sand: '#e0c088',
	darkSand: '#c4a76d',
	ground: '#8b4513',
	rock: '#7a6c5d',
	clay: '#b35a1f',

	// Sky colors
	skyBlue: '#87ceeb',
	deepBlue: '#4169e1',
	sunset: '#ff7e5f',
	sunsetGlow: '#feb47b',

	// Tech/UI colors
	metal: '#71797E',
	energy: '#00ccff',
	warning: '#ff3300',
	success: '#44ff00',
	highlight: '#ffcc00',

	// Space colors
	spaceBlue: '#000033',
	starWhite: '#ffffff',
	nebulaPurple: '#6a0dad',
	alienGreen: '#39ff14'
};

// ------------- AMMO INDICATOR -------------
function generateAmmoIndicator() {
	console.log('Generating ammo indicator...');

	const width = 128;
	const height = 48;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create transparent background
	ctx.clearRect(0, 0, width, height);

	// Draw ammo container
	ctx.fillStyle = colors.metal;
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;

	// Main container
	ctx.beginPath();
	ctx.roundRect(10, 8, width - 20, height - 16, 8);
	ctx.fill();
	ctx.stroke();

	// Draw tech details
	ctx.fillStyle = '#222222';
	ctx.fillRect(16, 14, width - 32, height - 28);

	// Draw 6 ammo indicators
	for (let i = 0; i < 6; i++) {
		const x = 22 + i * 16;

		// Ammo slot
		ctx.fillStyle = '#000000';
		ctx.fillRect(x, 18, 10, 20);

		// Ammo bullet
		ctx.fillStyle = colors.energy;
		ctx.beginPath();
		ctx.roundRect(x + 2, 20, 6, 16, 2);
		ctx.fill();

		// Bullet shine
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(x + 4, 22, 2, 4);
	}

	// Draw labels/text
	ctx.fillStyle = '#ffffff';
	ctx.font = '10px Arial';
	ctx.fillText('AMMO', width - 50, height - 10);

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'ammo-indicator.png'), buffer);
	console.log('Ammo indicator saved to: assets/images/ammo-indicator.png');
}

// ------------- BACKGROUND FAR -------------
function generateBackgroundFar() {
	console.log('Generating far background...');

	const width = 800;
	const height = 600;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create space background with gradient
	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, colors.spaceBlue);
	gradient.addColorStop(1, colors.sunset);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Draw distant mountains
	ctx.fillStyle = '#221122';

	// First mountain range (furthest)
	const mountainPoints = [];
	mountainPoints.push([0, height]);

	for (let x = 0; x < width; x += width / 10) {
		const mountainHeight = Math.random() * 100 + 100;
		mountainPoints.push([x, height - mountainHeight]);
	}
	mountainPoints.push([width, height - 80]);
	mountainPoints.push([width, height]);

	ctx.beginPath();
	ctx.moveTo(mountainPoints[0][0], mountainPoints[0][1]);
	for (let i = 1; i < mountainPoints.length; i++) {
		ctx.lineTo(mountainPoints[i][0], mountainPoints[i][1]);
	}
	ctx.closePath();
	ctx.fill();

	// Add stars
	ctx.fillStyle = colors.starWhite;
	for (let i = 0; i < 200; i++) {
		const x = Math.random() * width;
		const y = Math.random() * height * 0.7;
		const size = Math.random() * 2;

		ctx.globalAlpha = Math.random() * 0.8 + 0.2;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	// Add a few larger stars
	ctx.globalAlpha = 1;
	for (let i = 0; i < 20; i++) {
		const x = Math.random() * width;
		const y = Math.random() * height * 0.5;
		const size = Math.random() * 3 + 1;

		// Star glow
		const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
		glow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
		glow.addColorStop(1, 'rgba(255, 255, 255, 0)');

		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(x, y, size * 4, 0, Math.PI * 2);
		ctx.fill();

		// Star center
		ctx.fillStyle = colors.starWhite;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	// Add a distant planet
	const planetX = width * 0.8;
	const planetY = height * 0.2;
	const planetSize = 50;

	// Planet glow
	const planetGlow = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, planetSize * 1.5);
	planetGlow.addColorStop(0, 'rgba(255, 150, 50, 0.2)');
	planetGlow.addColorStop(1, 'rgba(255, 150, 50, 0)');

	ctx.fillStyle = planetGlow;
	ctx.beginPath();
	ctx.arc(planetX, planetY, planetSize * 1.5, 0, Math.PI * 2);
	ctx.fill();

	// Planet body
	const planetGradient = ctx.createLinearGradient(
		planetX - planetSize,
		planetY - planetSize,
		planetX + planetSize,
		planetY + planetSize
	);
	planetGradient.addColorStop(0, '#ff6a00');
	planetGradient.addColorStop(1, '#ff0055');

	ctx.fillStyle = planetGradient;
	ctx.beginPath();
	ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2);
	ctx.fill();

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'bg-far.png'), buffer);
	console.log('Far background saved to: assets/images/bg-far.png');
}

// ------------- BACKGROUND MID -------------
function generateBackgroundMid() {
	console.log('Generating mid background...');

	const width = 800;
	const height = 600;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create transparent background
	ctx.clearRect(0, 0, width, height);

	// Draw mesas/plateaus with western style
	const numPlateaus = 5;

	for (let i = 0; i < numPlateaus; i++) {
		const x = i * (width / numPlateaus) - Math.random() * 50;
		const plateauWidth = Math.random() * 200 + 150;
		const plateauHeight = Math.random() * 180 + 100;
		const y = height - plateauHeight;

		// Mesa body gradient
		const mesaGradient = ctx.createLinearGradient(x, y, x, height);
		mesaGradient.addColorStop(0, colors.clay);
		mesaGradient.addColorStop(0.7, colors.darkSand);
		mesaGradient.addColorStop(1, colors.sand);

		ctx.fillStyle = mesaGradient;

		// Draw mesa shape
		ctx.beginPath();

		// Start at bottom left
		ctx.moveTo(x, height);

		// Go up left side with some variation
		ctx.lineTo(x, y + 20);
		ctx.lineTo(x + 10, y);

		// Top plateau with some variations
		ctx.lineTo(x + plateauWidth - 10, y);
		ctx.lineTo(x + plateauWidth, y + 20);

		// Down right side
		ctx.lineTo(x + plateauWidth, height);

		ctx.closePath();
		ctx.fill();

		// Add erosion lines
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		ctx.lineWidth = 1;

		for (let j = 0; j < 8; j++) {
			const erosionX = x + Math.random() * plateauWidth;
			const startY = y + 20 + Math.random() * 30;
			const endY = startY + Math.random() * 100 + 50;

			ctx.beginPath();
			ctx.moveTo(erosionX, startY);
			ctx.lineTo(erosionX + Math.random() * 10 - 5, endY);
			ctx.stroke();
		}
	}

	// Add some floating objects (alien tech)
	for (let i = 0; i < 3; i++) {
		const x = Math.random() * width;
		const y = Math.random() * height * 0.4 + 50;
		const size = Math.random() * 40 + 20;

		// Floating structure
		ctx.fillStyle = colors.metal;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + size, y);
		ctx.lineTo(x + size * 0.8, y + size * 0.4);
		ctx.lineTo(x - size * 0.2, y + size * 0.4);
		ctx.closePath();
		ctx.fill();

		// Structure details
		ctx.fillStyle = colors.energy;
		ctx.beginPath();
		ctx.arc(x + size * 0.3, y + size * 0.2, size * 0.1, 0, Math.PI * 2);
		ctx.fill();

		// Glow effect
		const glowGradient = ctx.createRadialGradient(
			x + size * 0.3,
			y + size * 0.2,
			0,
			x + size * 0.3,
			y + size * 0.2,
			size * 0.3
		);
		glowGradient.addColorStop(0, 'rgba(0, 204, 255, 0.5)');
		glowGradient.addColorStop(1, 'rgba(0, 204, 255, 0)');

		ctx.fillStyle = glowGradient;
		ctx.beginPath();
		ctx.arc(x + size * 0.3, y + size * 0.2, size * 0.3, 0, Math.PI * 2);
		ctx.fill();
	}

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'bg-mid.png'), buffer);
	console.log('Mid background saved to: assets/images/bg-mid.png');
}

// ------------- GROUND -------------
function generateGround() {
	console.log('Generating ground...');

	const width = 800;
	const height = 128;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create ground base with gradient
	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, colors.sand);
	gradient.addColorStop(0.3, colors.darkSand);
	gradient.addColorStop(1, colors.ground);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Add a top layer of lighter sand
	ctx.fillStyle = colors.sand;
	ctx.fillRect(0, 0, width, 20);

	// Add noise texture
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	for (let i = 0; i < 500; i++) {
		const x = Math.random() * width;
		const y = Math.random() * height;
		const size = Math.random() * 3 + 1;

		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	// Add some rocks
	for (let i = 0; i < 20; i++) {
		const x = Math.random() * width;
		const y = 15 + Math.random() * (height - 30);
		const size = Math.random() * 10 + 5;

		ctx.fillStyle = colors.rock;
		ctx.beginPath();

		// Irregular rock shape
		ctx.moveTo(x, y);
		for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
			const length = size + Math.random() * (size / 2);
			const ptX = x + Math.cos(angle) * length;
			const ptY = y + Math.sin(angle) * length;
			ctx.lineTo(ptX, ptY);
		}

		ctx.closePath();
		ctx.fill();

		// Rock highlight
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.beginPath();
		ctx.arc(x - size / 4, y - size / 4, size / 3, 0, Math.PI * 2);
		ctx.fill();
	}

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'ground.png'), buffer);
	console.log('Ground saved to: assets/images/ground.png');
}

// ------------- HEALTH BAR -------------
function generateHealthBar() {
	console.log('Generating health bar...');

	const width = 160;
	const height = 40;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create solid background (no transparency)
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, width, height);

	// Draw health bar container (border)
	ctx.fillStyle = '#000000';
	ctx.fillRect(10, 8, width - 20, height - 16);

	// Draw health bar background (dark gray)
	ctx.fillStyle = '#333333';
	ctx.fillRect(12, 10, width - 24, height - 20);

	// Draw health bar foreground (solid red)
	ctx.fillStyle = '#ff0000';
	ctx.fillRect(12, 10, (width - 24) * 0.75, height - 20);

	// Add heart icon
	ctx.fillStyle = '#ffffff';
	const heartX = 20;
	const heartY = height / 2;
	const heartSize = 10;

	ctx.beginPath();
	ctx.moveTo(heartX, heartY);
	ctx.bezierCurveTo(
		heartX - heartSize / 2,
		heartY - heartSize / 2,
		heartX - heartSize,
		heartY,
		heartX,
		heartY + heartSize
	);
	ctx.bezierCurveTo(heartX + heartSize, heartY, heartX + heartSize / 2, heartY - heartSize / 2, heartX, heartY);
	ctx.fill();

	// Save the image with no transparency
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'health-bar.png'), buffer);
	console.log('Health bar saved to: assets/images/health-bar.png');
}

// ------------- LASSO -------------
function generateLasso() {
	console.log('Generating lasso weapon...');

	const width = 64;
	const height = 64;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create transparent background
	ctx.clearRect(0, 0, width, height);

	// Draw lasso
	const centerX = width / 2;
	const centerY = height / 2;
	const radius = 20;

	// Rope color
	ctx.strokeStyle = '#8B4513';
	ctx.lineWidth = 3;

	// Draw main lasso loop
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
	ctx.stroke();

	// Draw energy effect (alien tech)
	ctx.strokeStyle = colors.energy;
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
	ctx.stroke();

	// Draw lasso handle
	ctx.fillStyle = '#8B4513';
	ctx.beginPath();
	ctx.moveTo(centerX - 2, centerY + radius);
	ctx.lineTo(centerX - 2, centerY + radius + 10);
	ctx.lineTo(centerX + 2, centerY + radius + 10);
	ctx.lineTo(centerX + 2, centerY + radius);
	ctx.closePath();
	ctx.fill();

	// Draw inner loops to show rope texture
	ctx.strokeStyle = '#8B4513';
	ctx.lineWidth = 1;

	for (let i = 1; i <= 3; i++) {
		const innerRadius = radius * (0.9 - i * 0.15);
		const offset = i * 3;

		ctx.beginPath();
		ctx.arc(centerX + offset, centerY, innerRadius, 0, Math.PI * 2);
		ctx.stroke();
	}

	// Draw energy glow
	const glowGradient = ctx.createRadialGradient(centerX, centerY, radius - 5, centerX, centerY, radius + 10);
	glowGradient.addColorStop(0, 'rgba(0, 204, 255, 0.4)');
	glowGradient.addColorStop(1, 'rgba(0, 204, 255, 0)');

	ctx.fillStyle = glowGradient;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
	ctx.fill();

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'lasso.png'), buffer);
	console.log('Lasso weapon saved to: assets/images/lasso.png');
}

// ------------- LOADING BAR -------------
function generateLoadingBar() {
	console.log('Generating loading bar...');

	const width = 300;
	const height = 40;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create transparent background
	ctx.clearRect(0, 0, width, height);

	// Draw loading bar container
	ctx.fillStyle = colors.metal;
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;

	// Main container
	ctx.beginPath();
	ctx.roundRect(10, 8, width - 20, height - 16, 6);
	ctx.fill();
	ctx.stroke();

	// Loading bar background
	ctx.fillStyle = '#222222';
	ctx.fillRect(15, 13, width - 30, height - 26);

	// Loading bar
	const barGradient = ctx.createLinearGradient(15, 0, width - 30, 0);
	barGradient.addColorStop(0, colors.energy);
	barGradient.addColorStop(1, colors.highlight);

	ctx.fillStyle = barGradient;
	ctx.fillRect(15, 13, (width - 30) * 0.6, height - 26);

	// Loading bar segments
	ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
	for (let i = 0; i < 15; i++) {
		const x = 15 + i * ((width - 30) / 15);
		ctx.fillRect(x, 13, 1, height - 26);
	}

	// Add "LOADING" text
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 14px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('LOADING', width / 2, height / 2 + 5);

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'loading-bar.png'), buffer);
	console.log('Loading bar saved to: assets/images/loading-bar.png');
}

// ------------- LOGO -------------
function generateLogo() {
	console.log('Generating game logo...');

	const width = 512;
	const height = 128;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create transparent background
	ctx.clearRect(0, 0, width, height);

	// Create radial gradient for background glow
	const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
	bgGradient.addColorStop(0, 'rgba(255, 125, 0, 0.2)');
	bgGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

	ctx.fillStyle = bgGradient;
	ctx.fillRect(0, 0, width, height);

	// Draw logo text
	const logoGradient = ctx.createLinearGradient(0, 0, width, height);
	logoGradient.addColorStop(0, '#ff6a00');
	logoGradient.addColorStop(0.5, '#ffcc00');
	logoGradient.addColorStop(1, '#ff6a00');

	ctx.fillStyle = logoGradient;
	ctx.font = 'bold 60px Georgia, serif';
	ctx.textAlign = 'center';
	ctx.fillText('ALIEN OUTLAWS', width / 2, height / 2);

	// Add subtitle
	ctx.fillStyle = '#ffffff';
	ctx.font = 'italic 24px Georgia, serif';
	ctx.fillText('THE COSMIC STAMPEDE', width / 2, height / 2 + 30);

	// Draw metal frame around text
	ctx.strokeStyle = colors.metal;
	ctx.lineWidth = 4;
	ctx.strokeRect(20, 20, width - 40, height - 40);

	// Add some stars in background
	ctx.fillStyle = colors.starWhite;
	for (let i = 0; i < 20; i++) {
		const x = Math.random() * width;
		const y = Math.random() * height;
		const size = Math.random() * 2 + 1;

		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	// Add tech accent
	ctx.fillStyle = colors.energy;
	ctx.beginPath();
	ctx.moveTo(30, 20);
	ctx.lineTo(50, 20);
	ctx.lineTo(40, 30);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(width - 30, 20);
	ctx.lineTo(width - 50, 20);
	ctx.lineTo(width - 40, 30);
	ctx.closePath();
	ctx.fill();

	// Save the image
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(path.join(imagesDir, 'logo.png'), buffer);
	console.log('Game logo saved to: assets/images/logo.png');
}

// Generate all assets
generateAmmoIndicator();
generateBackgroundFar();
generateBackgroundMid();
generateGround();
generateHealthBar();
generateLasso();
generateLoadingBar();
generateLogo();

console.log('\nAll additional game assets generated successfully!');
