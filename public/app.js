const BIOMES = {
  ocean: { symbol: '≈', color: '#1a7bb9', name: 'Ocean' },
  grassland: { symbol: '·', color: '#7cba6a', name: 'Grassland' },
  forest: { symbol: '♣', color: '#2a5a1c', name: 'Forest' },
  tundra: { symbol: '△', color: '#e8e8e8', name: 'Tundra' },
  desert: { symbol: '≋', color: '#e3c688', name: 'Desert' }
};

function isRiverTile(x, y, world) {
  return world.rivers.some(river => 
    river.path.some(p => p.x === x && p.y === y)
  );
}

fetch('/api/world')
  .then(response => response.json())
  .then(world => {
    const container = document.getElementById('world-container');
    container.style.gridTemplateColumns = `repeat(${world.width}, 20px)`;

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        const tile = document.createElement('div');
        const biome = world.biomes[x][y];
        const isRiver = isRiverTile(x, y, world);

        tile.className = `tile ${biome}`;
        tile.textContent = isRiver ? '≈' : BIOMES[biome].symbol;
        tile.title = `X:${x} Y:${y} ${BIOMES[biome].name}`;

        if (isRiver) {
          tile.style.color = '#1a7bb9';
          tile.style.fontWeight = 'bold';
        }

        container.appendChild(tile);
      }
    }

    // Create legend
    const legend = document.getElementById('legend-items');
    Object.values(BIOMES).forEach(biome => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <div class="legend-color" style="background: ${biome.color}"></div>
        <span>${biome.symbol} ${biome.name}</span>
      `;
      legend.appendChild(item);
    });

    // Add river legend item
    const riverItem = document.createElement('div');
    riverItem.className = 'legend-item';
    riverItem.innerHTML = `
      <div class="legend-color" style="background: #1a7bb9"></div>
      <span>≈ River</span>
    `;
    legend.appendChild(riverItem);
  });