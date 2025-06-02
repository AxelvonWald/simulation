import { World, River } from '../types';
import { WORLD_CONFIG } from '../../config';  // Added import

export function generateRivers(world: World, count: number): World {
  const rivers: River[] = [];
  let attempts = 0;

  // Find all ocean tiles
  const oceanTiles: {x: number, y: number}[] = [];
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      if (world.biomes[x][y] === 'ocean') oceanTiles.push({x, y});
    }
  }

  while (rivers.length < count && attempts++ < WORLD_CONFIG.MAX_RIVER_ATTEMPTS) {
    // Find random high point
    let x = Math.floor(Math.random() * world.width);
    let y = Math.floor(Math.random() * world.height);
    while (world.elevation[x][y] < WORLD_CONFIG.RIVER_SOURCE_MIN_ELEV) {
      x = Math.floor(Math.random() * world.width);
      y = Math.floor(Math.random() * world.height);
    }

    const river: River = { path: [{x, y}] };
    let current = {x, y};
    let steps = 0;

    while (steps++ < world.width * 2) {
      // Find steepest downhill neighbor
      let lowestElev = world.elevation[current.x][current.y];
      let next = {...current};

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = current.x + dx;
          const ny = current.y + dy;
          
          if (nx >= 0 && nx < world.width && ny >= 0 && ny < world.height) {
            const elev = world.elevation[nx][ny];
            if (elev < lowestElev) {
              lowestElev = elev;
              next = {x: nx, y: ny};
            }
          }
        }
      }

      // Stop if reached ocean
      if (world.biomes[next.x][next.y] === 'ocean') {
        river.path.push(next);
        break;
      }

      // Stop if no downhill
      if (next.x === current.x && next.y === current.y) break;

      river.path.push(next);
      current = next;
    }

    // Only keep rivers that meet minimum length
    if (river.path.length >= WORLD_CONFIG.MIN_RIVER_LENGTH) {
      rivers.push(river);
    }
  }

  return { ...world, rivers };
}