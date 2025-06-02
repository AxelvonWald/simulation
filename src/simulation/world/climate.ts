import { Biome } from '../types';

export function assignBiomes(elevation: number[][]): Biome[][] {
  const biomes: Biome[][] = [];
  
  for (let x = 0; x < elevation.length; x++) {
    biomes[x] = [];
    for (let y = 0; y < elevation[x].length; y++) {
      const h = elevation[x][y];
      
      // Ocean with gradual coastline
      if (h < 0.4) {
        biomes[x][y] = Math.random() < (h/0.4)*0.8 ? 'grassland' : 'ocean';
      } 
      // Grassland with forest patches
      else if (h < 0.65) {
        biomes[x][y] = Math.random() > 0.7 - (h-0.4)*0.02 ? 'forest' : 'grassland';
      }
      // Mountain transitions
      else if (h < 0.8) {
        biomes[x][y] = Math.random() > (h-0.65)/0.15 ? 'forest' : 'tundra';
      }
      // High mountains
      else {
        biomes[x][y] = 'tundra';
      }
    }
  }
  
  return biomes;
}