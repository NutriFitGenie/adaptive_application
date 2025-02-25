import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectMongoDB, connectRedis } from './src/config/db.config';
import userRoutes from './src/routes/userRoutes';
import { swaggerUi, swaggerSpec } from './swagger';
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});


// user routes
app.use('/api/users', userRoutes);

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
