const QUEUE_KEYS = {
  JOB_QUEUE: 'jobs:queue',
  JOB_RESULTS: 'jobs:results',
  JOB_STATUS: 'jobs:status',
  STATS_SUBMITTED: 'stats:submitted',
  STATS_COMPLETED: 'stats:completed',
  STATS_ERRORS: 'stats:errors',
  STATS_TOTAL_TIME: 'stats:total_time',
};

const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const JOB_TYPES = {
  PRIME: 'prime',
  BCRYPT: 'bcrypt',
  SORT: 'sort',
};

export { QUEUE_KEYS, JOB_STATUS, JOB_TYPES };
