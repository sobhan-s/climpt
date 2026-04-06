// src/metrics.ts
import client from 'prom-client';

export const totalJobsSubmitted = new client.Gauge({
  name: 'total_jobs_submitted',
  help: 'Total jobs submitted',
});

export const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total jobs completed',
});

export const queueLengthGauge = new client.Gauge({
  name: 'queue_length',
  help: 'Current queue length',
});

export const register = client.register;
