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
    for (let x = 0; x < width; x++) {
        elevation[x] = [];
        for (let y = 0; y < height; y++) {
            // Multi-octave noise with domain warping
            let value = 0;
            let amplitude = 1;
            let frequency = 0.01;
            let totalAmplitude = 0;
            // Base noise (large continents)
            const nx = x * frequency;
            const ny = y * frequency;
            value += noise2D(nx, ny) * amplitude;
            totalAmplitude += amplitude;
            // Medium details
            amplitude *= 0.5;
            frequency *= 2;
            value += noise2D(x * frequency + value * 2, y * frequency + value * 2) * amplitude;
            totalAmplitude += amplitude;
            // Fine details
            amplitude *= 0.25;
            frequency *= 3;
            value += noise2D(x * frequency, y * frequency) * amplitude;
            totalAmplitude += amplitude;
            // Normalize and curve
            elevation[x][y] = Math.pow((value / totalAmplitude + 1) / 2, 1.5 // Makes lowlands flatter and mountains sharper
            );
        }
    }
    return {
        elevation,
        minElevation: Math.min(...elevation.flat()),
        maxElevation: Math.max(...elevation.flat())
    };
}
