# Alien Outlaws: The Cosmic Stampede

A side-scrolling action platformer with a Western Sci-fi theme built with Phaser 3.

## Game Description

In a futuristic Wild West, alien bandits descend on Earth to steal genetically engineered space cows. Sheriff Colt McGraw — armed with a plasma revolver, a jet-powered lasso, and a trusty robo-horse — must chase them across deserts, spaceports, and alien motherships in this fast-paced side-scroller.

## Features

- Run-and-gun gameplay with platforming and puzzle elements
- Multiple weapons with elemental effects
- Jet-powered lasso for swinging and grabbing enemies
- Robo-horse summon for high-speed sections
- Diverse enemies and boss battles
- Western Sci-fi theme with vibrant visuals

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone this repository
3. Install dependencies:
   ```
   npm install
   ```
4. Generate placeholder assets (required before first run):
   ```
   npm run generate-placeholders
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Open your browser at `http://localhost:8080`

## Asset Requirements

This project requires various assets (images, audio, tilemaps) to function properly. For development:

1. Use the placeholder generator script: `npm run generate-placeholders` (creates empty files for testing)
2. See `assets/MISSING_ASSETS.md` for a list of all required assets
3. Replace placeholder assets with real assets as they become available

## Controls

- **Arrow Keys**: Move left/right, Jump
- **Z**: Shoot with plasma revolver
- **X**: Use jet lasso
- **C**: Switch weapon
- **Shift**: Slide

## Development Roadmap

1. **Core Mechanics** (Current Stage)

   - Player movement and combat
   - Basic enemy behavior
   - Level design for first area

2. **Content Expansion**

   - Additional levels
   - Boss battles
   - Power-ups and collectibles

3. **Polish & Refinement**
   - Sound effects and music
   - Visual effects
   - UI improvements

## Asset Creation

This project requires the following assets to be created:

- Character sprites (Sheriff, enemies)
- Weapon effects
- Level tileset
- Background elements
- UI elements
- Sound effects and music

## Tech Stack

- Phaser 3 (Game engine)
- JavaScript/ES6
- Webpack (Bundling)
- Tiled (Level design)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
