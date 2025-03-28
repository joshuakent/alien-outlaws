/**
 * Script to generate placeholder assets for development
 * Run with: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Ensure directories exist
const directories = ['assets/images', 'assets/audio', 'assets/tilemaps'];

directories.forEach((dir) => {
	try {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
			console.log(`Created directory: ${dir}`);
		}
	} catch (err) {
		console.error(`Error creating directory ${dir}:`, err);
	}
});

// Create a simple blank canvas data URL for various placeholder images
function createPlaceholderDataURL(width, height, color) {
	return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==`;
}

// Generate placeholder image
function generatePlaceholderImage(filename, width, height, color) {
	try {
		const dir = path.dirname(filename);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		// This is just a placeholder implementation
		// In a real implementation, we would generate actual PNGs
		// Here we're just creating empty files
		fs.writeFileSync(filename, '');
		console.log(`Created placeholder image: ${filename}`);
	} catch (err) {
		console.error(`Error creating placeholder image ${filename}:`, err);
	}
}

// Generate placeholder audio
function generatePlaceholderAudio(filename) {
	try {
		const dir = path.dirname(filename);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		// This is just a placeholder implementation
		// In a real implementation, we would generate actual MP3 files
		// Here we're just creating empty files
		fs.writeFileSync(filename, '');
		console.log(`Created placeholder audio: ${filename} (WARNING: Empty audio file will cause decodeAudioData errors)`);
	} catch (err) {
		console.error(`Error creating placeholder audio ${filename}:`, err);
	}
}

// Generate placeholder tilemap
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

console.log('Generating placeholder assets...');

// Generate all placeholder assets
let imagesCreated = 0;
placeholderImages.forEach((img) => {
	generatePlaceholderImage(img.name, img.width, img.height, img.color);
	imagesCreated++;
});

let audioCreated = 0;
placeholderAudio.forEach((audio) => {
	generatePlaceholderAudio(audio);
	audioCreated++;
});

let tilemapsCreated = 0;
placeholderTilemaps.forEach((tilemap) => {
	generatePlaceholderTilemap(tilemap);
	tilemapsCreated++;
});

console.log(
	`\nPlaceholder assets generated: ${imagesCreated} images, ${audioCreated} audio files, ${tilemapsCreated} tilemaps`
);
console.log('Note: These are empty files for development purposes only.');
console.log('AUDIO WARNING: The empty audio files will cause decodeAudioData errors in the browser.');
console.log('To fix audio errors, you need to replace the placeholders with actual MP3 files.');
console.log('Replace with real assets before production use.');
