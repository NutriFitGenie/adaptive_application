import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectMongoDB, connectRedis } from './src/config/db.config';
import workoutRoutes from './src/routes/workoutRoutes';
import {seedWorkouts} from './src/services/workoutInitalizer'
import { swaggerUi, swaggerSpec } from './swagger';
import config from './src/config/env.config';
import recommenderRoutes from './src/routes/FoodRecommenderRoute';
import weeklyUpdates from './src/routes/weeklyUpdateRoutes';
import userRoutes from './src/routes/userRoutes';

const envPath = path.resolve(__dirname, '.env');
// console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});


// user routes
app.use('/api/users', userRoutes);

// user routes
app.use('/api/workout', workoutRoutes);
app.use('/api/workoutInit', seedWorkouts);


app.use('/api/food-recommender', recommenderRoutes);
app.use('/api/weeklyUpdates', weeklyUpdates);
// Mount Swagger docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Db connection 
(async () => {
  try {
    await connectMongoDB();
    const redisClient = await connectRedis();

    // Start your server or additional application logic here
    console.log('All services connected. Starting the server...');
  } catch (error) {
    console.error('Error connecting to services:', error);
    process.exit(1);
  }
})();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
