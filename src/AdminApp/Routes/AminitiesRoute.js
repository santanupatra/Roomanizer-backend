import express from 'express';
import AminitiesController from '../Controllers/AminitiesController';
import upload from '../../../config/FileUpload';

// intializing express router
const router = express.Router();

router.post('/aminities',upload.uploadAminitiesImage, AminitiesController.createAminities);
router.get('/aminities', AminitiesController.listAminitiesies);
//router.get('/dashboard', UserController.activeUsers);
router.get('/aminities/:aminitiesId', AminitiesController.listAminities);
router.put('/aminities/:aminitiesId',upload.uploadAminitiesImage, AminitiesController.updateAminities);
router.delete('/aminities/:aminitiesId', AminitiesController.deleteAminities);
export default router;