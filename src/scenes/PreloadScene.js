import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
	constructor() {
		super('PreloadScene');
		this.validAnimations = new Set(); // Track which animations were successfully created
	}

	preload() {
		// Create loading bar
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Display logo
		const logo = this.add.image(width / 2, height / 2 - 100, 'logo');
		logo.setScale(0.5);

		// Progress bar background
		const progressBarBg = this.add.rectangle(width / 2, height / 2 + 50, 400, 30, 0x222222);

		// Progress bar
		const progressBar = this.add.rectangle(width / 2 - 200, height / 2 + 50, 0, 30, 0x00ff00);
		progressBar.setOrigin(0, 0.5);

		// Loading text
		const loadingText = this.add
			.text(width / 2, height / 2 + 100, 'Loading...', {
				fontSize: '24px',
				fill: '#ffffff'
			})
			.setOrigin(0.5);

		// Update progress bar as assets load
		this.load.on('progress', (value) => {
			progressBar.width = 400 * value;
		});

		// When loading is complete
		this.load.on('complete', () => {
			progressBar.destroy();
			progressBarBg.destroy();
			loadingText.destroy();
		});

		// Check for loading errors and create placeholders if needed
		this.load.on('loaderror', (fileObj) => {
			console.warn(`Error loading asset: ${fileObj.key} (${fileObj.url})`);
		});

		// Load game assets
		this.loadAssets();
	}

	// Generate basic colored sprite sheet to use as placeholder
	createPlaceholderSprite(key, frameWidth, frameHeight, color = 0xff0000, frames = 4) {
		console.log(`Creating placeholder sprite for: ${key} (${frameWidth}x${frameHeight})`);

		// Create a texture with the specified dimensions
		const graphics = this.add.graphics();
		graphics.fillStyle(color, 1);

		// Create a texture based on the graphics object
		const texture = this.textures.createCanvas(key, frameWidth * frames, frameHeight);
		const context = texture.getContext();

		// Fill with different colors for each frame
		for (let i = 0; i < frames; i++) {
			context.fillStyle = Phaser.Display.Color.HSVColorWheel()[i * 60].rgba;
			context.fillRect(i * frameWidth, 0, frameWidth, frameHeight);

			// Add frame number
			context.fillStyle = '#ffffff';
			context.font = '10px Arial';
			context.fillText(`${i + 1}`, i * frameWidth + 4, 12);
		}

		// Update the texture
		texture.refresh();

		// Clean up
		graphics.destroy();

		// Return the number of frames created
		return frames;
	}

	loadAssets() {
		// Create placeholder sprite sheet generator function
		const createSpritePlaceholder = (key, width, height, frames = 4) => {
			this.load.once('filecomplete-spritesheet-' + key, (key, type, data) => {
				// Check if the loaded texture has a valid size
				const texture = this.textures.get(key);
				if (texture && texture.source[0].width <= 1 && texture.source[0].height <= 1) {
					console.log(`Empty placeholder detected for ${key}, creating fallback texture`);
					// Create a better placeholder
					this.createPlaceholderSprite(key, width, height, 0xff0000, frames);
				}
			});
		};

		// Player characters
		this.load.spritesheet('sheriff', 'assets/images/sheriff.png', { frameWidth: 64, frameHeight: 64 });
		createSpritePlaceholder('sheriff', 64, 64, 16);

		this.load.spritesheet('cowboy', 'assets/images/cowboy.png', { frameWidth: 64, frameHeight: 64 });
		createSpritePlaceholder('cowboy', 64, 64, 16);

		this.load.spritesheet('cowgirl', 'assets/images/cowgirl.png', { frameWidth: 64, frameHeight: 64 });
		createSpritePlaceholder('cowgirl', 64, 64, 16);

		// Weapons
		this.load.spritesheet('plasma-revolver', 'assets/images/plasma-revolver.png', { frameWidth: 32, frameHeight: 16 });
		createSpritePlaceholder('plasma-revolver', 32, 16, 4);

		this.load.spritesheet('lasso', 'assets/images/lasso.png', { frameWidth: 48, frameHeight: 48 });
		createSpritePlaceholder('lasso', 48, 48, 4);

		// Enemies
		this.load.spritesheet('alien-rustler', 'assets/images/alien-rustler.png', { frameWidth: 64, frameHeight: 64 });
		createSpritePlaceholder('alien-rustler', 64, 64, 8);

		this.load.spritesheet('hovering-drone', 'assets/images/hovering-drone.png', { frameWidth: 48, frameHeight: 48 });
		createSpritePlaceholder('hovering-drone', 48, 48, 4);

		// Platforms and terrain
		this.load.image('ground', 'assets/images/ground.png');
		this.load.image('platform', 'assets/images/platform.png');

		// Portal
		this.load.spritesheet('portal', 'assets/images/portal.png', { frameWidth: 64, frameHeight: 64 });
		createSpritePlaceholder('portal', 64, 64, 8);

		// Background elements
		this.load.image('bg-far', 'assets/images/bg-far.png');
		this.load.image('bg-mid', 'assets/images/bg-mid.png');

		// UI elements
		this.load.image('health-bar', 'assets/images/health-bar.png');
		this.load.image('ammo-indicator', 'assets/images/ammo-indicator.png');

		// Audio assets - with improved error handling
		try {
			// Add specific error handling for each audio file
			this.load.audio('alien-outlaw', 'assets/audio/alien-outlaw.mp3');
			this.load.audio('where-my-aliens-at', 'assets/audio/where-my-aliens-at.mp3');
			this.load.audio('no-aliens', 'assets/audio/no-aliens.mp3');
			this.load.audio('laser-shot', 'assets/audio/laser-shot.mp3');
			this.load.audio('jump', 'assets/audio/jump.mp3');

			console.log('Audio files queued for loading');

			// Add specific listeners for audio decoding errors
			this.load.on('loaderror', (fileObj) => {
				if (fileObj.type === 'audio') {
					console.error(`Error loading audio file: ${fileObj.key}`, fileObj);
					// Create a registry entry to track failed audio files
					const failedAudio = this.registry.get('failedAudio') || [];
					failedAudio.push(fileObj.key);
					this.registry.set('failedAudio', failedAudio);
				}
			});

			// Listen for the complete event to check which audio files loaded successfully
			this.load.once('complete', () => {
				// Check if each audio file loaded successfully
				const audioFiles = ['alien-outlaw', 'where-my-aliens-at', 'no-aliens', 'laser-shot', 'jump'];
				audioFiles.forEach((key) => {
					if (this.cache.audio.exists(key)) {
						console.log(`✓ Audio file loaded successfully: ${key}`);
					} else {
						console.warn(`✗ Audio file failed to load: ${key}`);
					}
				});

				// If we're having issues with MP3s, we could try to use a different format
				console.log("If MP3 files aren't working, try converting them to OGG or WAV format");
			});
		} catch (error) {
			console.error('Error setting up audio loading:', error);
		}

		// Level tilemaps
		this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');
		this.load.image('tileset', 'assets/images/tileset.png');

		// Create a basic placeholder for any missing single images (non-spritesheets)
		this.load.on('filecomplete', (key, type) => {
			if (type === 'image') {
				const texture = this.textures.get(key);
				if (texture && texture.source[0].width <= 1 && texture.source[0].height <= 1) {
					console.log(`Empty placeholder detected for image ${key}, creating fallback texture`);

					// Create a colored placeholder based on the key name
					const color = this.getColorForKey(key);
					const graphics = this.add.graphics();
					graphics.fillStyle(color, 1);

					// Create appropriate sizes based on key
					let width = 64,
						height = 64;
					if (key.includes('ground')) {
						width = 400;
						height = 32;
					} else if (key.includes('platform')) {
						width = 200;
						height = 32;
					} else if (key.includes('bg-')) {
						width = 800;
						height = 600;
					} else if (key.includes('bar')) {
						width = 100;
						height = 20;
					}

					// Create the texture
					const newTexture = this.textures.createCanvas(key, width, height);
					const context = newTexture.getContext();
					context.fillStyle = Phaser.Display.Color.IntegerToColor(color).rgba;
					context.fillRect(0, 0, width, height);
					context.fillStyle = '#ffffff';
					context.font = '14px Arial';
					context.fillText(key, 10, height / 2);
					newTexture.refresh();
					graphics.destroy();
				}
			}
		});
	}

	// Generate a color based on the key name
	getColorForKey(key) {
		// Create a simple hash from the key string
		let hash = 0;
		for (let i = 0; i < key.length; i++) {
			hash = key.charCodeAt(i) + ((hash << 5) - hash);
		}

		// Generate different colors for different types of assets
		if (key.includes('ground') || key.includes('platform')) {
			return 0x8b4513; // Brown for ground/platforms
		} else if (key.includes('bg-')) {
			return 0x4169e1; // Royal blue for backgrounds
		} else if (key.includes('health')) {
			return 0xff0000; // Red for health
		} else if (key.includes('ammo')) {
			return 0xffd700; // Gold for ammo
		} else if (key.includes('tileset')) {
			return 0x808080; // Gray for tilesets
		}

		// For other keys, use the hash to generate a color
		return ((hash & 0xffffff) + 0x500000) % 0xffffff;
	}

	// Helper method to check if a file exists and has content - no longer used for audio
	checkFileSize(url) {
		// In browser environment, we can't check file size directly
		// Always return a positive value to force loading
		return 200;
	}

	// Helper method to safely create animations
	createSafeAnimation(key, spriteKey, frameConfig, frameRate, repeat) {
		try {
			// First check if the texture exists
			const texture = this.textures.get(spriteKey);

			if (!texture) {
				console.warn(`Cannot create animation '${key}': texture '${spriteKey}' not found`);
				return false;
			}

			// Ensure we have a valid frameset
			const frameCount = texture.frameTotal;
			console.log(`Texture '${spriteKey}' has ${frameCount} frames available`);

			const startFrame = frameConfig.start || 0;
			const endFrame = frameConfig.end || 0;

			// Check if we have enough frames for the animation
			if (frameCount <= 1 || frameCount <= endFrame) {
				console.warn(
					`Cannot create animation '${key}': texture '${spriteKey}' has only ${frameCount} frames, but animation requires frames ${startFrame} to ${endFrame}`
				);

				// Create with just the first frame instead
				if (frameCount > 0) {
					// Make sure the texture actually has this frame
					if (texture.has(0)) {
						try {
							this.anims.create({
								key: key,
								frames: [{ key: spriteKey, frame: 0 }],
								frameRate: frameRate,
								repeat: repeat
							});
							this.validAnimations.add(key);
							console.log(`Created single-frame animation '${key}' as fallback`);
							return true;
						} catch (error) {
							console.warn(`Error creating single-frame animation '${key}':`, error);
							return false;
						}
					} else {
						console.warn(`Cannot create fallback animation: Frame 0 doesn't exist for '${spriteKey}'`);
						return false;
					}
				}
				return false;
			}

			// Verify each frame exists before creating the animation
			let allFramesValid = true;
			for (let i = startFrame; i <= endFrame; i++) {
				if (!texture.has(i)) {
					console.warn(`Frame ${i} is missing in texture '${spriteKey}'`);
					allFramesValid = false;
					break;
				}
			}

			if (!allFramesValid) {
				console.warn(`Some frames are invalid for animation '${key}', creating fallback`);
				// Create with just the first frame as fallback
				if (texture.has(0)) {
					this.anims.create({
						key: key,
						frames: [{ key: spriteKey, frame: 0 }],
						frameRate: 1,
						repeat: 0
					});
					this.validAnimations.add(key);
					console.log(`Created single-frame animation '${key}' as fallback due to missing frames`);
					return true;
				}
				return false;
			}

			// Create the animation normally
			this.anims.create({
				key: key,
				frames: this.anims.generateFrameNumbers(spriteKey, frameConfig),
				frameRate: frameRate,
				repeat: repeat
			});

			// Create a special key for the basic defaults
			if (key === 'sheriff-idle' || key === 'alien-walk') {
				// Also create a default animation with the first frame
				this.anims.create({
					key: 'default-anim',
					frames: [{ key: spriteKey, frame: 0 }],
					frameRate: 1,
					repeat: 0
				});
				this.validAnimations.add('default-anim');
				console.log(`Created default-anim fallback with frame 0 of ${spriteKey}`);
			}

			this.validAnimations.add(key);
			console.log(`Created animation '${key}' successfully`);
			return true;
		} catch (error) {
			console.warn(`Error creating animation '${key}':`, error);
			return false;
		}
	}

	create() {
		// Create animations safely
		this.createAnimations();

		// Double check all animations to make sure they're valid
		this.verifyAnimations();

		// Make our valid animations list available globally
		this.registry.set('validAnimations', Array.from(this.validAnimations));

		// Start title scene
		this.scene.start('TitleScene');
	}

	// Verify all animations to make sure they have valid frames
	verifyAnimations() {
		const invalidAnimations = [];

		// Check each animation we think is valid
		this.validAnimations.forEach((key) => {
			try {
				const anim = this.anims.get(key);
				if (!anim) {
					console.warn(`Animation '${key}' does not exist despite being in valid list`);
					invalidAnimations.push(key);
					return;
				}

				// Check if all frames are valid
				if (!anim.frames || anim.frames.length === 0) {
					console.warn(`Animation '${key}' has no frames`);
					invalidAnimations.push(key);
					return;
				}

				// Verify each frame exists
				let allFramesValid = true;
				for (const frame of anim.frames) {
					const texture = this.textures.get(frame.textureKey);
					if (!texture || !texture.has(frame.textureFrame)) {
						console.warn(`Animation '${key}' has invalid frame: ${frame.textureFrame}`);
						allFramesValid = false;
						break;
					}
				}

				if (!allFramesValid) {
					invalidAnimations.push(key);
				}
			} catch (error) {
				console.warn(`Error verifying animation '${key}':`, error);
				invalidAnimations.push(key);
			}
		});

		// Remove invalid animations from our set
		invalidAnimations.forEach((key) => {
			this.validAnimations.delete(key);
		});

		console.log(`Verification complete. Found ${invalidAnimations.length} invalid animations.`);
		console.log(`Final valid animations: ${Array.from(this.validAnimations).join(', ')}`);
	}

	createAnimations() {
		try {
			// Sheriff animations
			this.createSafeAnimation('sheriff-idle', 'sheriff', { start: 0, end: 3 }, 8, -1);
			this.createSafeAnimation('sheriff-run', 'sheriff', { start: 4, end: 11 }, 12, -1);
			this.createSafeAnimation('sheriff-jump', 'sheriff', { start: 12, end: 15 }, 8, 0);

			// Cowboy animations
			this.createSafeAnimation('cowboy-idle', 'cowboy', { start: 0, end: 3 }, 8, -1);
			this.createSafeAnimation('cowboy-run', 'cowboy', { start: 4, end: 11 }, 12, -1);
			this.createSafeAnimation('cowboy-jump', 'cowboy', { start: 12, end: 15 }, 8, 0);

			// Cowgirl animations
			this.createSafeAnimation('cowgirl-idle', 'cowgirl', { start: 0, end: 3 }, 8, -1);
			this.createSafeAnimation('cowgirl-run', 'cowgirl', { start: 4, end: 11 }, 12, -1);
			this.createSafeAnimation('cowgirl-jump', 'cowgirl', { start: 12, end: 15 }, 8, 0);

			// Alien rustler animations
			this.createSafeAnimation('alien-idle', 'alien-rustler', { start: 0, end: 3 }, 8, -1);
			this.createSafeAnimation('alien-run', 'alien-rustler', { start: 4, end: 11 }, 12, -1);
			this.createSafeAnimation('alien-jump', 'alien-rustler', { start: 12, end: 15 }, 8, 0);

			// Drone animations
			this.createSafeAnimation('drone-hover', 'hovering-drone', { start: 0, end: 3 }, 8, -1);
			this.createSafeAnimation('drone-move', 'hovering-drone', { start: 4, end: 7 }, 12, -1);

			// Weapon animations
			this.createSafeAnimation('plasma-revolver-fire', 'plasma-revolver', { start: 0, end: 3 }, 14, 0);
			this.createSafeAnimation('lasso-spin', 'lasso', { start: 0, end: 3 }, 10, -1);

			// Portal animation
			this.createSafeAnimation('portal-spin', 'portal', { start: 0, end: 7 }, 12, -1);

			console.log('✓ Created animations successfully!');
		} catch (error) {
			console.error('Failed to create animations:', error);
		}
	}
}
