import express from 'express';
import LandLordController from '../Controllers/LandLordController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();
router.put('/:landLordId', Authorization,LandLordController.updateLandLord);
router.put('/completeChef/:landLordId', Authorization,upload.uploadRoomImage,LandLordController.roomImageUpload);

export default router;