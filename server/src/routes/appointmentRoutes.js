import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getLiveQueue
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

export default function appointmentRoutes(io) {
  const router = express.Router();

  // Public live queue route for kiosk/displays
  router.get('/live-queue', getLiveQueue);

  // Authenticated routes
  router.use(protect);

  router.post('/', (req, res) => createAppointment(req, res, io));
  router.get('/', getAppointments);
  router.get('/:id', getAppointmentById);
  router.patch('/:id/status', authorize('admin', 'doctor', 'receptionist'), (req, res) =>
    updateAppointmentStatus(req, res, io)
  );
  router.patch('/:id/reschedule', (req, res) => rescheduleAppointment(req, res, io));
  router.patch('/:id/cancel', (req, res) => cancelAppointment(req, res, io));

  return router;
}
