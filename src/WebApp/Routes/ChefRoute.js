import express from 'express';
import ChefController from '../Controllers/ChefController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/createChef', ChefController.createChef);
router.put('/addressAddChef/:chefId', ChefController.chefAddressAdd);
router.put('/completeChef/:chefId', upload.uploadMealImage,ChefController.completeChefProfile);
router.get('/chefDetails/:chefId', ChefController.chefDetails);
router.put('/chefActive/:chefId', ChefController.chefActive);

export default router;