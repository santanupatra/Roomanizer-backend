import express from 'express';
import LandLordController from '../Controllers/LandLordController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();
router.put('/landlord/:landLordId', Authorization,LandLordController.updateLandLord);
router.put('/completeChef/:landLordId', Authorization,upload.uploadRoomImage2,LandLordController.roomImageUpload);
router.get('/room/:user_Id',LandLordController.listroomDetails);
router.get('/city',LandLordController.listAllCity);



export default router;