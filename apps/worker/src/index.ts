import express from 'express';
import { startWorker } from './worker.js';
import { register } from './metrices.js';
import { redis } from './redis.js';

const app = express();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get('/health', async (_req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'ok', service: 'worker' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Worker metrics server running on ${PORT}`);
  startWorker();
});
