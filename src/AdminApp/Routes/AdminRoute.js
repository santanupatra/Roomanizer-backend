import express from 'express';
import upload from '../../../config/FileUpload';
import AdminController from '../Controllers/AdminController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();
router.post('/adminLogin', AdminController.adminLogin);
router.get('/admin/:adminId',AdminController.getProfile);
router.put('/admin/:adminId', upload.uploadUserImage,AdminController.updateProfile);
router.put('/admin/change-password/:adminId', AdminController.changePassword);
router.post('/admin/forgotPassword',AdminController.forgotPassword);
// router.post('/admin/checkOtp',AdminController.checkOtp)
router.post('/admin/updatePassword',AdminController.updatePassword)
export default router; 