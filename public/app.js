const BIOMES = {
  ocean: { symbol: '≈', color: '#1a7bb9', name: 'Ocean' },
  grassland: { symbol: '·', color: '#7cba6a', name: 'Grassland' },
  forest: { symbol: '♣', color: '#2a5a1c', name: 'Forest' },
  tundra: { symbol: '△', color: '#e8e8e8', name: 'Tundra' },
  desert: { symbol: '≋', color: '#e3c688', name: 'Desert' }
};

function createLegend() {
  const container = document.getElementById('legend-items');
  
  // Biome legend items
  Object.values(BIOMES).forEach(biome => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="legend-color" style="background: ${biome.color}"></div>
      <span>${biome.symbol} ${biome.name}</span>
    `;
    container.appendChild(item);
  });

  // River and flood items
  const specialItems = [
    { symbol: '≈', color: '#1a7bb9', name: 'River', textColor: 'white' },
    { symbol: '', color: 'rgba(26, 123, 185, 0.3)', name: 'Flooded' }
  ];

  specialItems.forEach(item => {
    const elem = document.createElement('div');
    elem.className = 'legend-item';
    elem.innerHTML = `
      <div class="legend-color" style="
        background: ${item.color};
        ${item.textColor ? `color: ${item.textColor};` : ''}
      ">${item.symbol}</div>
      <span>${item.name}</span>
    `;
    container.appendChild(elem);
  });
}

fetch('/api/world')
  .then(response => response.json())
  .then(world => {
    createLegend();
    
    const container = document.getElementById('world-container');
    container.style.gridTemplateColumns = `repeat(${world.width}, 20px)`;

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        const tile = document.createElement('div');
        const biome = world.biomes[x][y];
        const isRiver = world.rivers?.some(r => r.path.some(p => p.x === x && p.y === y));
        const isFlooded = world.flooded?.[x]?.[y];

        tile.className = `tile ${biome}`;
        tile.textContent = isRiver ? '≈' : BIOMES[biome].symbol;
        
        if (isFlooded) {
          tile.style.backgroundColor = `color-mix(in srgb, ${BIOMES[biome].color} 60%, #1a7bb9 40%)`;
          tile.style.opacity = '0.8';
        } else if (isRiver) {
          tile.style.color = '#1a7bb9';
          tile.style.fontWeight = 'bold';
        }

        container.appendChild(tile);
      }
    }
  });