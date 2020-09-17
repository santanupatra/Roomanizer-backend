import express from 'express';
import upload from '../../../config/FileUpload';
import LandlordController from '../Controllers/LandlordController';
// intializing express router
const router = express.Router();

router.post('/landlord', upload.uploadUserImage,LandlordController.createLandlord);
router.get('/landlord', LandlordController.listLandlords);
//router.get('/dashboard', UserController.activeUsers);
router.get('/landlord/:landlordId', LandlordController.listLandlord);
router.put('/landlord/:landlordId', upload.uploadUserImage,LandlordController.updateLandlord);
router.delete('/landlord/:landlordId', LandlordController.deleteLandlord);
export default router;