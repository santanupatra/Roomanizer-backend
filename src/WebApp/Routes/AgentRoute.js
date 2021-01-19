import express from 'express';
import AgentController from '../Controllers/AgentController';
import upload from '../../../config/FileUpload';

// intializing express router
const router = express.Router();
router.post('/AddAgentProperty',upload.uploadRoomImage,AgentController.AddAgentProperty);
router.put('/updateAgentProperty/:userId', upload.uploadRoomImage,AgentController.updateAgentProperty);
router.get('/agentt/:userId',AgentController.listProperty);
router.get('/agent/:userId',AgentController.listAllAgent);
export default router;