import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
	constructor() {
		super('TitleScene');
		this.selectedMusic = 'alien-outlaw'; // Default music
	}

	// Play background music with robust error handling
	tryPlayBackgroundMusic() {
		try {
			// Check if this audio was in the failed list
			const failedAudio = this.registry.get('failedAudio') || [];
			if (failedAudio.includes(this.selectedMusic)) {
				console.warn('Background music was previously detected as failed, not attempting to play it');
				return false;
			}

			// Check if the audio exists in the cache
			if (this.cache.audio.exists(this.selectedMusic)) {
				// Try to create and play the music
				try {
					// Stop any currently playing music
					const existingMusic = this.registry.get('backgroundMusic');
					if (existingMusic) {
						existingMusic.stop();
						existingMusic.destroy();
						this.registry.remove('backgroundMusic');
					}

					// Create new music instance
					const music = this.sound.add(this.selectedMusic, {
						loop: true,
						volume: 0.5
					});
					
					// Store in registry
					this.registry.set('backgroundMusic', music);
					this.registry.set('selectedMusic', this.selectedMusic);

					// Play the music
					music.play();
					console.log(`✓ Playing ${this.selectedMusic}`);
					return true;
				} catch (error) {
					console.error('Error creating or playing music:', error);
					return false;
				}
			} else {
				console.warn(`✗ ${this.selectedMusic} not found in cache`);
				return false;
			}
		} catch (error) {
			console.error('Error setting up background music:', error);
			return false;
		}
	}

	create() {
		// Get screen dimensions
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Attempt to play background music with better error handling
		const musicPlaying = this.tryPlayBackgroundMusic();
		if (!musicPlaying) {
			console.warn('Could not play background music. See console for details.');
			// Display a message on screen for debug purposes
			this.add
				.text(10, 10, '⚠️ Audio not working', {
					fontSize: '14px',
					fill: '#ff0000',
					backgroundColor: '#000000'
				})
				.setScrollFactor(0)
				.setDepth(1001);
		}

		// Add parallax backgrounds
		this.add.image(width / 2, height / 2, 'bg-far').setScrollFactor(0.1);
		this.add.image(width / 2, height / 2, 'bg-mid').setScrollFactor(0.5);

		// Game title
		const titleText = this.add
			.text(width / 2, height / 3, 'Alien Outlaws', {
				fontFamily: 'Arial',
				fontSize: 64,
				color: '#ffff00',
				stroke: '#6a4f4b',
				strokeThickness: 8,
				shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
			})
			.setOrigin(0.5);

		// Subtitle
		const subtitleText = this.add
			.text(width / 2, height / 3 + 70, 'The Cosmic Stampede', {
				fontFamily: 'Arial',
				fontSize: 32,
				color: '#ffffff',
				stroke: '#6a4f4b',
				strokeThickness: 4
			})
			.setOrigin(0.5);

		// Music selection buttons
		const musicButtons = [
			{ key: 'alien-outlaw', text: 'Alien Outlaw' },
			{ key: 'where-my-aliens-at', text: 'Where My Aliens At' },
			{ key: 'no-aliens', text: 'No Aliens' }
		];

		// Add Music Selection label
		this.add
			.text(width - 200, height - 280, 'Music Selection:', {
				fontFamily: 'Arial',
				fontSize: 18,
				color: '#ffff00',
				stroke: '#000000',
				strokeThickness: 4
			})
			.setOrigin(0, 0.5);

		musicButtons.forEach((button, index) => {
			const y = height - 250 + (index * 30); // Position from bottom
			const x = width - 200; // Position from right
			const musicButton = this.add
				.text(x, y, button.text, {
					fontFamily: 'Arial',
					fontSize: 16, // Smaller font size
					color: button.key === this.selectedMusic ? '#ffff00' : '#ffffff'
				})
				.setOrigin(0, 0.5) // Align text to the left
				.setInteractive({ useHandCursor: true });

			// Hover effects
			musicButton.on('pointerover', () => {
				musicButton.setTint(0xffff00);
			});

			musicButton.on('pointerout', () => {
				musicButton.clearTint();
				if (button.key !== this.selectedMusic) {
					musicButton.setColor('#ffffff');
				}
			});

			// Click handler
			musicButton.on('pointerdown', () => {
				if (button.key !== this.selectedMusic) {
					// Stop current music
					if (this.music) {
						this.music.stop();
					}
					// Update selected music
					this.selectedMusic = button.key;
					// Update button colors
					musicButtons.forEach((b, i) => {
						const btn = this.children.list.find(child => 
							child.type === 'Text' && 
							child.text === b.text
						);
						if (btn) {
							btn.setColor(b.key === this.selectedMusic ? '#ffff00' : '#ffffff');
						}
					});
					// Play new music
					this.tryPlayBackgroundMusic();
				}
			});
		});

		// Play button
		const playButton = this.add
			.text(width / 2, height - 150, 'PLAY', {
				fontFamily: 'Arial',
				fontSize: 48,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		// Make button interactive
		playButton.setInteractive({ useHandCursor: true });

		// Hover effects
		playButton.on('pointerover', () => {
			playButton.setTint(0xffff00);
		});

		playButton.on('pointerout', () => {
			playButton.clearTint();
		});

		// Start game on click
		playButton.on('pointerdown', () => {
			// Store selected music in registry (already stored in tryPlayBackgroundMusic)
			this.cameras.main.fade(500, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start('CharacterSelectScene');
			});
		});

		// Credits button
		const creditsButton = this.add
			.text(width / 2, height - 200, 'CREDITS', {
				fontFamily: 'Arial',
				fontSize: 32,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		// Make button interactive
		creditsButton.setInteractive({ useHandCursor: true });

		// Hover effects
		creditsButton.on('pointerover', () => {
			creditsButton.setTint(0xffff00);
		});

		creditsButton.on('pointerout', () => {
			creditsButton.clearTint();
		});

		// Add credits button functionality
		creditsButton.on('pointerdown', () => {
			// Play a sound effect if available
			try {
				this.sound.play('jump');
			} catch (error) {
				console.warn('Could not play button sound effect', error);
			}

			// Transition to the credits scene
			this.cameras.main.fade(500, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start('CreditsScene');
			});
		});

		// Add animation effect to title
		this.tweens.add({
			targets: titleText,
			y: titleText.y - 10,
			duration: 1500,
			yoyo: true,
			repeat: -1,
			ease: 'Sine.easeInOut'
		});
	}

	shutdown() {
		// Stop the music when leaving the scene
		if (this.music && this.music.isPlaying) {
			this.music.stop();
		}
	}
}

