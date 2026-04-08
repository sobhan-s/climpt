import { describe, it, expect, vi } from 'vitest';
import { startWorker } from '../../worker.js';
import { redis } from '../../redis.js';

vi.mock('../../redis.js', () => ({
  redis: {
    brpop: vi.fn(),
    hset: vi.fn(),
    incr: vi.fn(),
  },
}));

vi.mock('../../tasks/prime.task.js', () => ({
  calculatePrimes: vi.fn(() => [2, 3, 5]),
}));

vi.mock('../../tasks/sort.task.js', () => ({
  sort: vi.fn(() => [1, 2, 3]),
}));

vi.mock('../../tasks/hash.task.js', () => ({
  bcryptHash: vi.fn(async () => 'hashed'),
}));

vi.mock('../../metrices.js', () => ({
  jobsProcessed: { inc: vi.fn() },
  jobErrors: { inc: vi.fn() },
  jobProcessingTime: {
    startTimer: () => () => {},
  },
}));

describe('Worker (simple test)', () => {
  it('should process one job', async () => {
    vi.mocked(redis.brpop)
      .mockResolvedValueOnce([
        'job_queue',
        JSON.stringify({
          id: '1',
          task: 'prime',
          value: 10,
        }),
      ])
      .mockResolvedValue(null as any);

    const workerPromise = startWorker();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(redis.hset).toHaveBeenCalledWith('job:1', {
      status: 'processing',
    });

    expect(redis.hset).toHaveBeenCalledWith(
      'job:1',
      expect.objectContaining({
        status: 'completed',
      }),
    );

    expect(redis.incr).toHaveBeenCalledWith('total_jobs_completed');
  });
});
