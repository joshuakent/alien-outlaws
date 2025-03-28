import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import CharacterSelectScene from './scenes/CharacterSelectScene';
import GameScene from './scenes/GameScene';
import CreditsScene from './scenes/CreditsScene';

// Game configuration
const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: 'game-container',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			debug: false
		}
	},
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [BootScene, PreloadScene, TitleScene, CharacterSelectScene, GameScene, CreditsScene]
};

// Initialize the game
const game = new Phaser.Game(config);
