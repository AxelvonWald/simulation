import { generateHeightmap } from './simulation/world/terrain';
import { assignBiomes } from './simulation/world/climate';
import { generateRivers } from './simulation/world/rivers';
import { WORLD_CONFIG } from './config';
import { World } from './simulation/types';
import * as fs from 'fs';

const WORLD_SIZE = 30;
const SEED = "tribal-sim-seed";

function generateWorld(): World {
  const elevationData = generateHeightmap(WORLD_SIZE, WORLD_SIZE, SEED);
  const biomes = assignBiomes(elevationData.elevation);
  return generateRivers(
    {
      width: WORLD_SIZE,
      height: WORLD_SIZE,
      elevation: elevationData.elevation,
      biomes,
      rivers: []
    },
    WORLD_CONFIG.RIVER_COUNT
  );
}

const world = generateWorld();
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
console.log("World generation complete!");