import express from 'express';
import RoomController from '../Controllers/RoomController';
// intializing express router
const router = express.Router();

router.post('/room', RoomController.add);
router.get('/room', RoomController.listAll);
//router.get('/dashboard', UserController.activeUsers);
router.get('/room/:roomId', RoomController.listRoom);
router.put('/room/:roomId', RoomController.updateRoom);
router.delete('/room/:roomId', RoomController.deleteRooom);
export default router;