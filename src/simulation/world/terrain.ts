import { createNoise2D } from 'simplex-noise';

function stringToSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generateHeightmap(width: number, height: number, seed: string) {
  const noise2D = createNoise2D(() => stringToSeed(seed));
  const elevation: number[][] = [];

  for (let x = 0; x < width; x++) {
    elevation[x] = [];
    for (let y = 0; y < height; y++) {
      const scale = 0.1;
      elevation[x][y] = (noise2D(x * scale, y * scale) + 1) / 2;
    }
  }

  return {
    elevation,
    minElevation: Math.min(...elevation.flat()),
    maxElevation: Math.max(...elevation.flat())
  };
}