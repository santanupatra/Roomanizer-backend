import express from 'express';
import AminitiesController from '../Controllers/AminitiesController';
// intializing express router
const router = express.Router();

router.post('/aminities', AminitiesController.createAminities);
router.get('/aminities', AminitiesController.listAminitiesies);
//router.get('/dashboard', UserController.activeUsers);
router.get('/aminities/:aminitiesId', AminitiesController.listAminities);
router.put('/aminities/:aminitiesId', AminitiesController.updateAminities);
router.delete('/aminities/:aminitiesId', AminitiesController.deleteAminities);
export default router;