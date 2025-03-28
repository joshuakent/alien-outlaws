/**
 * Audio Generator Script
 *
 * This script generates actual working audio files for your game.
 * It requires 'audiobuffer-to-wav', 'fs-extra', and 'node-audioconvert' packages.
 *
 * Installation:
 * npm install audiobuffer-to-wav fs-extra node-audioconvert ogg-encode
 */

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Ensure audio directory exists
const audioDir = path.join(__dirname, '../assets/audio');
fs.ensureDirSync(audioDir);

console.log('Generating audio files for your game...');
console.log('This script will create WAV files. If you have ffmpeg installed, it will also create OGG files.');

// Check if ffmpeg is installed
exec('ffmpeg -version', (error) => {
	const hasFFmpeg = !error;
	console.log(
		hasFFmpeg ? 'FFmpeg detected - will generate OGG files too.' : 'FFmpeg not found - generating WAV files only.'
	);

	// Generate the audio files
	generateAudioFiles(hasFFmpeg);
});

function generateAudioFiles(canConvertToOgg) {
	// Create simple WAV files using Node.js Buffer
	createLaserSound();
	createJumpSound();
	createSimpleMusic();

	console.log('Audio files generated successfully!');
	console.log('\nIf your audio is still not working:');
	console.log('1. Try clearing your browser cache');
	console.log('2. Verify the files were created correctly in assets/audio/');
	console.log('3. For more options, run: npm run audio-helper');
}

function createLaserSound() {
	// Create a simple WAV file with a laser-like sound
	const filePath = path.join(audioDir, 'laser-shot.wav');
	const fileContent = generateLaserShotWav();
	fs.writeFileSync(filePath, fileContent);
	console.log('Created laser-shot.wav');

	// Convert to OGG if possible
	convertToOgg('laser-shot.wav');
}

function createJumpSound() {
	// Create a simple WAV file with a jumping sound
	const filePath = path.join(audioDir, 'jump.wav');
	const fileContent = generateJumpWav();
	fs.writeFileSync(filePath, fileContent);
	console.log('Created jump.wav');

	// Convert to OGG if possible
	convertToOgg('jump.wav');
}

function createSimpleMusic() {
	// Create a simple WAV file with basic background music
	const filePath = path.join(audioDir, 'main-theme.wav');
	const fileContent = generateSimpleMusicWav();
	fs.writeFileSync(filePath, fileContent);
	console.log('Created main-theme.wav');

	// Convert to OGG if possible
	convertToOgg('main-theme.wav');
}

function convertToOgg(fileName) {
	const inputPath = path.join(audioDir, fileName);
	const outputPath = path.join(audioDir, fileName.replace('.wav', '.ogg'));

	exec(`ffmpeg -i "${inputPath}" -c:a libvorbis -q:a 4 "${outputPath}"`, (error) => {
		if (!error) {
			console.log(`Converted ${fileName} to OGG format`);
		}
	});
}

// Function to generate a simple WAV header and data for a laser sound
function generateLaserShotWav() {
	// This creates a very basic WAV file with a simple sine wave
	// For simplicity, we're creating a short, high-pitched tone

	const sampleRate = 44100;
	const duration = 0.3; // seconds
	const numSamples = Math.floor(sampleRate * duration);

	// Create WAV header
	const buffer = Buffer.alloc(44 + numSamples * 2);

	// WAV header
	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(36 + numSamples * 2, 4);
	buffer.write('WAVE', 8);
	buffer.write('fmt ', 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(numSamples * 2, 40);

	// Laser sound data - descending frequency with quick decay
	let amplitude = 32767;
	for (let i = 0; i < numSamples; i++) {
		const t = i / sampleRate;
		const frequency = 1000 - 700 * (t / duration);
		const decay = Math.exp(-6 * t);
		const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude * decay;
		buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
	}

	return buffer;
}

// Function to generate a simple WAV for a jump sound
function generateJumpWav() {
	const sampleRate = 44100;
	const duration = 0.4; // seconds
	const numSamples = Math.floor(sampleRate * duration);

	// Create WAV header
	const buffer = Buffer.alloc(44 + numSamples * 2);

	// WAV header (same as above)
	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(36 + numSamples * 2, 4);
	buffer.write('WAVE', 8);
	buffer.write('fmt ', 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(numSamples * 2, 40);

	// Jump sound data - ascending frequency with quick attack/decay
	for (let i = 0; i < numSamples; i++) {
		const t = i / sampleRate;
		let frequency;
		let amplitude;

		if (t < 0.2) {
			// Ascending part of the jump
			frequency = 300 + 700 * (t / 0.2);
			amplitude = 32767 * (t / 0.1);
			if (t > 0.1) amplitude = 32767 * (1 - (t - 0.1) / 0.1);
		} else {
			// Descending part
			frequency = 1000 - 800 * ((t - 0.2) / 0.2);
			amplitude = 16000 * Math.exp(-(t - 0.2) * 10);
		}

		const sample = Math.sin(2 * Math.PI * frequency * t) * Math.min(32767, amplitude);
		buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
	}

	return buffer;
}

// Function to generate a simple background music WAV
function generateSimpleMusicWav() {
	const sampleRate = 44100;
	const duration = 10; // 10 seconds looping music
	const numSamples = Math.floor(sampleRate * duration);

	// Create WAV header
	const buffer = Buffer.alloc(44 + numSamples * 2);

	// WAV header (same as above)
	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(36 + numSamples * 2, 4);
	buffer.write('WAVE', 8);
	buffer.write('fmt ', 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(numSamples * 2, 40);

	// Simple background music - looping melody
	const notes = [
		{ freq: 261.63, dur: 0.5 }, // C4
		{ freq: 293.66, dur: 0.5 }, // D4
		{ freq: 329.63, dur: 0.5 }, // E4
		{ freq: 349.23, dur: 0.5 }, // F4
		{ freq: 392.0, dur: 0.5 }, // G4
		{ freq: 349.23, dur: 0.5 }, // F4
		{ freq: 329.63, dur: 0.5 }, // E4
		{ freq: 293.66, dur: 0.5 } // D4
	];

	let currentTime = 0;
	let currentNote = 0;
	const totalNoteDuration = notes.reduce((sum, note) => sum + note.dur, 0);

	for (let i = 0; i < numSamples; i++) {
		const t = i / sampleRate;

		// Determine which note to play
		const normalizedTime = t % totalNoteDuration;

		let noteStartTime = 0;
		currentNote = 0;

		// Find the current note based on the time
		for (let j = 0; j < notes.length; j++) {
			if (normalizedTime >= noteStartTime && normalizedTime < noteStartTime + notes[j].dur) {
				currentNote = j;
				currentTime = normalizedTime - noteStartTime;
				break;
			}
			noteStartTime += notes[j].dur;
		}

		// Add some basic effects
		const noteT = currentTime / notes[currentNote].dur;
		const attack = Math.min(1, noteT * 10); // Quick attack
		const decay = Math.max(0, 1 - (noteT - 0.8) * 5); // Decay at the end of the note
		const envelope = Math.min(attack, decay);

		// Create the sample
		const frequency = notes[currentNote].freq;
		const amplitude = 16000 * envelope;

		// Add a bit of vibrato for interest
		const vibratoFreq = 5;
		const vibratoAmp = 4;
		const vibrato = vibratoAmp * Math.sin(2 * Math.PI * vibratoFreq * t);

		const sample = Math.sin(2 * Math.PI * (frequency + vibrato) * t) * amplitude;
		buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
	}

	return buffer;
}
