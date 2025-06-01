"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeightmap = generateHeightmap;
const simplex_noise_1 = require("simplex-noise");
// Seed conversion function
function stringToSeed(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
function generateHeightmap(width, height, seed) {
    const numericSeed = stringToSeed(seed);
    const noise2D = (0, simplex_noise_1.createNoise2D)(() => numericSeed);
    const elevation = [];
    for (let x = 0; x < width; x++) {
        elevation[x] = [];
        for (let y = 0; y < height; y++) {
            const scale = 0.1;
            elevation[x][y] = (noise2D(x * scale, y * scale) + 1) / 2;
        }
    }
    return elevation;
}
