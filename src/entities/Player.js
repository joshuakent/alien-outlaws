import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		// Get the selected character from the registry, defaulting to 'sheriff' if none is set
		const selectedCharacter = scene.registry.get('selectedCharacter') || 'sheriff';
		super(scene, x, y, selectedCharacter);

		// Store the character type for animation keys
		this.characterType = selectedCharacter;

		// Add player to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Physics properties
		this.setBounce(0.1);
		this.setCollideWorldBounds(true);
		this.setSize(40, 60); // Adjust hitbox
		this.setOffset(12, 4);

		// Player properties
		this.health = 100;
		this.maxHealth = 100;
		this.isJumping = false;
		this.canDoubleJump = false;
		this.hasDoubleJumpUpgrade = false;
		this.isSliding = false;
		this.facingRight = true;

		// Lasso properties
		this.hasLasso = true;
		this.lassoRange = 200;
		this.lassoActive = false;
		this.lassoCooldown = false;

		// Weapon properties
		this.currentWeapon = 'plasma';
		this.ammo = {
			plasma: Infinity,
			electric: 0,
			fire: 0,
			ice: 0
		};

		// Input controls
		this.cursors = scene.input.keyboard.createCursorKeys();
		this.fireKey = scene.input.keyboard.addKey('Z');
		this.lassoKey = scene.input.keyboard.addKey('X');
		this.switchWeaponKey = scene.input.keyboard.addKey('C');
		this.slideKey = scene.input.keyboard.addKey('SHIFT');

		// Sound effects with improved error handling
		try {
			// Check for previously failed audio files
			const failedAudio = scene.registry.get('failedAudio') || [];

			// Set up jump sound
			if (!failedAudio.includes('jump') && scene.cache.audio.exists('jump')) {
				try {
					this.jumpSound = scene.sound.add('jump', { volume: 0.7 });
					console.log('Jump sound loaded successfully');

					// Add error handler
					this.jumpSound.once('error', () => {
						console.error('Error during jump sound playback');
						this.jumpSound = null;
					});
				} catch (error) {
					console.warn('Error creating jump sound:', error);
					this.jumpSound = null;
				}
			} else {
				console.warn('Jump sound not available - listed in failed audio or not in cache');
				this.jumpSound = null;
			}

			// Set up laser shot sound
			if (!failedAudio.includes('laser-shot') && scene.cache.audio.exists('laser-shot')) {
				try {
					this.shootSound = scene.sound.add('laser-shot', { volume: 0.5 });
					console.log('Laser shot sound loaded successfully');

					// Add error handler
					this.shootSound.once('error', () => {
						console.error('Error during laser sound playback');
						this.shootSound = null;
					});
				} catch (error) {
					console.warn('Error creating laser shot sound:', error);
					this.shootSound = null;
				}
			} else {
				console.warn('Laser shot sound not available - listed in failed audio or not in cache');
				this.shootSound = null;
			}
		} catch (error) {
			console.warn('Error initializing player sounds:', error);
			this.jumpSound = null;
			this.shootSound = null;
		}

		// Get our list of valid animations
		this.validAnimations = this.scene.registry.get('validAnimations') || [];
		console.log('Valid animations for player:', this.validAnimations);

		// Initialize with static frame rather than animation
		this.anims.stop();
	}

	// Override preUpdate to add safety for animation frames
	preUpdate(time, delta) {
		// Check if the current animation is valid before calling the parent method
		// This runs BEFORE the animation system tries to access frames
		try {
			if (this.anims.isPlaying) {
				const anim = this.anims.currentAnim;
				if (anim) {
					const frame = this.anims.currentFrame;
					// If the current frame is undefined, reset the animation state
					if (!frame || typeof frame.frame === 'undefined') {
						console.warn('Animation frame error detected and prevented');
						this.anims.stop();
						this.setFrame(0);
					}
				}
			}
		} catch (error) {
			console.warn('Animation error in preUpdate:', error);
			this.anims.stop();
			this.setFrame(0);
		}

		// Call the parent class preUpdate method
		// Only if we have a valid state
		try {
			super.preUpdate(time, delta);
		} catch (error) {
			console.warn('Error in Player preUpdate:', error);
			// Make sure we're in a valid state
			this.anims.stop();
			this.setFrame(0);
		}
	}

	update() {
		this.handleMovement();
		this.handleWeapons();
	}

	// Helper function to safely play animations
	safelyPlayAnim(key, ignoreIfPlaying = true) {
		// Check if this animation exists in our valid animations list
		if (this.validAnimations.includes(key)) {
			try {
				// Double-check that the animation exists in the scene
				const anim = this.scene.anims.get(key);
				if (!anim) {
					console.warn(`Animation '${key}' does not exist in the animation manager`);
					this.anims.stop();
					this.setFrame(0);
					return false;
				}

				// Verify the animation has valid frames before playing
				let framesValid = true;
				for (const frame of anim.frames) {
					const texture = this.scene.textures.get(frame.textureKey);
					if (!texture || !texture.has(frame.textureFrame)) {
						console.warn(`Animation frame invalid in '${key}'`);
						framesValid = false;
						break;
					}
				}

				if (framesValid) {
					// The animation is valid, so it's safe to play
					this.anims.play(key, ignoreIfPlaying);
					return true;
				} else {
					// Don't risk playing the animation
					this.anims.stop();
					this.setFrame(0);
				}
			} catch (error) {
				console.warn(`Error playing animation ${key}:`, error);
				this.anims.stop();
				this.setFrame(0);
			}
		} else if (this.validAnimations.includes('default-anim')) {
			// If the specific animation doesn't exist but we have a default, use that
			try {
				// Double-check default animation too
				const anim = this.scene.anims.get('default-anim');
				if (!anim || !anim.frames || !anim.frames.length) {
					console.warn('Default animation invalid');
					this.anims.stop();
					this.setFrame(0);
					return false;
				}
				this.anims.play('default-anim', ignoreIfPlaying);
				return true;
			} catch (error) {
				console.warn('Failed to play default animation:', error);
				this.anims.stop();
				this.setFrame(0);
			}
		} else {
			// Don't try to play animations, just set a frame
			this.anims.stop();
			this.setFrame(0);
		}
		return false;
	}

	handleMovement() {
		const { left, right, up } = this.cursors;
		const onGround = this.body.blocked.down || this.body.touching.down;

		// Reset jumping status when on ground
		if (onGround) {
			this.isJumping = false;
			this.canDoubleJump = false;
		}

		// Handle sliding
		if (this.slideKey.isDown && onGround && (this.body.velocity.x > 10 || this.body.velocity.x < -10)) {
			if (!this.isSliding) {
				this.isSliding = true;
				this.setSize(40, 30);
				this.setOffset(12, 34);
				// Play slide animation
				this.safelyPlayAnim(`${this.characterType}-slide`);
				// Add a boost to the slide
				this.setVelocityX(this.body.velocity.x * 1.5);
			}
		} else if (this.isSliding) {
			// Only exit slide if we're not moving fast enough or if we're not on ground
			if (!onGround || (Math.abs(this.body.velocity.x) < 10)) {
				this.isSliding = false;
				this.setSize(40, 60);
				this.setOffset(12, 4);
				// Return to idle animation
				this.safelyPlayAnim(`${this.characterType}-idle`);
			}
		}

		// Horizontal movement (disabled during sliding)
		if (!this.isSliding) {
			if (left.isDown) {
				this.setVelocityX(-250);
				this.facingRight = false;
				if (onGround) {
					this.safelyPlayAnim(`${this.characterType}-run`, true);
				}
				this.flipX = true;
			} else if (right.isDown) {
				this.setVelocityX(250);
				this.facingRight = true;
				if (onGround) {
					this.safelyPlayAnim(`${this.characterType}-run`, true);
				}
				this.flipX = false;
			} else {
				this.setVelocityX(0);
				if (onGround) {
					this.safelyPlayAnim(`${this.characterType}-idle`, true);
				}
			}
		} else {
			// Sliding physics
			if (this.facingRight) {
				this.body.velocity.x = Math.max(0, this.body.velocity.x - 5);
			} else {
				this.body.velocity.x = Math.min(0, this.body.velocity.x + 5);
			}
		}

		// Jump
		if (up.isDown && up.getDuration() < 300) {
			if (onGround) {
				this.setVelocityY(-650);
				this.isJumping = true;
				this.canDoubleJump = this.hasDoubleJumpUpgrade;
				this.safelyPlayAnim(`${this.characterType}-jump`);

				// Play jump sound or visual effect
				this.playSound(this.jumpSound, 'jump');
			} else if (this.canDoubleJump && !onGround) {
				this.setVelocityY(-550);
				this.canDoubleJump = false;
				this.safelyPlayAnim(`${this.characterType}-jump`);

				// Play jump sound or visual effect
				this.playSound(this.jumpSound, 'jump');
			}
		}
	}

	handleWeapons() {
		// Shoot
		if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
			this.shoot();
		}

		// Lasso
		if (Phaser.Input.Keyboard.JustDown(this.lassoKey) && !this.lassoCooldown) {
			this.useLasso();
		}

		// Switch weapon
		if (Phaser.Input.Keyboard.JustDown(this.switchWeaponKey)) {
			this.switchWeapon();
		}
	}

	shoot() {
		// Get ammo type for current weapon
		const ammoType = this.currentWeapon;

		if (this.ammo[ammoType] > 0 || ammoType === 'plasma') {
			console.log(`Firing ${ammoType} shot`);

			// Play laser sound or show visual effect
			this.playSound(this.shootSound, 'shoot');

			if (ammoType !== 'plasma') {
				this.ammo[ammoType]--;
			}

			// The actual projectile creation will be handled by the GameScene
			this.scene.events.emit('playerShoot', {
				x: this.x + (this.facingRight ? 30 : -30),
				y: this.y - 5,
				direction: this.facingRight ? 1 : -1,
				type: ammoType
			});
		}
	}

	useLasso() {
		console.log('Using lasso');
		this.lassoActive = true;
		this.lassoCooldown = true;

		// The actual lasso mechanics will be handled by the GameScene
		this.scene.events.emit('playerLasso', {
			x: this.x,
			y: this.y - 10,
			direction: this.facingRight ? 1 : -1,
			range: this.lassoRange
		});

		// Reset cooldown
		this.scene.time.delayedCall(1000, () => {
			this.lassoCooldown = false;
		});
	}

	switchWeapon() {
		const weapons = ['plasma', 'electric', 'fire', 'ice'];
		const currentIndex = weapons.indexOf(this.currentWeapon);
		let nextIndex = (currentIndex + 1) % weapons.length;

		// Skip weapons with no ammo (except plasma which has infinite)
		while (nextIndex !== currentIndex && weapons[nextIndex] !== 'plasma' && this.ammo[weapons[nextIndex]] <= 0) {
			nextIndex = (nextIndex + 1) % weapons.length;
		}

		this.currentWeapon = weapons[nextIndex];
		console.log(`Switched to ${this.currentWeapon} weapon`);

		// Notify the UI about weapon change
		this.scene.events.emit('weaponChanged', this.currentWeapon);
	}

	takeDamage(amount) {
		this.health -= amount;

		if (this.health <= 0) {
			this.die();
		} else {
			// Flash red effect when taking damage
			this.setTint(0xff0000);
			this.scene.time.delayedCall(100, () => {
				this.clearTint();
			});
		}

		// Update UI
		this.scene.events.emit('playerHealthChanged', this.health / this.maxHealth);
	}

	die() {
		this.scene.events.emit('playerDied');
		this.disableBody(true, false);
		this.safelyPlayAnim(`${this.characterType}-die`);
	}

	collectPowerup(type, amount) {
		switch (type) {
			case 'health':
				this.health = Math.min(this.maxHealth, this.health + amount);
				this.scene.events.emit('playerHealthChanged', this.health / this.maxHealth);
				break;
			case 'ammo':
				if (amount.type && amount.count) {
					this.ammo[amount.type] += amount.count;
				}
				break;
			case 'double-jump':
				this.hasDoubleJumpUpgrade = true;
				break;
			default:
				console.log(`Unknown powerup: ${type}`);
		}
	}

	// Visual feedback when sound effects can't be played
	createVisualEffect(type) {
		try {
			// Create a visual effect based on the type
			switch (type) {
				case 'jump':
					// Create small dust particles
					const jumpParticles = this.scene.add.particles(this.x, this.y + 30, this.characterType, {
						speed: { min: 50, max: 100 },
						scale: { start: 0.2, end: 0 },
						lifespan: 300,
						blendMode: 'ADD',
						tint: 0xffffff,
						gravityY: 300,
						emitting: false
					});
					jumpParticles.explode(5);
					this.scene.time.delayedCall(300, () => {
						jumpParticles.destroy();
					});
					break;

				case 'shoot':
					// Create a muzzle flash
					const muzzleFlash = this.scene.add
						.sprite(this.x + (this.facingRight ? 30 : -30), this.y - 5, this.characterType)
						.setScale(0.5)
						.setTint(0xffff00);

					this.scene.tweens.add({
						targets: muzzleFlash,
						alpha: 0,
						scale: 0.1,
						duration: 100,
						onComplete: () => {
							muzzleFlash.destroy();
						}
					});
					break;
			}
		} catch (error) {
			console.warn('Error creating visual effect:', error);
		}
	}

	// Play sound with visual fallback
	playSound(sound, type) {
		let played = false;

		// Try to play the sound if available
		if (sound) {
			try {
				sound.play();
				played = true;
			} catch (error) {
				console.warn(`Error playing ${type} sound:`, error);
			}
		}

		// If sound didn't play, show visual effect instead
		if (!played) {
			this.createVisualEffect(type);
		}

		return played;
	}
}

