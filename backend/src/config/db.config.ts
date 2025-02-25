import mongoose from 'mongoose';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Define connection strings with defaults for local Docker networking
const mongoURI: string = process.env.MONGO_URI || "";
const redisHost: string = process.env.REDIS_HOST || "";
const redisPort: number = parseInt(process.env.REDIS_PORT || "", 10);

/**
 * Connect to MongoDB using Mongoose.
 */
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Connect to Redis and return the client instance.
 */
export const connectRedis = async (): Promise<RedisClientType> => {
  const client: RedisClientType = createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));

  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }

  return client;
};
