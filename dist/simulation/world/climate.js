"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignBiomes = assignBiomes;
function assignBiomes(elevation) {
    const biomes = [];
    for (let x = 0; x < elevation.length; x++) {
        biomes[x] = [];
        for (let y = 0; y < elevation[x].length; y++) {
            const height = elevation[x][y];
            if (height < 0.3)
                biomes[x][y] = "ocean";
            else if (height < 0.5)
                biomes[x][y] = "grassland";
            else if (height < 0.8)
                biomes[x][y] = "forest";
            else
                biomes[x][y] = "tundra"; // Mountains are cold
        }
    }
    return biomes;
}
