import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createRequire } from 'module';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Import backend database and router
const sequelize = require('./backend/config/database');
const eventRouter = require('./backend/router/eventRouter');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount Event RESTful API
  app.use('/api/events', eventRouter);

  // Sync sqlite database
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ SQLite database authenticated and synced for root server');
  } catch (err) {
    console.error('❌ Failed to sync SQLite DB:', err);
  }

  // Vite development middleware or static production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack app running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API endpoint accessible at http://0.0.0.0:${PORT}/api/events`);
  });
}

startServer();
