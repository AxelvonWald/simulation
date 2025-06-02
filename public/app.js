// Biome definitions
const BIOMES = {
    ocean: { symbol: '≈', color: '#1a7bb9', name: 'Ocean' },
    grassland: { symbol: '·', color: '#7cba6a', name: 'Grassland' },
    forest: { symbol: '♣', color: '#2a5a1c', name: 'Forest' },
    tundra: { symbol: '△', color: '#e8e8e8', name: 'Tundra' },
    desert: { symbol: '≋', color: '#e3c688', name: 'Desert' }
};

// Create legend
function createLegend() {
    const container = document.getElementById('legend-items');
    
    Object.entries(BIOMES).forEach(([key, biome]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = biome.color;
        
        const label = document.createElement('span');
        label.textContent = `${biome.symbol} ${biome.name}`;
        
        item.appendChild(colorBox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

// Load and render world
fetch('/api/world')
    .then(response => response.json())
    .then(world => {
        createLegend();
        
        const container = document.getElementById('world-container');
        container.style.gridTemplateColumns = `repeat(${world.width}, 20px)`;
        
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                const biome = world.biomes[x][y];
                const tile = document.createElement('div');
                tile.className = `tile ${biome}`;
                tile.textContent = BIOMES[biome].symbol;
                tile.title = `X:${x} Y:${y}\nElevation: ${world.elevation[x][y].toFixed(2)}\nBiome: ${BIOMES[biome].name}`;
                container.appendChild(tile);
            }
        }
    });