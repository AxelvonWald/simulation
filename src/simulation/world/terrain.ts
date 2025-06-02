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
      // Multi-octave noise with domain warping
      let value = 0;
      let amplitude = 1;
      let frequency = 0.01;
      let totalAmplitude = 0;

      // Base noise (large continents)
      const nx = x * frequency;
      const ny = y * frequency;
      value += noise2D(nx, ny) * amplitude;
      totalAmplitude += amplitude;

      // Medium details
      amplitude *= 0.5;
      frequency *= 2;
      value += noise2D(x * frequency + value * 2, y * frequency + value * 2) * amplitude;
      totalAmplitude += amplitude;

      // Fine details
      amplitude *= 0.25;
      frequency *= 3;
      value += noise2D(x * frequency, y * frequency) * amplitude;
      totalAmplitude += amplitude;

      // Normalize and curve
      elevation[x][y] = Math.pow(
        (value / totalAmplitude + 1) / 2,
        1.5 // Makes lowlands flatter and mountains sharper
      );
    }
  }

  return {
    elevation,
    minElevation: Math.min(...elevation.flat()),
    maxElevation: Math.max(...elevation.flat())
  };
}