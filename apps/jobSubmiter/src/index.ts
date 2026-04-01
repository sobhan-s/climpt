import express from 'express';
import router from './routes/job.routes.js';
import { createRedisClient, env_config_variable, Redis } from '@climpt/config';

export const redis: Redis = createRedisClient();

const app = express();
app.use(express.json());
app.use('/', router);

app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'ok', service: 'service-a', redis: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', redis: 'disconnected' });
  }
});

app.listen(env_config_variable.PORT.MAIN_PORT, () => {
  console.log(
    `Job submitter listening on port ${env_config_variable.PORT.MAIN_PORT}`,
  );
});

process.on('SIGTERM', async () => {
  console.log('Job submitter service Shutting down...');
  await redis.quit();
  process.exit(0);
});
