import { redis } from './redis.js';

export async function getStats() {
  const queueLength = await redis.llen('job_queue');

  const totalSubmitted = Number(await redis.get('total_jobs_submitted')) || 0;
  let completed = 0;

  const keys = await redis.keys('job:*');

  for (const key of keys) {
    const status = await redis.hget(key, 'status');
    if (status === 'completed') completed++;
  }

  return {
    queueLength,
    totalSubmitted,
    totalCompleted: completed,
  };
}
