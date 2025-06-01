export type Biome = "ocean" | "forest" | "desert" | "tundra" | "grassland";

export type World = {
  width: number;
  height: number;
  elevation: number[][];
  biomes: Biome[][];
};