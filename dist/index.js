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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terrain_1 = require("./simulation/world/terrain");
const climate_1 = require("./simulation/world/climate");
const fs = __importStar(require("fs"));
const readline_1 = __importDefault(require("readline"));
// Configuration
const WORLD_SIZE = 30;
const CHUNK_SIZE = 10;
const SEED = "large-world-seed";
// World generation function (must be defined or imported)
function generateWorld(width, height, seed) {
    const elevation = (0, terrain_1.generateHeightmap)(width, height, seed);
    const biomes = (0, climate_1.assignBiomes)(elevation);
    return { width, height, elevation, biomes };
}
// Visualization
function renderWorldChunk(world, startX, startY) {
    const biomeColors = {
        ocean: '\x1b[34m≈\x1b[0m',
        grassland: '\x1b[32m·\x1b[0m',
        forest: '\x1b[32;1m♣\x1b[0m',
        tundra: '\x1b[37;1m^\x1b[0m',
        desert: '\x1b[33m≋\x1b[0m'
    };
    console.clear();
    console.log(`World View (${startX}-${Math.min(startX + CHUNK_SIZE, world.width)}, ${startY}-${Math.min(startY + CHUNK_SIZE, world.height)}) of ${world.width}x${world.height}`);
    for (let y = startY; y < startY + CHUNK_SIZE && y < world.height; y++) {
        let row = '';
        for (let x = startX; x < startX + CHUNK_SIZE && x < world.width; x++) {
            row += biomeColors[world.biomes[x][y]] + ' ';
        }
        console.log(row);
    }
}
// Interactive navigation
async function exploreWorld(world) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let viewX = 0;
    let viewY = 0;
    function prompt() {
        renderWorldChunk(world, viewX, viewY);
        console.log("\nNavigate with WASD, Quit with Q");
    }
    prompt();
    rl.on('line', (input) => {
        switch (input.toLowerCase()) {
            case 'w':
                viewY = Math.max(0, viewY - 1);
                break;
            case 'a':
                viewX = Math.max(0, viewX - 1);
                break;
            case 's':
                viewY = Math.min(world.height - CHUNK_SIZE, viewY + 1);
                break;
            case 'd':
                viewX = Math.min(world.width - CHUNK_SIZE, viewX + 1);
                break;
            case 'q':
                rl.close();
                process.exit(0);
        }
        prompt();
    });
}
// Main execution
console.log(`Generating ${WORLD_SIZE}x${WORLD_SIZE} world...`);
const world = generateWorld(WORLD_SIZE, WORLD_SIZE, SEED);
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
exploreWorld(world);
