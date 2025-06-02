import express from 'express';
import { World } from '@simulation/types';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/world', (req, res) => {
    try {
        const worldData = fs.readFileSync('world.json', 'utf-8');
        const world: World = JSON.parse(worldData);
        res.json(world);
    } catch (error) {
        res.status(500).json({ error: "World not generated yet" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});