import { generateHeightmap } from './simulation/world/terrain';
import { assignBiomes } from './simulation/world/climate';
import { World } from './simulation/types';
import * as fs from 'fs';
import readline from 'readline';

// Configuration
const WORLD_SIZE = 30;
const CHUNK_SIZE = 10;
const SEED = "large-world-seed";

// World generation function (must be defined or imported)
function generateWorld(width: number, height: number, seed: string): World {
  const elevation = generateHeightmap(width, height, seed);
  const biomes = assignBiomes(elevation);
  return { width, height, elevation, biomes };
}

// Visualization
function renderWorldChunk(world: World, startX: number, startY: number) {
  const biomeColors = {
    ocean: '\x1b[34m≈\x1b[0m',
    grassland: '\x1b[32m·\x1b[0m',
    forest: '\x1b[32;1m♣\x1b[0m',
    tundra: '\x1b[37;1m^\x1b[0m',
    desert: '\x1b[33m≋\x1b[0m'
  };

  console.clear();
  console.log(`World View (${startX}-${Math.min(startX+CHUNK_SIZE, world.width)}, ${startY}-${Math.min(startY+CHUNK_SIZE, world.height)}) of ${world.width}x${world.height}`);
  
  for (let y = startY; y < startY + CHUNK_SIZE && y < world.height; y++) {
    let row = '';
    for (let x = startX; x < startX + CHUNK_SIZE && x < world.width; x++) {
      row += biomeColors[world.biomes[x][y]] + ' ';
    }
    console.log(row);
  }
}

// Interactive navigation
async function exploreWorld(world: World) {
  const rl = readline.createInterface({
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
      case 'w': viewY = Math.max(0, viewY - 1); break;
      case 'a': viewX = Math.max(0, viewX - 1); break;
      case 's': viewY = Math.min(world.height - CHUNK_SIZE, viewY + 1); break;
      case 'd': viewX = Math.min(world.width - CHUNK_SIZE, viewX + 1); break;
      case 'q': rl.close(); process.exit(0);
    }
    prompt();
  });
}

// Main execution
console.log(`Generating ${WORLD_SIZE}x${WORLD_SIZE} world...`);
const world = generateWorld(WORLD_SIZE, WORLD_SIZE, SEED);
fs.writeFileSync('world.json', JSON.stringify(world, null, 2));
exploreWorld(world);