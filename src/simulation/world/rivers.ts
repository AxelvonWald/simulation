import { World, River } from '../types';

export function generateRivers(world: World, count: number): World {
  const rivers: River[] = [];
  const WATER_LEVEL = 0.4;

  for (let i = 0; i < count; i++) {
    let x = Math.floor(Math.random() * (world.width - 2)) + 1;
    let y = Math.floor(Math.random() * (world.height - 2)) + 1;

    while (world.elevation[x][y] < 0.8) {
      x = Math.floor(Math.random() * (world.width - 2)) + 1;
      y = Math.floor(Math.random() * (world.height - 2)) + 1;
    }

    const river: River = { path: [] };
    let currentX = x;
    let currentY = y;
    let steps = 0;

    while (steps++ < world.width * 2) {
      river.path.push({ x: currentX, y: currentY });
      if (world.elevation[currentX][currentY] < WATER_LEVEL) break;

      let nextX = currentX;
      let nextY = currentY;
      let lowest = world.elevation[currentX][currentY];

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = currentX + dx;
          const ny = currentY + dy;
          if (nx >= 0 && nx < world.width && ny >= 0 && ny < world.height) {
            const elev = world.elevation[nx][ny];
            if (elev < lowest) {
              lowest = elev;
              nextX = nx;
              nextY = ny;
            }
          }
        }
      }

      if (nextX === currentX && nextY === currentY) break;
      currentX = nextX;
      currentY = nextY;
    }

    if (river.path.length > 5) {
      rivers.push(river);
    }
  }

  return { ...world, rivers };
}