import express from 'express';
const router = express.Router();
import CityController from '../Controllers/CityController';
//import upload from '../../../config/FileUpload';

router.post('/city',CityController.createCity);
// router.post('/cms/image', upload.cmsImage, CmsController.uploadImage);
router.get('/city',CityController.listAllCity);
router.get('/city/:cityId',CityController.listCity);
router.put('/city/:cityId',CityController.updateCity);
router.delete('/city/:cityId',CityController.deleteCity);
export default router;