"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeightmap = generateHeightmap;
const simplex_noise_1 = require("simplex-noise");
function stringToSeed(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
function generateHeightmap(width, height, seed) {
    const noise2D = (0, simplex_noise_1.createNoise2D)(() => stringToSeed(seed));
    const elevation = [];
    // Biome thresholds
    const WATER_LEVEL = 0.4;
    const MOUNTAIN_LEVEL = 0.8;
    for (let x = 0; x < width; x++) {
        elevation[x] = [];
        for (let y = 0; y < height; y++) {
            // Multi-octave noise with domain warping
            let value = 0;
            let amplitude = 1;
            let frequency = 0.02; // Lower frequency for larger features
            let totalAmplitude = 0;
            // Base noise (large continents)
            const nx = x * frequency;
            const ny = y * frequency;
            value += noise2D(nx, ny) * amplitude;
            totalAmplitude += amplitude;
            // Secondary noise (medium terrain features)
            amplitude *= 0.5;
            frequency *= 3;
            const nx2 = x * frequency + value * 2; // Domain warping
            const ny2 = y * frequency + value * 2;
            value += noise2D(nx2, ny2) * amplitude;
            totalAmplitude += amplitude;
            // Tertiary noise (small details)
            amplitude *= 0.25;
            frequency *= 4;
            value += noise2D(x * frequency, y * frequency) * amplitude;
            totalAmplitude += amplitude;
            // Normalize and adjust curve
            elevation[x][y] = Math.pow((value / totalAmplitude + 1) / 2, // Normalize to 0-1
            1.5 // Makes low areas flatter and highs more dramatic
            );
            // Add slight random perturbation
            elevation[x][y] = Math.max(0, Math.min(1, elevation[x][y] + (Math.random() * 0.05 - 0.025)));
        }
    }
    return elevation;
}
