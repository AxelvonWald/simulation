import { World } from '../types';

export function simulateFloods(world: World, rainfall: number): World {
  const flooded = Array(world.width)
    .fill(0)
    .map(() => Array(world.height).fill(false));

  world.rivers.forEach(river => {
    if (Math.random() < rainfall * 0.5) {
      const floodRadius = 1 + Math.floor(rainfall * 2);
      
      river.path.forEach(point => {
        for (let dx = -floodRadius; dx <= floodRadius; dx++) {
          for (let dy = -floodRadius; dy <= floodRadius; dy++) {
            const x = point.x + dx;
            const y = point.y + dy;
            
            if (x >= 0 && x < world.width && y >= 0 && y < world.height) {
              if (world.elevation[x][y] < 0.6) {
                flooded[x][y] = true;
              }
            }
          }
        }
      });
    }
  });

  return { 
    ...world, 
    flooded  // Now matches the updated World type
  };
}