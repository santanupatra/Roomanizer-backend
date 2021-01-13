import express from 'express';
import AgentController from '../Controllers/AgentController';
// intializing express router
const router = express.Router();
router.get('/agent',AgentController.listAllAgent);
export default router;