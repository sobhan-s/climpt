import { redis } from './redis.js';
import { calculatePrimes } from './tasks/prime.task.js';
import { sort } from './tasks/sort.task.js';
import { bcryptHash } from './tasks/hash.task.js';
import { jobsProcessed, jobErrors, jobProcessingTime } from './metrices.js';

type Job = {
  id: string;
  task: string;
  value: number;
};

export async function startWorker() {
  console.log('Worker started...');

  while (true) {
    try {
      const jobData = await redis.brpop('job_queue', 0);

      if (!jobData) continue;

      const job: Job = JSON.parse(jobData[1]);

      const endTimer = jobProcessingTime.startTimer();

      await redis.hset(`job:${job.id}`, { status: 'processing' });

      let result: any;

      switch (job.task) {
        case 'hash':
          result = bcryptHash(job.value);
          break;

        case 'prime':
          result = calculatePrimes(job.value);
          break;

        case 'sort':
          result = sort(job.value);
          break;

        default:
          throw new Error('Unknown task');
      }

      await redis.hset(`job:${job.id}`, {
        status: 'completed',
        result: JSON.stringify(result).slice(0, 500),
      });

      jobsProcessed.inc();
      endTimer();
    } catch (err) {
      console.error('Worker error:', err);
      jobErrors.inc();
    }
  }
}
