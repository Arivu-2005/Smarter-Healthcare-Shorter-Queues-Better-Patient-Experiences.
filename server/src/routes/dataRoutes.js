import express from 'express';
import {
  getDoctors,
  getDepartments,
  createDepartment,
  getPatients,
  getHospitalStats
} from '../controllers/dataController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public doctor discovery and departments
router.get('/doctors', getDoctors);
router.get('/departments', getDepartments);

// Protected routes
router.use(protect);
router.get('/stats', authorize('admin', 'receptionist'), getHospitalStats);
router.get('/patients', authorize('admin', 'doctor', 'receptionist'), getPatients);
router.post('/departments', authorize('admin'), createDepartment);

export default router;
