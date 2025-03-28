# Missing Assets for Alien Outlaws

This file documents the assets that are currently missing and causing errors in the game. These need to be created or acquired before the game will run properly.

## Missing Audio Files

The following audio files are referenced in the code but don't exist:

- `assets/audio/main-theme.mp3` - Background music for the title screen
- `assets/audio/laser-shot.mp3` - Sound effect for firing the plasma revolver
- `assets/audio/jump.mp3` - Sound effect for player jumping

### ⚠️ IMPORTANT: Audio Errors

The placeholder generator creates empty files for audio which will cause `decodeAudioData` errors in the browser. To fix these errors, you need to:

1. Replace the placeholder audio files with actual MP3 files (even simple test sounds)
2. If you don't have audio files yet, you can download free sound effects from sites like:
   - [Freesound](https://freesound.org/)
   - [OpenGameArt](https://opengameart.org/)
   - [Pixabay](https://pixabay.com/sound-effects/)

Alternatively, you can modify the `PreloadScene.js` to completely skip loading the audio files until you have proper sound files.

## Missing Image Files

The following image files are referenced in the code but don't exist:

- `assets/images/logo.png` - Game logo for loading screen
- `assets/images/loading-bar.png` - Loading bar for preload screen
- `assets/images/sheriff.png` - Player character spritesheet
- `assets/images/plasma-revolver.png` - Weapon spritesheet
- `assets/images/lasso.png` - Lasso ability spritesheet
- `assets/images/alien-rustler.png` - Basic enemy spritesheet
- `assets/images/hovering-drone.png` - Flying enemy spritesheet
- `assets/images/ground.png` - Ground platform texture
- `assets/images/platform.png` - Platform texture
- `assets/images/bg-far.png` - Far background parallax layer
- `assets/images/bg-mid.png` - Mid background parallax layer
- `assets/images/health-bar.png` - Health UI element
- `assets/images/ammo-indicator.png` - Ammo type indicator
- `assets/images/tileset.png` - Level tileset

## Missing Tilemap Files

The following tilemap files are referenced in the code but don't exist:

- `assets/tilemaps/level-1.json` - First level tilemap data

## Creating Placeholder Assets

For testing purposes, you can create simple placeholder assets:

### Audio

For audio placeholders, you can use any royalty-free audio files and rename them to match the expected filenames.

**Note:** The empty audio files created by the placeholder generator will cause browser errors. You need to use actual MP3 files with valid audio data.

### Images

For image placeholders, you can create simple colored rectangles or basic shapes:

- Character spritesheets: Create a simple animated character with basic frames (idle, run, jump)
- Background: Simple gradient or pattern
- Platforms: Solid colored rectangles
- UI elements: Basic shapes with clear purpose

### Tilemaps

For the tilemap, you can create a simple JSON file with a basic level layout.
