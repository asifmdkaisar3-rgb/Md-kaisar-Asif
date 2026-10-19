import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Serve public uploads
const uploadsDir = path.resolve(__dirname, 'public/uploads');
app.use('/uploads', express.static(uploadsDir));

// Mount API routes
app.use('/api', apiRouter);

// Serve production static build
const distDir = path.resolve(__dirname, 'dist');
app.use(express.static(distDir));

// Fallback to index.html for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shoyen Kaiser Asif Portfolio server running at http://0.0.0.0:${PORT}`);
});
