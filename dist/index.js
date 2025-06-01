"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terrain_1 = require("./simulation/world/terrain");
const climate_1 = require("./simulation/world/climate");
// Generate the world
function generateWorld(width, height, seed) {
    const elevation = (0, terrain_1.generateHeightmap)(width, height, seed);
    const biomes = (0, climate_1.assignBiomes)(elevation);
    return { width, height, elevation, biomes };
}
// Numerical visualization
function renderElevationNumbers(world) {
    console.log("\nElevation Map (0.0 = water, 1.0 = mountain):");
    for (let y = 0; y < world.height; y++) {
        let row = "";
        for (let x = 0; x < world.width; x++) {
            // Format numbers to 2 decimal places with fixed spacing
            row += world.elevation[x][y].toFixed(2).padStart(5, " ");
        }
        console.log(row);
    }
}
// Biome visualization
function renderBiomes(world) {
    const biomeSymbols = {
        ocean: "~",
        grassland: ".",
        forest: "♣",
        tundra: "^",
        desert: "≈"
    };
    console.log("\nBiome Map:");
    for (let y = 0; y < world.height; y++) {
        let row = "";
        for (let x = 0; x < world.width; x++) {
            row += biomeSymbols[world.biomes[x][y]] + " ";
        }
        console.log(row);
    }
}
// Main execution
const world = generateWorld(10, 10, "debug-seed");
renderElevationNumbers(world);
renderBiomes(world);
// Optional: Save world to JSON
const fs_1 = __importDefault(require("fs"));
fs_1.default.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("\nWorld saved to world.json");
