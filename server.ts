import { app } from './app.js';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';

async function startServer() {
  const PORT = 3000;
  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const viteMod = 'vi' + 'te';
    const { createServer: createViteServer } = await import(viteMod /* @vite-ignore */);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nova Music Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
