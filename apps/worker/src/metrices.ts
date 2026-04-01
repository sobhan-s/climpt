import client from 'prom-client';

export const jobsProcessed = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total jobs processed successfully',
});

export const jobErrors = new client.Counter({
  name: 'job_errors_total',
  help: 'Total job processing errors',
});

export const jobProcessingTime = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Time taken to process jobs',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const register = client.register;
