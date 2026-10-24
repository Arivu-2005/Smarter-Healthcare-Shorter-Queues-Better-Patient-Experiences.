import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_hospital_db';

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_department', (dept) => {
    socket.join(dept);
    console.log(`[Socket.IO] Client ${socket.id} joined ${dept}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'Smart Hospital Appointment & Queue System'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes(io));
app.use('/api', dataRoutes);

// Database Connection & Server Launch
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully to ' + MONGO_URI);
    server.listen(PORT, () => {
      console.log(`[Hospital Server] Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB Error]', err.message);
  });
