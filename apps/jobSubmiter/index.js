import express from 'express';
import { Queue } from 'bullmq';
import { redisConfig, QUEUE_NAME } from '@climpt/config';

const app = express();
app.use(express.json());

const jobQueue = new Queue(QUEUE_NAME, { connection: redisConfig });

app.post('/submit', async (req, res) => {
  try {
    const job = await jobQueue.add('cpu-task', { timestamp: Date.now() });
    res.json({ jobId: job.id, status: 'submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobQueue.getJob(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const state = await job.getState();
    const result = job.returnvalue;
    res.json({ id, state, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Job Submitter listening on port ${PORT}`);
});
