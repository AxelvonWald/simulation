import { createNoise2D } from 'simplex-noise';
import type { World } from '../types'; // Note: 'type' keyword for cleaner imports

// Seed conversion function
function stringToSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generateHeightmap(
  width: number,
  height: number,
  seed: string
): World['elevation'] { // Explicitly using the World type
  const numericSeed = stringToSeed(seed);
  const noise2D = createNoise2D(() => numericSeed);
  const elevation: number[][] = [];

  for (let x = 0; x < width; x++) {
    elevation[x] = [];
    for (let y = 0; y < height; y++) {
      const scale = 0.1;
      elevation[x][y] = (noise2D(x * scale, y * scale) + 1) / 2;
    }
  }
  return elevation;
}

