import express from 'express';
import { getStats } from './stats.js';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLengthGauge,
  register,
} from './metrices.js';

const app = express();

app.get('/stats', async (_req, res) => {
  const stats = await getStats();

  res.json(stats);
});

app.get('/metrics', async (_req, res) => {
  const stats = await getStats();

  totalJobsSubmitted.set(stats.totalSubmitted);
  totalJobsCompleted.set(stats.totalCompleted);
  queueLengthGauge.set(stats.queueLength);

  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'stats' });
});

app.listen(8002, () => {
  console.log('Stats service running on 8002');
});
