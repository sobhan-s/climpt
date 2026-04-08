import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../../services/job.service.js';

vi.mock('../../index.js', () => ({
  redis: {
    lpush: vi.fn(),
    hset: vi.fn(),
    incr: vi.fn(),
    hgetall: vi.fn(),
  },
}));

import { redis } from '../../index.js';

describe('Job Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enqueue job correctly', async () => {
    const job = {
      id: '1',
      task: 'prime',
      value: 100,
      createdAt: 123456,
    };

    await service.enqueueJob(job);

    expect(redis.lpush).toHaveBeenCalledWith('job_queue', JSON.stringify(job));

    expect(redis.hset).toHaveBeenCalledWith(`job:1`, {
      status: 'queued',
      task: 'prime',
      value: '100',
      createdAt: '123456',
    });

    expect(redis.incr).toHaveBeenCalledWith('total_jobs_submitted');
  });

  it('should throw error if redis fails', async () => {
    vi.mocked(redis.lpush).mockRejectedValue(new Error('redis error'));

    const job = {
      id: '1',
      task: 'prime',
      value: 100,
      createdAt: 123456,
    };

    await expect(service.enqueueJob(job)).rejects.toThrow('redis error');
  });

  it('should return job status', async () => {
    vi.mocked(redis.hgetall).mockResolvedValue({
      status: 'done',
    });

    const result = await service.getJobStatus('1');

    expect(redis.hgetall).toHaveBeenCalledWith('job:1');
    expect(result).toEqual({ status: 'done' });
  });
});
