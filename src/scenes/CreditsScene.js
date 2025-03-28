import Phaser from 'phaser';

export default class CreditsScene extends Phaser.Scene {
	constructor() {
		super('CreditsScene');
	}

	create() {
		// Background with gradient
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Create gradient background using Phaser's fillGradientStyle method
		const bg = this.add.graphics();

		// Use fillGradientStyle instead of createLinearGradient
		bg.fillGradientStyle(
			0x000033, // top color
			0x000033, // top-right color
			0x330022, // bottom-right color
			0x330022, // bottom-left color
			1 // alpha
		);

		bg.fillRect(0, 0, width, height);

		// Add stars to background
		for (let i = 0; i < 100; i++) {
			const x = Phaser.Math.Between(0, width);
			const y = Phaser.Math.Between(0, height);
			const size = Phaser.Math.Between(1, 3);

			const star = this.add.circle(x, y, size, 0xffffff);

			// Make stars twinkle
			this.tweens.add({
				targets: star,
				alpha: 0.2,
				duration: Phaser.Math.Between(1000, 3000),
				ease: 'Sine.easeInOut',
				yoyo: true,
				repeat: -1
			});
		}

		// Logo at the top
		const logo = this.add.image(width / 2, 100, 'logo');
		logo.setScale(0.6);

		// Add title text
		const titleText = this.add
			.text(width / 2, 200, 'CREDITS', {
				fontFamily: 'Georgia, "Times New Roman", serif',
				fontSize: '48px',
				fontStyle: 'bold',
				color: '#ffcc00',
				stroke: '#000000',
				strokeThickness: 6,
				shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
			})
			.setOrigin(0.5);

		// Create animated subtitle
		const subtitleText = this.add
			.text(width / 2, 270, 'THE COSMIC TEAM', {
				fontFamily: 'Georgia, "Times New Roman", serif',
				fontSize: '28px',
				fontStyle: 'italic',
				color: '#00ccff'
			})
			.setOrigin(0.5);

		// Animate subtitle glow
		this.tweens.add({
			targets: subtitleText,
			alpha: 0.6,
			duration: 1500,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1
		});

		// Create developer credits with effects
		// Left column
		const joshText = this.createDeveloperCredit(width / 2 - 200, height / 2 - 20, 'Josh Kent', '#ff6a00');
		const shelleyText = this.createDeveloperCredit(width / 2 - 200, height / 2 + 80, 'Shelley Arnold', '#00ccff');
		
		// Right column
		const evelynText = this.createDeveloperCredit(width / 2 + 200, height / 2 - 20, 'Evelyn Kent', '#ff00ff');
		const lillianText = this.createDeveloperCredit(width / 2 + 200, height / 2 + 80, 'Lillian Kent', '#00ff00');

		// Add role descriptions
		// Left column roles
		this.add
			.text(width / 2 - 200, height / 2 + 20, 'LEAD DEVELOPER & DESIGN', {
				fontFamily: 'Arial, sans-serif',
				fontSize: '16px',
				color: '#ffffff',
				align: 'center'
			})
			.setOrigin(0.5);

		this.add
			.text(width / 2 - 200, height / 2 + 120, 'CREATIVE DIRECTOR & ART', {
				fontFamily: 'Arial, sans-serif',
				fontSize: '16px',
				color: '#ffffff',
				align: 'center'
			})
			.setOrigin(0.5);

		// Right column roles
		this.add
			.text(width / 2 + 200, height / 2 + 20, 'LEAD LEVEL DESIGNER', {
				fontFamily: 'Arial, sans-serif',
				fontSize: '16px',
				color: '#ffffff',
				align: 'center'
			})
			.setOrigin(0.5);

		this.add
			.text(width / 2 + 200, height / 2 + 120, 'LEAD QA ENGINEER', {
				fontFamily: 'Arial, sans-serif',
				fontSize: '16px',
				color: '#ffffff',
				align: 'center'
			})
			.setOrigin(0.5);

		// Add back button
		const backButton = this.add
			.text(width / 2, height - 100, 'BACK TO MENU', {
				fontFamily: 'Arial, sans-serif',
				fontSize: '24px',
				fontWeight: 'bold',
				color: '#ffffff',
				backgroundColor: '#222222',
				padding: { x: 20, y: 10 }
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		// Add pointer events for back button
		backButton.on('pointerover', () => {
			backButton.setColor('#ffcc00');
		});

		backButton.on('pointerout', () => {
			backButton.setColor('#ffffff');
		});

		backButton.on('pointerdown', () => {
			try {
				this.sound.play('jump');
			} catch (error) {
				console.warn('Could not play sound', error);
			}
			this.scene.start('TitleScene');
		});

		// Make developer names interactive
		joshText.setInteractive({ useHandCursor: true });
		shelleyText.setInteractive({ useHandCursor: true });
		evelynText.setInteractive({ useHandCursor: true });
		lillianText.setInteractive({ useHandCursor: true });

		// Set up click handlers for developer names
		joshText.on('pointerdown', () => {
			this.createNameExplosion(joshText.x, joshText.y, 0xff6a00);
			try {
				this.sound.play('laser-shot');
			} catch (error) {
				console.warn('Could not play sound', error);
			}
		});

		shelleyText.on('pointerdown', () => {
			this.createNameExplosion(shelleyText.x, shelleyText.y, 0x00ccff);
			try {
				this.sound.play('laser-shot');
			} catch (error) {
				console.warn('Could not play sound', error);
			}
		});

		evelynText.on('pointerdown', () => {
			this.createNameExplosion(evelynText.x, evelynText.y, 0xff00ff);
			try {
				this.sound.play('laser-shot');
			} catch (error) {
				console.warn('Could not play sound', error);
			}
		});

		lillianText.on('pointerdown', () => {
			this.createNameExplosion(lillianText.x, lillianText.y, 0x00ff00);
			try {
				this.sound.play('laser-shot');
			} catch (error) {
				console.warn('Could not play sound', error);
			}
		});

		// Start ambient animations
		this.time.addEvent({
			delay: 2000,
			callback: () => this.createAmbientParticle(),
			callbackScope: this,
			loop: true
		});
	}

	createDeveloperCredit(x, y, name, color) {
		// Add developer name with special styling
		const nameText = this.add
			.text(x, y, name, {
				fontFamily: 'Georgia, "Times New Roman", serif',
				fontSize: '36px',
				fontWeight: 'bold',
				color: color,
				stroke: '#000000',
				strokeThickness: 4,
				shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
			})
			.setOrigin(0.5);

		// Create hover effect
		this.tweens.add({
			targets: nameText,
			scaleX: 1.1,
			scaleY: 1.1,
			duration: 2000,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1
		});

		return nameText;
	}

	createAmbientParticle() {
		// Create simple ambient particles around the names using basic shapes
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Create particles at random positions around name areas
		const areaX = width / 2 + Phaser.Math.Between(-100, 100);
		const areaY = height / 2 + Phaser.Math.Between(-100, 100);
		const isJoshArea = areaY < height / 2;

		// Use appropriate color based on area
		const color = isJoshArea ? 0xff6a00 : 0x00ccff;

		// Create a small circle as a particle
		const particle = this.add.circle(areaX, areaY, 3, color, 0.5);

		// Animate particle
		this.tweens.add({
			targets: particle,
			alpha: 0,
			scale: 0,
			y: particle.y - Phaser.Math.Between(20, 40),
			duration: 1500,
			onComplete: () => {
				particle.destroy();
			}
		});
	}

	createNameExplosion(x, y, color) {
		// Manual particle creation for explosion
		for (let i = 0; i < 20; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * 100;

			const particleX = x + Math.cos(angle) * distance;
			const particleY = y + Math.sin(angle) * distance;

			const particle = this.add.circle(x, y, 4, color);

			this.tweens.add({
				targets: particle,
				x: particleX,
				y: particleY,
				alpha: 0,
				scale: 0,
				duration: 800,
				ease: 'Power2',
				onComplete: () => {
					particle.destroy();
				}
			});
		}

		// Add screen shake effect
		this.cameras.main.shake(300, 0.01);
	}
}
