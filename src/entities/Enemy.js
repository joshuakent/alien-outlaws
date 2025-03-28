import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type = 'alien-rustler') {
		super(scene, x, y, type);

		// Add enemy to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Set common properties
		this.type = type;
		this.isStunned = false;
		this.isFrozen = false;
		this.isBurning = false;
		this.burnTimer = null;
		this.detectionRange = 300;
		this.attackCooldown = false;

		// Get our list of valid animations
		this.validAnimations = this.scene.registry.get('validAnimations') || [];

		// Set specific properties based on enemy type
		switch (type) {
			case 'hovering-drone':
				this.health = 30;
				this.damage = 10;
				this.speed = 150;
				this.isFlying = true;
				this.setTint(0x00ccff); // Blue tint for drone
				break;
			case 'space-scorpion':
				this.health = 20;
				this.damage = 15;
				this.speed = 200;
				this.setTint(0xcc00ff); // Purple tint for scorpion
				break;
			case 'robo-cacti':
				this.health = 40;
				this.damage = 20;
				this.speed = 100;
				this.isRolling = true;
				this.setTint(0x00ff00); // Green tint for cacti
				break;
			default: // alien-rustler
				this.health = 25;
				this.damage = 10;
				this.speed = 120;
				// Don't set tint for alien rustler - use original sprite colors
				break;
		}

		// Physics properties
		if (!this.isFlying) {
			this.setBounce(0.1);
			this.setCollideWorldBounds(true);
			this.body.setSize(32, 48); // Set hitbox for ground enemies
			this.body.setOffset(16, 16);
		} else {
			this.setGravityY(-scene.physics.world.gravity.y); // Cancel gravity for flying enemies
			this.setCollideWorldBounds(true);
			this.body.setSize(32, 32); // Set hitbox for flying enemies
			this.body.setOffset(16, 16);
		}

		// Set up patrol behavior
		this.startPatrol();

		// Try to play animation if available
		if (type === 'hovering-drone') {
			this.safelyPlayAnim('drone-hover');
		} else if (type === 'alien-rustler') {
			this.safelyPlayAnim('alien-run');
		} else {
			this.safelyPlayAnim(type + '-walk');
		}

		// Initialize with a frame in case animation fails
		this.setFrame(0);
	}

	// Override preUpdate to add safety for animation frames
	preUpdate(time, delta) {
		// Check if the current animation is valid before calling the parent method
		try {
			if (this.anims.isPlaying) {
				const anim = this.anims.currentAnim;
				if (anim) {
					const frame = this.anims.currentFrame;
					// If the current frame is undefined, reset the animation state
					if (!frame || typeof frame.frame === 'undefined') {
						console.warn('Enemy animation frame error detected and prevented');
						this.anims.stop();
						this.setFrame(0);
					}
				}
			}
		} catch (error) {
			console.warn('Enemy animation error in preUpdate:', error);
			this.anims.stop();
			this.setFrame(0);
		}

		// Call the parent class preUpdate method if we have a valid state
		try {
			super.preUpdate(time, delta);
		} catch (error) {
			console.warn('Error in Enemy preUpdate:', error);
			this.anims.stop();
			this.setFrame(0);
		}
	}

	// Helper function to safely play animations
	safelyPlayAnim(key, ignoreIfPlaying = true) {
		// First try the specific animation
		if (this.validAnimations.includes(key)) {
			try {
				// Double-check that the animation exists and has valid frames
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
					this.anims.play(key, ignoreIfPlaying);
					return true;
				} else {
					// Don't risk playing the animation
					this.anims.stop();
					this.setFrame(0);
				}
			} catch (error) {
				console.warn(`Error playing enemy animation ${key}:`, error);
				this.anims.stop();
				this.setFrame(0);
			}
		}
		// Next try a type-specific fallback
		else if (this.validAnimations.includes('alien-walk') && this.type === 'alien-rustler') {
			try {
				// Double-check the fallback animation
				const anim = this.scene.anims.get('alien-walk');
				if (!anim || !anim.frames || !anim.frames.length) {
					console.warn('Fallback animation invalid');
					this.anims.stop();
					this.setFrame(0);
					return false;
				}
				this.anims.play('alien-walk', ignoreIfPlaying);
				return true;
			} catch (error) {
				console.warn('Failed to play alien-walk animation:', error);
				this.anims.stop();
				this.setFrame(0);
			}
		}
		// Finally use the default animation if available
		else if (this.validAnimations.includes('default-anim')) {
			try {
				// Double-check default animation
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
		}
		// If all else fails, just stop animations and use a static frame
		this.anims.stop();
		this.setFrame(0);
		return false;
	}

	update(player) {
		if (this.isFrozen || this.isStunned) {
			this.setVelocity(0, 0);
			return;
		}

		// Calculate distance to player
		const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

		if (distanceToPlayer < this.detectionRange) {
			this.chasePlayer(player);
		} else {
			this.patrol();
		}
	}

	startPatrol() {
		this.patrolDirection = 1;
		this.patrolTimer = this.scene.time.addEvent({
			delay: 2000,
			callback: () => {
				this.patrolDirection *= -1;
				this.flipX = this.patrolDirection < 0;
			},
			loop: true
		});
	}

	patrol() {
		this.setVelocityX(this.speed * this.patrolDirection);

		if (this.isFlying) {
			// Add a slight up and down movement for flying enemies
			this.setVelocityY(Math.sin(this.scene.time.now / 300) * 50);
		}
	}

	chasePlayer(player) {
		// Calculate direction to player
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;

		// Normalize direction
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		// Move towards player
		this.setVelocityX(normalizedX * this.speed);

		if (this.isFlying) {
			this.setVelocityY(normalizedY * this.speed);
		}

		// Flip sprite based on direction
		this.flipX = directionX < 0;

		// Attack if close enough
		if (length < 50 && !this.attackCooldown) {
			this.attack(player);
		}
	}

	attack(player) {
		player.takeDamage(this.damage);

		this.attackCooldown = true;

		// Reset cooldown
		this.scene.time.delayedCall(1000, () => {
			this.attackCooldown = false;
		});
	}

	takeDamage(amount) {
		this.health -= amount;

		// Flash white effect when taking damage
		this.setTint(0xffffff);
		this.scene.time.delayedCall(100, () => {
			this.clearTint();
			// Restore the original tint based on enemy type
			switch (this.type) {
				case 'hovering-drone':
					this.setTint(0x00ccff);
					break;
				case 'space-scorpion':
					this.setTint(0xcc00ff);
					break;
				case 'robo-cacti':
					this.setTint(0x00ff00);
					break;
				default: // alien-rustler
					this.setTint(0xff3300);
					break;
			}
		});

		if (this.health <= 0) {
			this.die();
		}
	}

	die() {
		// Stop any ongoing timers
		if (this.patrolTimer) {
			this.patrolTimer.remove();
		}

		if (this.burnTimer) {
			this.burnTimer.remove();
		}

		// Create death effect
		try {
			const deathParticles = this.scene.add.particles(this.x, this.y, this.texture.key, {
				speed: { min: 50, max: 150 },
				scale: { start: 0.5, end: 0 },
				lifespan: 800,
				blendMode: 'ADD',
				emitting: false
			});

			deathParticles.explode(15);

			// Remove particles after animation
			this.scene.time.delayedCall(800, () => {
				deathParticles.destroy();
			});
		} catch (error) {
			console.warn('Error creating death particles:', error);
		}

		// Drop powerup with a chance
		const dropChance = Math.random();
		if (dropChance > 0.7) {
			this.scene.events.emit('enemyDroppedPowerup', {
				x: this.x,
				y: this.y,
				type: dropChance > 0.9 ? 'health' : 'ammo'
			});
		}

		// Emit enemy death event
		this.scene.events.emit('enemyDied');

		// Destroy enemy
		this.destroy();
	}

	stun(duration) {
		console.log('Enemy stunned for', duration, 'ms');
		this.isStunned = true;
		this.setTint(0x00ffff);
		
		// Stop enemy movement
		this.setVelocity(0, 0);
		
		// Add a visual effect to show stun
		const stunEffect = this.scene.add.graphics();
		stunEffect.lineStyle(2, 0x00ffff);
		stunEffect.strokeCircle(this.x, this.y - 40, 20);
		stunEffect.setAlpha(0.5);
		
		// Animate the stun effect
		this.scene.tweens.add({
			targets: stunEffect,
			scale: 1.5,
			alpha: 0,
			duration: duration,
			onComplete: () => {
				stunEffect.destroy();
			}
		});

		// Reset stun after duration
		this.scene.time.delayedCall(duration, () => {
			this.isStunned = false;
			if (!this.isFrozen && !this.isBurning) {
				this.clearTint();
				// Restore the original tint based on enemy type
				switch (this.type) {
					case 'hovering-drone':
						this.setTint(0x00ccff);
						break;
					case 'space-scorpion':
						this.setTint(0xcc00ff);
						break;
					case 'robo-cacti':
						this.setTint(0x00ff00);
						break;
					default: // alien-rustler
						this.setTint(0xff3300);
						break;
				}
			}
		});
	}

	freeze(duration) {
		this.isFrozen = true;
		this.setTint(0x88ccff);

		this.scene.time.delayedCall(duration, () => {
			this.isFrozen = false;
			if (!this.isStunned && !this.isBurning) {
				this.clearTint();
				// Restore the original tint based on enemy type
				switch (this.type) {
					case 'hovering-drone':
						this.setTint(0x00ccff);
						break;
					case 'space-scorpion':
						this.setTint(0xcc00ff);
						break;
					case 'robo-cacti':
						this.setTint(0x00ff00);
						break;
					default: // alien-rustler
						this.setTint(0xff3300);
						break;
				}
			}
		});
	}

	burn(damage, duration) {
		this.isBurning = true;
		this.setTint(0xff4400);

		// Clear any existing burn timer
		if (this.burnTimer) {
			this.burnTimer.remove();
		}

		// Apply damage over time
		this.burnTimer = this.scene.time.addEvent({
			delay: 500,
			callback: () => {
				this.takeDamage(damage);
			},
			repeat: duration / 500 - 1
		});

		// End burning effect
		this.scene.time.delayedCall(duration, () => {
			this.isBurning = false;
			if (!this.isStunned && !this.isFrozen) {
				this.clearTint();
				// Restore the original tint based on enemy type
				switch (this.type) {
					case 'hovering-drone':
						this.setTint(0x00ccff);
						break;
					case 'space-scorpion':
						this.setTint(0xcc00ff);
						break;
					case 'robo-cacti':
						this.setTint(0x00ff00);
						break;
					default: // alien-rustler
						this.setTint(0xff3300);
						break;
				}
			}
		});
	}
}
