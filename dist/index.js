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
const config_1 = require("./config");
const fs = __importStar(require("fs"));
const WORLD_SIZE = 30;
const SEED = "tribal-sim-seed";
function generateWorld() {
    const elevationData = (0, terrain_1.generateHeightmap)(WORLD_SIZE, WORLD_SIZE, SEED);
    const biomes = (0, climate_1.assignBiomes)(elevationData.elevation);
    return (0, rivers_1.generateRivers)({
        width: WORLD_SIZE,
        height: WORLD_SIZE,
        elevation: elevationData.elevation,
        biomes,
        rivers: []
    }, config_1.WORLD_CONFIG.RIVER_COUNT);
}
const world = generateWorld();
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("World generation complete!");
