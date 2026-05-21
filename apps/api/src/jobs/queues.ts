import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const registrationConfirmationQueue = new Queue('registration-confirmation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});
