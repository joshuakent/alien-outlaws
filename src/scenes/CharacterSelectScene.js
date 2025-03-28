import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
	constructor() {
		super('CharacterSelectScene');
		this.selectedCharacter = 'sheriff'; // Default character
		this.characters = [
			{ key: 'sheriff', name: 'Sheriff', description: 'The classic lawman of the cosmos.' },
			{ key: 'cowboy', name: 'Cowboy', description: 'A rugged space wanderer with quick reflexes.' },
			{ key: 'cowgirl', name: 'Cowgirl', description: 'Fast and agile with expert shooting skills.' }
		];
	}

	create() {
		// Get screen dimensions
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Add background
		this.add.image(width / 2, height / 2, 'bg-far').setScrollFactor(0.1);
		this.add.image(width / 2, height / 2, 'bg-mid').setScrollFactor(0.5);

		// Title text
		this.add
			.text(width / 2, height / 6, 'SELECT YOUR CHARACTER', {
				fontFamily: 'Arial',
				fontSize: 48,
				color: '#ffff00',
				stroke: '#6a4f4b',
				strokeThickness: 6,
				shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
			})
			.setOrigin(0.5);

		// Create character selection area
		this.createCharacterSelection(width, height);

		// Add selection confirmation button
		const confirmButton = this.add
			.text(width / 2, height - 100, 'CONFIRM SELECTION', {
				fontFamily: 'Arial',
				fontSize: 36,
				color: '#ffffff',
				stroke: '#000000',
				strokeThickness: 4
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		// Button hover effects
		confirmButton.on('pointerover', () => {
			confirmButton.setTint(0xffff00);
		});

		confirmButton.on('pointerout', () => {
			confirmButton.clearTint();
		});

		// Start game on click
		confirmButton.on('pointerdown', () => {
			// Store the selected character in the registry for access in other scenes
			this.registry.set('selectedCharacter', this.selectedCharacter);

			// Transition to the game scene
			this.cameras.main.fade(500, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start('GameScene');
			});
		});

		// Back button
		const backButton = this.add
			.text(100, height - 100, '< BACK', {
				fontFamily: 'Arial',
				fontSize: 24,
				color: '#ffffff',
				stroke: '#000000',
				strokeThickness: 2
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		backButton.on('pointerover', () => {
			backButton.setTint(0xffff00);
		});

		backButton.on('pointerout', () => {
			backButton.clearTint();
		});

		backButton.on('pointerdown', () => {
			this.cameras.main.fade(500, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start('TitleScene');
			});
		});
	}

	createCharacterSelection(width, height) {
		const centerY = height / 2;
		const spacing = width / 3;

		// Character selection container
		this.selectionContainer = this.add.container(0, 0);

		// Create character display for each character
		this.characters.forEach((character, index) => {
			const x = spacing * (index + 0.5);

			// Character sprite
			const sprite = this.add
				.sprite(x, centerY - 50, character.key, 0)
				.setScale(2)
				.setInteractive({ useHandCursor: true });

			// Character name
			const nameText = this.add
				.text(x, centerY + 70, character.name, {
					fontFamily: 'Arial',
					fontSize: 24,
					color: '#ffffff',
					stroke: '#000000',
					strokeThickness: 3
				})
				.setOrigin(0.5);

			// Character description
			const descText = this.add
				.text(x, centerY + 110, character.description, {
					fontFamily: 'Arial',
					fontSize: 16,
					color: '#cccccc',
					stroke: '#000000',
					strokeThickness: 2,
					wordWrap: { width: spacing - 40 }
				})
				.setOrigin(0.5);

			// Selection indicator (initially invisible except for default)
			const indicator = this.add.rectangle(x, centerY - 50, 140, 140, 0xffff00, 0).setStrokeStyle(4, 0xffff00);

			if (character.key === this.selectedCharacter) {
				indicator.fillAlpha = 0.1;
			}

			// Group items for this character
			const group = { sprite, nameText, descText, indicator, key: character.key };

			// Add interaction
			sprite.on('pointerdown', () => {
				this.selectCharacter(character.key);
			});

			// Add to animation for idle
			try {
				// Safely attempt to play animation if it exists
				if (this.anims.exists(`${character.key}-idle`)) {
					sprite.play(`${character.key}-idle`);
				}
			} catch (e) {
				console.warn(`Could not play idle animation for ${character.key}`, e);
			}

			// Add to selection container
			this.selectionContainer.add([indicator, sprite, nameText, descText]);

			// Store reference for easy access
			if (!this.characterGroups) this.characterGroups = [];
			this.characterGroups.push(group);
		});
	}

	selectCharacter(key) {
		// Update selected character
		this.selectedCharacter = key;

		// Update visual indicators
		this.characterGroups.forEach((group) => {
			if (group.key === key) {
				group.indicator.fillAlpha = 0.1;

				// Play a short animation to show selection
				this.tweens.add({
					targets: group.sprite,
					y: group.sprite.y - 10,
					duration: 200,
					yoyo: true,
					ease: 'Power1'
				});
			} else {
				group.indicator.fillAlpha = 0;
			}
		});

		// Play sound effect if available
		try {
			this.sound.play('jump');
		} catch (error) {
			console.warn('Could not play selection sound effect', error);
		}
	}
}
