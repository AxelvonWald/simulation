export const WORLD_CONFIG = {
  RIVER_COUNT: 5,
  MIN_RIVER_LENGTH: 8,
  RIVER_SOURCE_MIN_ELEV: 0.65,
  BASE_RAINFALL: 0.5,
  MAX_RIVER_ATTEMPTS: 25
} as const;  // Added 'as const' for type safety

export type WorldConfig = typeof WORLD_CONFIG;