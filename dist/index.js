"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const terrain_1 = require("./simulation/world/terrain");
const climate_1 = require("./simulation/world/climate");
const rivers_1 = require("./simulation/world/rivers");
const floods_1 = require("./simulation/features/floods");
const config_1 = require("./config");
const fs = __importStar(require("fs"));
const WORLD_SIZE = 30;
const SEED = "tribal-sim-seed-" + Math.random().toString(36).slice(2);
function debugWorld(world) {
    console.log("World Stats:");
    console.log(`- Ocean Tiles: ${world.biomes.flat().filter((b) => b === 'ocean').length}`);
    console.log(`- High Points (>0.7): ${world.elevation.flat().filter((e) => e > 0.7).length}`);
}
function generateWorld() {
    console.log("Generating heightmap...");
    const { elevation } = (0, terrain_1.generateHeightmap)(WORLD_SIZE, WORLD_SIZE, SEED);
    console.log("Assigning biomes...");
    const biomes = (0, climate_1.assignBiomes)(elevation);
    console.log("Generating rivers...");
    const worldWithRivers = (0, rivers_1.generateRivers)({
        width: WORLD_SIZE,
        height: WORLD_SIZE,
        elevation,
        biomes,
        rivers: []
    }, config_1.WORLD_CONFIG.RIVER_COUNT);
    console.log(`Generated ${worldWithRivers.rivers.length} rivers`);
    worldWithRivers.rivers.forEach((r, i) => {
        const end = r.path[r.path.length - 1];
        console.log(` River ${i}: ${r.path.length} tiles, ends at ${worldWithRivers.biomes[end.x][end.y]}`);
    });
    console.log("Simulating floods...");
    const worldWithFloods = (0, floods_1.simulateFloods)(worldWithRivers, config_1.WORLD_CONFIG.BASE_RAINFALL);
    return worldWithFloods;
}
console.log("Starting world generation...");
const world = generateWorld();
debugWorld(world);
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("World saved to world.json");
