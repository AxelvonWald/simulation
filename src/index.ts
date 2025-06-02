import { generateHeightmap } from './simulation/world/terrain';
import { assignBiomes } from './simulation/world/climate';
import { generateRivers } from './simulation/world/rivers';
import { simulateFloods } from './simulation/features/floods';
import { WORLD_CONFIG } from './config';
import * as fs from 'fs';
import { World } from './simulation/types';

const WORLD_SIZE = 30;
const SEED = "tribal-sim-seed-" + Math.random().toString(36).slice(2);

function debugWorld(world: World) {
  console.log("World Stats:");
  console.log(`- Ocean Tiles: ${
    world.biomes.flat().filter((b: Biome) => b === 'ocean').length
  }`);
  console.log(`- High Points (>0.7): ${
    world.elevation.flat().filter((e: number) => e > 0.7).length
  }`);
}

function generateWorld(): World {
  console.log("Generating heightmap...");
  const { elevation } = generateHeightmap(WORLD_SIZE, WORLD_SIZE, SEED);
  
  console.log("Assigning biomes...");
  const biomes = assignBiomes(elevation);
  
  console.log("Generating rivers...");
  const worldWithRivers = generateRivers(
    {
      width: WORLD_SIZE,
      height: WORLD_SIZE,
      elevation,
      biomes,
      rivers: []
    },
    WORLD_CONFIG.RIVER_COUNT
  );

  console.log(`Generated ${worldWithRivers.rivers.length} rivers`);
  worldWithRivers.rivers.forEach((r, i) => {
    const end = r.path[r.path.length-1];
    console.log(` River ${i}: ${r.path.length} tiles, ends at ${worldWithRivers.biomes[end.x][end.y]}`);
  });

  console.log("Simulating floods...");
  const worldWithFloods = simulateFloods(
    worldWithRivers,
    WORLD_CONFIG.BASE_RAINFALL
  );

  return worldWithFloods;
}

console.log("Starting world generation...");
const world = generateWorld();
debugWorld(world);

fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("World saved to world.json");