import express from 'express';
import AgentController from '../Controllers/AgentController';
import upload from '../../../config/FileUpload';

// intializing express router
const router = express.Router();
router.post('/agentProperty',upload.uploadRoomImage,AgentController.AddAgentProperty);
router.put('/agentProperty/:roomId', upload.uploadRoomImage,AgentController.updateAgentProperty);
router.get('/agentProperty/:roomId', AgentController.listpropertyDetails);
router.get('/agentProperty', AgentController.listProperty);
router.delete('/agentProperty/:roomId/:imageId',AgentController.deleteRoomImage);
router.put('/agentProperty/status/:roomId',AgentController.statusChange);
router.post('/agentProperty/interest',AgentController.interestAdd);
router.get('/agentProperty/interest/:roomId',AgentController.interestUserList);

export default router;