import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
	constructor() {
		super('BootScene');
	}

	preload() {
		// Load loading screen assets
		this.load.image('logo', 'assets/images/logo.png');
		this.load.image('loading-bar', 'assets/images/loading-bar.png');
	}

	create() {
		this.scene.start('PreloadScene');
	}
}
