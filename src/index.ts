import { generateHeightmap } from './simulation/world/terrain';
import { assignBiomes } from './simulation/world/climate';
import { World } from './simulation/types';

// Generate the world
function generateWorld(width: number, height: number, seed: string): World {
  const elevation = generateHeightmap(width, height, seed);
  const biomes = assignBiomes(elevation);
  return { width, height, elevation, biomes };
}

// Numerical visualization
function renderElevationNumbers(world: World) {
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
function renderBiomes(world: World) {
  const biomeSymbols: Record<string, string> = {
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
import fs from 'fs';
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("\nWorld saved to world.json");