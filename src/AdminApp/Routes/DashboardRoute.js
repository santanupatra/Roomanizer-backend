import express from 'express';
import DashboardController from '../Controllers/DashboardController';
// intializing express router
const router = express.Router();


// router.get('/dashboard', DashboardController.activeUsers);
router.get('/dashboard',DashboardController.activeCount);


export default router; 