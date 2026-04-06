import express from 'express';
import { startWorker } from './worker.js';
import { register } from './metrices.js';
import { redis } from './redis.js';

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get('/health', async (req, res) => {
  res.json({ status: 'ok', service: 'worker' });
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Worker metrics server running on ${PORT}`);
  startWorker();
});
