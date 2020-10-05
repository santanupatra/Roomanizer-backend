import express from 'express';
import HouseController from '../Controllers/HouseController';
// intializing express router
const router = express.Router();

router.post('/house', HouseController.createHouse);
router.get('/house', HouseController.listHouses);
//router.get('/dashboard', UserController.activeUsers);
router.get('/house/:houseId', HouseController.listHouse);
router.put('/house/:houseId', HouseController.updateHouse);
router.delete('/house/:houseId', HouseController.deleteHouse);
export default router;