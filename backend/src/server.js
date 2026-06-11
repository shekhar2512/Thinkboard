import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
// Use public DNS servers for Atlas SRV lookups when the local resolver is unavailable.
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from "./config/db.js";

import { rateLimit } from 'express-rate-limit';

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// CORS middleware
app.use(cors());
app.use(express.json());

// Trust proxy for rate limiter to work correctly behind Render
app.set('trust proxy', 1);

// Rate limiting middleware to protect endpoints (Chapter 6)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

app.use("/api", limiter);

// API routes
app.use("/api/notes", notesRoutes);

// Simple root route to show service status
app.get('/', (req, res) => {
  res.send('Thinkboard API running. Use /api/notes for the notes endpoints.');
});

const start = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};
start();

export default app;

// Connection string backup: mongodb+srv://shekharbaheliya4000_db_user:XBxmKo5TvVP5Kc7h@cluster0.n4sehhu.mongodb.net/?appName=Cluster0