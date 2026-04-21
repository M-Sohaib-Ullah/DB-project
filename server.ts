import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import db from './server/db.js'; // The TSX runner will seamlessly map the .js import to .ts

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  app.get('/api/heroes', (req, res) => {
    const term = req.query.q ? `%${req.query.q}%` : '%';
    const teamId = req.query.team;
    const universe = req.query.universe;
    
    let query = `
      SELECT h.*, group_concat(t.name) as teams
      FROM heroes h
      LEFT JOIN hero_teams ht ON h.id = ht.hero_id
      LEFT JOIN teams t ON ht.team_id = t.id
      WHERE (h.name LIKE @term OR h.universe LIKE @term)
    `;
    
    const params: any = { term };

    if (teamId && teamId !== 'all') {
      query += ` AND h.id IN (SELECT hero_id FROM hero_teams WHERE team_id = @teamId)`;
      params.teamId = teamId;
    }

    if (universe && universe !== 'all') {
      query += ` AND h.universe = @universe`;
      params.universe = universe;
    }

    query += ` GROUP BY h.id`;

    const stmt = db.prepare(query);
    const heroes = stmt.all(params);
    const parsed = heroes.map((h: any) => ({ ...h, teams: h.teams ? h.teams.split(',') : [] }));
    return res.json(parsed);
  });

  app.get('/api/universes', (req, res) => {
    const universes = db.prepare('SELECT DISTINCT universe FROM heroes WHERE universe IS NOT NULL AND universe != "" ORDER BY universe').all();
    res.json(universes.map((u: any) => u.universe));
  });

  app.get('/api/teams', (req, res) => {
    const teams = db.prepare('SELECT * FROM teams').all();
    res.json(teams);
  });

  app.get('/api/heroes/:id', (req, res) => {
    const stmt = db.prepare(`
      SELECT h.*, group_concat(t.name) as teams
      FROM heroes h
      LEFT JOIN hero_teams ht ON h.id = ht.hero_id
      LEFT JOIN teams t ON ht.team_id = t.id
      WHERE h.id = ?
      GROUP BY h.id
    `);
    const hero: any = stmt.get(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Not found' });
    
    hero.teams = hero.teams ? hero.teams.split(',') : [];
    res.json(hero);
  });

  // --- Vite Middleware/Static ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
