import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4040;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
