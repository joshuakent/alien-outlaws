const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 64x64 sprite sheet with 8 frames
const frameSize = 64;
const numFrames = 8;
const canvas = createCanvas(frameSize * numFrames, frameSize);
const ctx = canvas.getContext('2d');

// Colors for the portal
const outerColor = '#4a90e2';
const innerColor = '#00ff00';
const glowColor = '#00ffff';

// Draw each frame
for (let frame = 0; frame < numFrames; frame++) {
    const x = frame * frameSize;
    
    // Calculate rotation for this frame
    const rotation = (frame / numFrames) * Math.PI * 2;
    
    // Draw outer ring
    ctx.save();
    ctx.translate(x + frameSize/2, frameSize/2);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.strokeStyle = outerColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = innerColor;
    ctx.fill();
    
    // Draw glow effect
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 35);
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
}

// Save the sprite sheet
const outputPath = path.join(__dirname, '../assets/images/portal.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('Portal sprite sheet generated successfully!'); 