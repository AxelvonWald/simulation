export type Biome = "ocean" | "grassland" | "forest" | "tundra" | "desert";
export type River = { path: { x: number; y: number }[] };

export type World = {
  width: number;
  height: number;
  elevation: number[][];
  biomes: Biome[][];
  rivers: River[];
};