import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve('../../', '.env') });

export const env_config_variable = {
  PORT: {
    MAIN_PORT: parseInt(process.env.MAIN_PORT || '8000', 10),
  },
  ENVIORMENT: {
    DEV: process.env.DEV_ENV,
    PROD: process.env.PROD_ENV,
  },
  REDIS: {
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    REDIS_HOST: process.env.REDIS_HOST,
    URL: process.env.REDIS_URL!,
  },
};
