import { Biome } from '../types';

export function assignBiomes(elevation: number[][]): Biome[][] {
  const biomes: Biome[][] = [];
  
  for (let x = 0; x < elevation.length; x++) {
    biomes[x] = [];
    for (let y = 0; y < elevation[x].length; y++) {
      const h = elevation[x][y];
      
      // More natural thresholds with blending
      if (h < 0.4) {
        // Ocean with rare coastal exceptions
        biomes[x][y] = (h > 0.38 && Math.random() > 0.8) ? 'grassland' : 'ocean';
      } 
      else if (h < 0.5) {
        // Coastline blend
        biomes[x][y] = Math.random() > h * 1.5 ? 'grassland' : 'ocean';
      }
      else if (h < 0.65) {
        // Grassland with occasional forests
        biomes[x][y] = Math.random() > 0.7 ? 'forest' : 'grassland';
      }
      else if (h < 0.8) {
        // Forests with mountain transitions
        const forestChance = 1 - (h - 0.65) / 0.15;
        biomes[x][y] = Math.random() < forestChance ? 'forest' : 'tundra';
      }
      else {
        // Mountains
        biomes[x][y] = 'tundra';
      }
    }
  }
  return biomes;
}