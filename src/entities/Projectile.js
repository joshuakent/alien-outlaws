import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type = 'plasma') {
		super(scene, x, y, 'plasma-revolver');

		// Add projectile to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Configure physics body for proper collision detection
		this.body.setSize(16, 16); // Set a consistent hitbox size
		this.body.setOffset(8, 8); // Center the hitbox
		this.body.setBounce(0);
		this.body.setCollideWorldBounds(true);

		// Ensure the sprite is using a valid frame
		try {
			// Use the first frame by default (index 0)
			this.setFrame(0);

			// Start the firing animation
			if (scene.anims.exists('plasma-revolver-fire')) {
				this.play('plasma-revolver-fire');
			}
		} catch (error) {
			console.warn('Could not set projectile frame or animation:', error);
			// If we can't set a frame, make it more visible with a colored rectangle
			this.setTint(0xff00ff);
		}

		// Set projectile properties based on type
		this.type = type;
		this.speed = 500;
		this.damage = 10;
		this.lifespan = 2000; // milliseconds

		// Adjust properties based on type
		switch (type) {
			case 'electric':
				this.setTint(0x00ffff);
				this.damage = 8;
				this.stunDuration = 500;
				break;
			case 'fire':
				this.setTint(0xff4400);
				this.damage = 5;
				this.burnDamage = 5;
				this.burnDuration = 3000;
				break;
			case 'ice':
				this.setTint(0x88ccff);
				this.damage = 7;
				this.freezeDuration = 1000;
				break;
			default: // plasma
				this.setTint(0xff00ff);
				break;
		}

		// Set lifespan
		scene.time.delayedCall(this.lifespan, () => {
			this.destroy();
		});
	}

	fire(direction) {
		this.setVelocityX(direction * this.speed);

		// Add some random y velocity for a more dynamic feel
		this.setVelocityY(Phaser.Math.Between(-30, 30));

		// Make sure the projectile doesn't fall due to gravity
		this.setGravityY(-this.scene.physics.world.gravity.y);

		// Rotate projectile based on direction
		this.setRotation(direction > 0 ? 0 : Math.PI);
	}

	hit(target) {
		// Apply damage
		if (target.takeDamage) {
			target.takeDamage(this.damage);

			// Apply special effects
			switch (this.type) {
				case 'electric':
					if (target.stun) {
						target.stun(this.stunDuration);
					}
					break;
				case 'fire':
					if (target.burn) {
						target.burn(this.burnDamage, this.burnDuration);
					}
					break;
				case 'ice':
					if (target.freeze) {
						target.freeze(this.freezeDuration);
					}
					break;
			}
		}

		// Create hit effect
		this.createHitEffect();

		// Destroy projectile
		this.destroy();
	}

	createHitEffect() {
		try {
			// Create particles using a simple fallback system if needed
			if (this.scene.add.particles && this.scene.textures.exists('plasma-revolver')) {
				const effectParticles = this.scene.add.particles(this.x, this.y, 'plasma-revolver', {
					speed: { min: 50, max: 150 },
					scale: { start: 0.5, end: 0 },
					lifespan: 300,
					blendMode: 'ADD',
					tint: this.tintTopLeft,
					emitting: false
				});

				effectParticles.explode(10);

				// Remove particles after animation
				this.scene.time.delayedCall(300, () => {
					effectParticles.destroy();
				});
			} else {
				// Fallback to a simple circle explosion if particles system isn't working
				this.createCircleExplosion();
			}
		} catch (error) {
			console.warn('Error creating hit effect particles:', error);
			// Use fallback if there's an error
			this.createCircleExplosion();
		}
	}

	createCircleExplosion() {
		// Create a simple circle explosion effect as fallback
		const color = this.tintTopLeft || 0xff00ff;

		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2;
			const distance = 20;
			const x = this.x + Math.cos(angle) * distance;
			const y = this.y + Math.sin(angle) * distance;

			const circle = this.scene.add.circle(this.x, this.y, 5, color, 0.8);

			this.scene.tweens.add({
				targets: circle,
				x: x,
				y: y,
				alpha: 0,
				scale: 0.5,
				duration: 300,
				onComplete: () => {
					circle.destroy();
				}
			});
		}
	}
}
