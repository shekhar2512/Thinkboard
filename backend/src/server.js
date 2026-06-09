import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from "./config/db.js";

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

//our simple custom middleware to log the request method and URL
// app.use((req,res,next)=>{
//     console.log(`req method is ${req.method} & req URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

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

// Connection string backup: mongodb+srv://shekharbaheliya4000_db_user:XBxmKo5TvVP5Kc7h@cluster0.n4sehhu.mongodb.net/?appName=Cluster0