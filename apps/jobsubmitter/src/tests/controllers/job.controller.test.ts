import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as jobService from '../../services/job.service.js';
import * as controller from '../../controller/job.controller.js';
import client from 'prom-client';

vi.mock('uuid', () => ({
  v4: () => 'testId-123',
}));

vi.mock('../../services/job.service.js', () => ({
  enqueueJob: vi.fn(),
  getJobStatus: vi.fn(),
  isJobExist: vi.fn(),
}));

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.set = vi.fn().mockReturnValue(res);
  return res;
};

describe('Job Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit a job successfully', async () => {
    const req: any = {
      body: { task: 'prime', value: 100 },
    };
    const res = mockResponse();

    await controller.submit(req, res);

    expect(jobService.enqueueJob).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      id: 'testId-123',
      message: 'job queued',
    });
  });

  it('should handle submit error', async () => {
    vi.mocked(jobService.enqueueJob).mockRejectedValue(new Error('fail'));

    const req: any = { body: {} };
    const res = mockResponse();

    await controller.submit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'failed to submit job',
    });
  });

  it('should return job status if exists', async () => {
    vi.mocked(jobService.isJobExist).mockResolvedValue(true);
    vi.mocked(jobService.getJobStatus).mockResolvedValue({
      status: 'done',
    });

    const req: any = { params: { id: 'testId' } };
    const res = mockResponse();

    await controller.status(req, res);

    expect(jobService.getJobStatus).toHaveBeenCalledWith('testId');
    expect(res.json).toHaveBeenCalledWith({ status: 'done' });
  });

  it('should return 404 if job not found', async () => {
    vi.mocked(jobService.isJobExist).mockResolvedValue(false);

    const req: any = { params: { id: 'testId' } };
    const res = mockResponse();

    await controller.status(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'job not found',
    });
  });

  it('should handle status error', async () => {
    vi.mocked(jobService.isJobExist).mockRejectedValue(new Error('fail'));

    const req: any = { params: { id: 'testId' } };
    const res = mockResponse();

    await controller.status(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'failed to fetch status',
    });
  });

  it('should return metrics', async () => {
    const req: any = {};
    const res = mockResponse();

    await controller.metrics(req, res);

    expect(res.set).toHaveBeenCalledWith(
      'Content-Type',
      client.register.contentType,
    );
    expect(res.send).toHaveBeenCalled();
  });
});
