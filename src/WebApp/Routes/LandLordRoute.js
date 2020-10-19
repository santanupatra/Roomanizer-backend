import express from 'express';
import LandLordController from '../Controllers/LandLordController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();
router.put('/:landLordId', Authorization,LandLordController.updateLandLord);
router.put('/roomImage/:landLordId', Authorization,upload.uploadRoomImage,LandLordController.roomImageUpload);
router.get('/room/:landLordId',Authorization,LandLordController.listroomDetails);
router.get('/',LandLordController.allroomList);
router.delete('/:roomId/:imageId',Authorization,LandLordController.deleteRoomImage);
export default router;