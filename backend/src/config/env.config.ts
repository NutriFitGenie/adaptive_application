import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',

  // MongoDB Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/adap-db',

  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  JWT_TOKEN_EXPIRE: process.env.JWT_TOKEN_EXPIRE || '24h',
};

export default config;