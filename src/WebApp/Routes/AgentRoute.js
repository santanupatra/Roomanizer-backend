import express from 'express';
import AgentController from '../Controllers/AgentController';
import upload from '../../../config/FileUpload';

// intializing express router
const router = express.Router();
router.post('/AddAgentProperty',upload.uploadRoomImage,AgentController.AddAgentProperty);
router.get('/agent/:userId',AgentController.listProperty);
router.get('/agent',AgentController.listAllAgent);
export default router;