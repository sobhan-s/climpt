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
    let jobData;

    try {
      jobData = await redis.brpop('job_queue', 0);
      console.log('Raw Redis response:', jobData);
    } catch (err) {
      console.error('BRPOP failed:', err);
      continue;
    }

    try {
      if (!jobData) continue;

      const job: Job = JSON.parse(jobData[1]);

      // console.log('Received job:', job);

      const endTimer = jobProcessingTime.startTimer();

      await redis.hset(`job:${job.id}`, { status: 'processing' });

      let result: any;

      const taskType = job.task?.trim().toLowerCase();

      switch (taskType) {
        case 'hash':
          result = await bcryptHash(job.value);
          break;

        case 'prime':
          result = calculatePrimes(job.value);
          break;

        case 'sort':
          result = sort(job.value);
          break;

        default:
          throw new Error(`Unknown task: ${taskType}`);
      }

      await redis.hset(`job:${job.id}`, {
        status: 'completed',
        result: JSON.stringify(result).slice(0, 500),
      });

      jobsProcessed.inc();
      endTimer();
    } catch (err) {
      console.error('Worker processing error:', err);
      jobErrors.inc();
    }
  }
}
