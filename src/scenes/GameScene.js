import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import Projectile from '../entities/Projectile';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
		this.currentLevel = 1;
		this.isGameOver = false;
		this.enemyCount = 0; // Track number of enemies
		this.enemyDiedListener = null; // Track event listener
	}

	init() {
		// Clean up any existing event listeners from previous levels
		if (this.enemyDiedListener) {
			this.events.off('enemyDied', this.enemyDiedListener);
			this.enemyDiedListener = null;
		}
	}

	create() {
		// Get screen dimensions
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Get the selected music from registry
		const selectedMusic = this.registry.get('selectedMusic') || 'alien-outlaw';

		// Set world bounds
		this.physics.world.setBounds(0, 0, 3200, 720);

		// Check and log valid animations for debugging
		const validAnimations = this.registry.get('validAnimations') || [];
		console.log('Valid animations in GameScene:', validAnimations);

		// Pre-check all animations before using them
		this.verifyAnimationFrames();

		// Create background layers (parallax)
		this.createBackgrounds();

		// Create level platforms and terrain
		this.createLevel();

		// Create player
		this.player = new Player(this, 100, 600);

		// Create enemies
		this.enemies = this.physics.add.group({
			classType: Enemy,
			runChildUpdate: false // We'll handle updates manually
		});

		// Add enemies based on current level
		this.spawnLevelEnemies();

		// Create projectiles group
		this.projectiles = this.physics.add.group({
			classType: Projectile,
			maxSize: 30
		});

		// Set up collisions
		this.setupCollisions();

		// Camera follows player
		this.cameras.main.setBounds(0, 0, 3200, 720);
		this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

		// Setup game events
		this.setupEvents();

		// Create UI
		this.createUI();

		// Add level display
		this.add
			.text(10, 10, `Level ${this.currentLevel}`, {
				fontSize: '24px',
				fill: '#ffffff',
				stroke: '#000000',
				strokeThickness: 4
			})
			.setScrollFactor(0)
			.setDepth(1000);

		// Add enemy count display on the right side
		this.enemyCountText = this.add
			.text(this.cameras.main.width - 10, 40, `Enemies Remaining: ${this.enemyCount}`, {
				fontSize: '24px',
				fill: '#ffffff',
				stroke: '#000000',
				strokeThickness: 4
			})
			.setOrigin(1, 0.5) // Right-align the text
			.setScrollFactor(0)
			.setDepth(1000);

		// Make sure the selected background music is playing
		const backgroundMusic = this.registry.get('backgroundMusic');
		if (backgroundMusic && !backgroundMusic.isPlaying) {
			backgroundMusic.play();
		}
	}

	shutdown() {
		// Remove enemy death event listener if it exists
		if (this.enemyDiedListener) {
			this.events.off('enemyDied', this.enemyDiedListener);
		}
		
		// Don't stop the music when leaving the scene - it will continue in all game scenes
	}

	// Verify that animations have valid frames before using them
	verifyAnimationFrames() {
		const validAnimations = this.registry.get('validAnimations') || [];
		const verifiedAnimations = [];

		validAnimations.forEach((key) => {
			try {
				const anim = this.anims.get(key);
				if (!anim) {
					console.warn(`Animation '${key}' does not exist in the animation manager`);
					return;
				}

				// Check if frames are valid
				let framesValid = true;
				for (const frame of anim.frames) {
					const texture = this.textures.get(frame.textureKey);
					if (!texture || !texture.has(frame.textureFrame)) {
						console.warn(`Animation '${key}' frame ${frame.textureFrame} is invalid`);
						framesValid = false;
						break;
					}
				}

				if (framesValid) {
					verifiedAnimations.push(key);
				} else {
					// Try to create a fallback single frame animation
					const firstFrame = anim.frames[0];
					if (firstFrame) {
						const texture = this.textures.get(firstFrame.textureKey);
						if (texture && texture.has(0)) {
							// Create a single frame animation as fallback
							this.anims.create({
								key: key,
								frames: [{ key: firstFrame.textureKey, frame: 0 }],
								frameRate: 1,
								repeat: 0
							});
							verifiedAnimations.push(key);
							console.log(`Recreated '${key}' with a single safe frame`);
						}
					}
				}
			} catch (error) {
				console.warn(`Error verifying animation '${key}':`, error);
			}
		});

		// Update registry with verified animations
		this.registry.set('validAnimations', verifiedAnimations);
		console.log('Verified animations:', verifiedAnimations);
	}

	update() {
		// Update player
		this.player.update();

		// Update enemies safely
		this.enemies.getChildren().forEach((enemy) => {
			if (enemy && typeof enemy.update === 'function') {
				try {
					enemy.update(this.player);
				} catch (error) {
					console.warn(`Error updating enemy:`, error);
				}
			}
		});

		// No need to check for enemy count here, we'll use events instead
	}

	createBackgrounds() {
		try {
			// Far background (static)
			this.add.tileSprite(0, 0, this.physics.world.bounds.width, 720, 'bg-far').setOrigin(0, 0).setScrollFactor(0.1);

			// Mid background (scrolls slower than foreground)
			this.add.tileSprite(0, 0, this.physics.world.bounds.width, 720, 'bg-mid').setOrigin(0, 0).setScrollFactor(0.5);
		} catch (error) {
			console.warn('Error creating backgrounds:', error);
			// Create fallback background
			this.add.rectangle(0, 0, this.physics.world.bounds.width, 720, 0x0a0a2a).setOrigin(0, 0).setScrollFactor(0);
		}
	}

	createLevel() {
		// Create platforms group
		this.platforms = this.physics.add.staticGroup();

		try {
			// Ground
			this.platforms.create(1600, 700, 'ground').setScale(8, 1).refreshBody();

			if (this.currentLevel === 1) {
				// Level 1 - Basic introduction
				const platformPositions = [
					{ x: 400, y: 570 },
					{ x: 700, y: 500 },
					{ x: 1000, y: 400 },
					{ x: 1300, y: 300 },
					{ x: 1600, y: 400 },
					{ x: 1900, y: 500 },
					{ x: 2200, y: 450 },
					{ x: 2500, y: 550 },
					{ x: 2800, y: 500 }
				];

				platformPositions.forEach((pos) => {
					this.platforms.create(pos.x, pos.y, 'platform');
				});

				// Create door at the end of level 1
				this.createDoor(3000, 500);
			} else if (this.currentLevel === 2) {
				// Level 2 - More challenging platform layout
				const platformPositions = [
					{ x: 300, y: 550 },
					{ x: 600, y: 450 },
					{ x: 900, y: 350 },
					{ x: 1200, y: 250 },
					{ x: 1500, y: 400 },
					{ x: 1800, y: 300 },
					{ x: 2100, y: 450 },
					{ x: 2400, y: 200 },
					{ x: 2700, y: 350 },
					{ x: 3000, y: 500 }
				];

				platformPositions.forEach((pos) => {
					this.platforms.create(pos.x, pos.y, 'platform');
				});

				// Create door at the end of level 2
				this.createDoor(3000, 500);
			} else if (this.currentLevel === 3) {
				// Level 3 - Zigzag pattern with more enemies
				const platformPositions = [
					{ x: 200, y: 600 },
					{ x: 500, y: 400 },
					{ x: 800, y: 600 },
					{ x: 1100, y: 300 },
					{ x: 1400, y: 500 },
					{ x: 1700, y: 200 },
					{ x: 2000, y: 400 },
					{ x: 2300, y: 600 },
					{ x: 2600, y: 300 },
					{ x: 2900, y: 500 }
				];

				platformPositions.forEach((pos) => {
					this.platforms.create(pos.x, pos.y, 'platform');
				});

				// Create door at the end of level 3
				this.createDoor(3000, 500);
			} else if (this.currentLevel === 4) {
				// Level 4 - Extreme height variations
				const platformPositions = [
					{ x: 150, y: 650 },
					{ x: 450, y: 300 },
					{ x: 750, y: 550 },
					{ x: 1050, y: 150 },
					{ x: 1350, y: 450 },
					{ x: 1650, y: 100 },
					{ x: 1950, y: 350 },
					{ x: 2250, y: 600 },
					{ x: 2550, y: 200 },
					{ x: 2850, y: 400 }
				];

				platformPositions.forEach((pos) => {
					this.platforms.create(pos.x, pos.y, 'platform');
				});

				// Create door at the end of level 4
				this.createDoor(3000, 500);
			}
		} catch (error) {
			console.warn('Error creating platforms:', error);
			// Fallback: create plain rectangle platforms
			this.platforms.add(this.add.rectangle(1600, 700, 3200, 32, 0x8b4513).setOrigin(0.5, 0.5));
			this.physics.add.existing(this.platforms, true);
		}
	}

	createDoor(x, y) {
		// Create a container for the door visuals
		this.door = this.add.container(x, y);
		
		// Create the door frame (wooden border)
		const frame = this.add.graphics();
		frame.lineStyle(8, 0x8b4513); // Brown color
		frame.strokeRect(-30, -60, 60, 120); // Taller door frame
		this.door.add(frame);
		
		// Create the door itself
		const door = this.add.graphics();
		door.fillStyle(0x8b4513); // Brown color
		door.fillRect(-25, -55, 50, 110); // Slightly smaller than frame
		this.door.add(door);
		
		// Add door details (wooden planks)
		const planks = this.add.graphics();
		planks.lineStyle(2, 0x654321); // Darker brown for planks
		for (let i = -50; i <= 50; i += 10) {
			planks.moveTo(-25, i);
			planks.lineTo(25, i);
		}
		this.door.add(planks);
		
		// Add door handle
		const handle = this.add.graphics();
		handle.lineStyle(4, 0xffd700); // Gold color
		handle.strokeCircle(20, 0, 5);
		this.door.add(handle);
		
		// Create a separate physics body for the door
		this.doorBody = this.add.rectangle(x, y, 60, 120, 0x8b4513);
		this.doorBody.setAlpha(0); // Make it invisible
		this.physics.add.existing(this.doorBody, true);
		
		// Add a subtle glow effect
		const glow = this.add.graphics();
		const gradient = glow.createLinearGradient(-40, -70, 40, 70);
		gradient.addColorStop(0, 0xffff00);
		gradient.addColorStop(1, 0xffff0000);
		glow.fillStyle(gradient);
		glow.fillRect(-40, -70, 80, 140);
		glow.setAlpha(0.3);
		this.door.add(glow);
	}

	setupCollisions() {
		try {
			// Player collides with platforms
			this.physics.add.collider(this.player, this.platforms);

			// Enemies collide with platforms
			this.physics.add.collider(this.enemies, this.platforms);

			// Player collides with door
			if (this.doorBody) {
				this.physics.add.overlap(this.player, this.doorBody, (player, door) => {
					console.log('Door touched!'); // Debug log
					if (this.enemyCount === 0) {
						this.completeLevel();
					} else {
						// Show message that enemies need to be defeated
						const message = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 
							'Defeat all enemies first!', {
							fontSize: '32px',
							fill: '#ff0000',
							stroke: '#000000',
							strokeThickness: 4
						}).setOrigin(0.5).setScrollFactor(0);
						
						// Remove message after 2 seconds
						this.time.delayedCall(2000, () => {
							message.destroy();
						});
					}
				});
			}

			// Projectiles hit platforms
			this.physics.add.collider(this.projectiles, this.platforms, (projectile) => {
				try {
					if (projectile && typeof projectile.createHitEffect === 'function') {
						projectile.createHitEffect();
					}
					if (projectile) {
						projectile.destroy();
					}
				} catch (error) {
					console.warn('Error handling projectile collision:', error);
					if (projectile) projectile.destroy();
				}
			});

			// Projectiles hit enemies
			this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
				try {
					console.log('Projectile hit enemy:', projectile, enemy); // Debug log
					if (projectile && enemy) {
						// Ensure both objects are still valid
						if (projectile.active && enemy.active) {
							if (typeof projectile.hit === 'function') {
								projectile.hit(enemy);
							} else {
								// Fallback damage if hit function doesn't exist
								enemy.takeDamage(projectile.damage || 10);
								projectile.destroy();
							}
						}
					}
				} catch (error) {
					console.warn('Error handling projectile-enemy collision:', error);
					if (projectile) projectile.destroy();
				}
			}, null, this);

			// Player collides with enemies (taking damage)
			this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
				try {
					if (!player.isInvulnerable) {
						player.takeDamage(enemy.damage || 10);

						// Knockback
						const knockbackDirection = player.x < enemy.x ? -1 : 1;
						player.setVelocity(knockbackDirection * 200, -200);

						// Temporary invulnerability
						player.isInvulnerable = true;
						this.time.delayedCall(1000, () => {
							player.isInvulnerable = false;
						});
					}
				} catch (error) {
					console.warn('Error handling player-enemy collision:', error);
				}
			});
		} catch (error) {
			console.warn('Error setting up collisions:', error);
		}
	}

	setupEvents() {
		// Player shooting
		this.events.on('playerShoot', (data) => {
			try {
				const projectile = this.projectiles.get(data.x, data.y, data.type);
				if (projectile && typeof projectile.fire === 'function') {
					projectile.fire(data.direction);
				}
			} catch (error) {
				console.warn('Error handling player shoot event:', error);
			}
		});

		// Listen for enemy death event - enemies emit this when destroyed
		this.enemyDiedListener = () => {
			this.enemyCount--;
			if (this.enemyCountText) {
				this.enemyCountText.setText(`Enemies Remaining: ${this.enemyCount}`);
			}
		};
		
		// Add event listener
		this.events.on('enemyDied', this.enemyDiedListener);

		// Player using lasso
		this.events.on('playerLasso', (data) => {
			console.log('Lasso event received', data);
			
			// Create lasso sprite
			const lasso = this.add.sprite(data.x, data.y, 'lasso');
			
			// Set initial rotation based on direction
			lasso.setRotation(data.direction === 1 ? 0 : Math.PI);
			
			// Animate lasso throw
			this.tweens.add({
				targets: lasso,
				x: data.x + (data.range * data.direction),
				duration: 500,
				ease: 'Power2',
				onUpdate: () => {
					// Check for enemies in range during the throw
					const enemies = this.enemies.getChildren();
					for (const enemy of enemies) {
						if (enemy && enemy.active) {
							const distance = Phaser.Math.Distance.Between(
								lasso.x, lasso.y,
								enemy.x, enemy.y
							);
							
							if (distance < 50) {
								console.log('Lasso hit enemy!');
								// Lasso hit an enemy
								enemy.stun(2000); // Stun for 2 seconds
								// Pull enemy towards player
								this.tweens.add({
									targets: enemy,
									x: this.player.x + (this.player.facingRight ? 100 : -100), // Pull to a safe distance
									y: this.player.y,
									duration: 1000,
									ease: 'Power2'
								});
								// Stop the lasso throw and return immediately
								this.tweens.killTweensOf(lasso);
								this.tweens.add({
									targets: lasso,
									x: this.player.x,
									y: this.player.y,
									duration: 300,
									ease: 'Power2',
									onComplete: () => {
										lasso.destroy();
									}
								});
								return;
							}
						}
					}
				},
				onComplete: () => {
					// Return lasso to player if no enemy was hit
					this.tweens.add({
						targets: lasso,
						x: this.player.x,
						y: this.player.y,
						duration: 300,
						ease: 'Power2',
						onComplete: () => {
							lasso.destroy();
						}
					});
				}
			});
		});

		// Enemy dropping powerup
		this.events.on('enemyDroppedPowerup', (data) => {
			console.log('Powerup dropped', data);
			// Implement powerup creation here
		});

		// Player death
		this.events.on('playerDied', () => {
			this.handleGameOver();
		});
	}

	handleGameOver() {
		// Set game over flag
		this.isGameOver = true;

		// Stop all game systems
		this.physics.pause();
		this.events.emit('gamePaused');

		// Pause all animations
		this.player.anims.pause();
		this.enemies.getChildren().forEach(enemy => {
			if (enemy && enemy.anims) {
				enemy.anims.pause();
			}
		});
		this.projectiles.getChildren().forEach(projectile => {
			if (projectile && projectile.anims) {
				projectile.anims.pause();
			}
		});

		// Create game over text
		const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'GAME OVER', {
			fontSize: '64px',
			fill: '#ff0000',
			stroke: '#000000',
			strokeThickness: 8
		}).setOrigin(0.5).setScrollFactor(0);

		// Create countdown text
		const countdownText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Returning to title screen in 5...', {
			fontSize: '32px',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 4
		}).setOrigin(0.5).setScrollFactor(0);

		// Start countdown
		let countdown = 5;
		const countdownTimer = this.time.addEvent({
			delay: 1000,
			callback: () => {
				countdown--;
				countdownText.setText(`Returning to title screen in ${countdown}...`);
				
				if (countdown <= 0) {
					// Fade out and return to title screen
					this.cameras.main.fade(1000, 0, 0, 0);
					this.time.delayedCall(1000, () => {
						this.scene.start('TitleScene');
					});
				}
			},
			repeat: 4
		});
	}

	createUI() {
		try {
			// Create UI elements (health bar, ammo indicator)
			this.healthBar = this.add.image(120, 40, 'health-bar').setScrollFactor(0).setOrigin(0, 0.5);

			this.ammoIndicator = this.add.image(120, 80, 'ammo-indicator').setScrollFactor(0).setOrigin(0, 0.5);

			// Listen for health changes
			this.events.on('playerHealthChanged', (healthPercent) => {
				if (this.healthBar && !this.isGameOver) {
					this.healthBar.setScale(healthPercent, 1);
				}
			});
		} catch (error) {
			console.warn('Error creating UI elements:', error);
			// Create fallback UI
			this.healthBarFallback = this.add.rectangle(120, 40, 100, 20, 0xff0000).setScrollFactor(0).setOrigin(0, 0.5);

			this.add
				.text(70, 40, 'HP', {
					fontSize: '12px',
					fill: '#fff'
				})
				.setScrollFactor(0)
				.setOrigin(0.5);

			this.ammoIndicatorFallback = this.add.rectangle(120, 80, 100, 20, 0xffff00).setScrollFactor(0).setOrigin(0, 0.5);

			this.add
				.text(70, 80, 'AMMO', {
					fontSize: '12px',
					fill: '#fff'
				})
				.setScrollFactor(0)
				.setOrigin(0.5);
		}
	}

	completeLevel() {
		// Play portal sound if available
		try {
			this.sound.play('portal');
		} catch (error) {
			console.warn('Could not play portal sound:', error);
		}

		// Create level complete text
		const completeText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'LEVEL COMPLETE!', {
			fontSize: '64px',
			fill: '#ffff00',
			stroke: '#000000',
			strokeThickness: 8
		}).setOrigin(0.5);

		// Fade out the level
		this.cameras.main.fade(1000, 0, 0, 0);

		// After fade, transition to next level or game over
		this.time.delayedCall(2000, () => {
			if (this.currentLevel < 4) {
				// Move to next level
				this.currentLevel++;
				this.scene.restart();
			} else {
				// Game completed - reset level and return to title
				this.currentLevel = 1;
				this.scene.start('TitleScene');
			}
		});
	}

	spawnLevelEnemies() {
		try {
			this.enemyCount = 0; // Reset enemy count
			if (this.currentLevel === 1) {
				// Level 1 - Enemies spread throughout the level
				// Start area
				this.spawnEnemy(400, 530, 'alien-rustler');
				this.spawnEnemy(650, 530, 'alien-rustler');
				
				// Mid level
				this.spawnEnemy(1200, 350, 'hovering-drone');
				this.spawnEnemy(1600, 380, 'alien-rustler');
				
				// End area
				this.spawnEnemy(2400, 450, 'hovering-drone');
				this.spawnEnemy(2700, 480, 'alien-rustler');
			} else if (this.currentLevel === 2) {
				// Level 2 - More enemies with better distribution
				// Start area
				this.spawnEnemy(300, 500, 'alien-rustler');
				this.spawnEnemy(600, 400, 'hovering-drone');
				
				// Mid level
				this.spawnEnemy(1200, 200, 'alien-rustler');
				this.spawnEnemy(1500, 350, 'hovering-drone');
				this.spawnEnemy(1800, 280, 'alien-rustler');
				
				// End area
				this.spawnEnemy(2300, 180, 'hovering-drone');
				this.spawnEnemy(2700, 330, 'alien-rustler');
				this.spawnEnemy(2900, 470, 'hovering-drone');
			} else if (this.currentLevel === 3) {
				// Level 3 - Increased enemy count with better distribution
				// Start area
				this.spawnEnemy(200, 550, 'alien-rustler');
				this.spawnEnemy(500, 350, 'hovering-drone');
				
				// Mid level
				this.spawnEnemy(800, 550, 'alien-rustler');
				this.spawnEnemy(1100, 250, 'hovering-drone');
				this.spawnEnemy(1400, 450, 'alien-rustler');
				this.spawnEnemy(1700, 180, 'hovering-drone');
				
				// End area
				this.spawnEnemy(2000, 380, 'alien-rustler');
				this.spawnEnemy(2300, 550, 'alien-rustler');
				this.spawnEnemy(2600, 280, 'hovering-drone');
				this.spawnEnemy(2800, 480, 'alien-rustler');
			} else if (this.currentLevel === 4) {
				// Level 4 - Most challenging enemy placement throughout the level
				// Start area
				this.spawnEnemy(150, 550, 'alien-rustler');
				this.spawnEnemy(450, 250, 'hovering-drone');
				
				// Mid level - first part
				this.spawnEnemy(750, 500, 'alien-rustler');
				this.spawnEnemy(1050, 100, 'hovering-drone');
				this.spawnEnemy(1350, 400, 'alien-rustler');
				
				// Mid level - second part
				this.spawnEnemy(1650, 50, 'hovering-drone');
				this.spawnEnemy(1850, 330, 'alien-rustler');
				this.spawnEnemy(2000, 200, 'hovering-drone');
				
				// End area
				this.spawnEnemy(2250, 550, 'alien-rustler');
				this.spawnEnemy(2550, 150, 'hovering-drone');
				this.spawnEnemy(2750, 380, 'alien-rustler');
				this.spawnEnemy(2850, 300, 'hovering-drone');
			}
			// Update enemy count display
			if (this.enemyCountText) {
				this.enemyCountText.setText(`Enemies Remaining: ${this.enemyCount}`);
			}
		} catch (error) {
			console.warn('Error spawning enemies:', error.message);
		}
	}

	spawnEnemy(x, y, type) {
		try {
			const enemy = new Enemy(this, x, y, type);
			this.enemies.add(enemy);
			this.enemyCount++; // Increment enemy count
			return enemy;
		} catch (error) {
			console.warn(`Error spawning enemy (${type}):`, error);
			return null;
		}
	}
}

