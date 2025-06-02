import express from 'express';
import { World } from './simulation/types';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Load your generated world
const worldData = fs.readFileSync('world.json', 'utf-8');
const world: World = JSON.parse(worldData);

// Serve static files
app.use(express.static('public'));

// API endpoint to get world data
app.get('/api/world', (req, res) => {
    res.json(world);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});