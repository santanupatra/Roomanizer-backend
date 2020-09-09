import express from 'express';
import upload from '../../../config/FileUpload';
import AuthenticationController from '../Controllers/AuthenticationController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/Login', AuthenticationController.login);
router.get('/profileDetails/:userId',Authentication,AuthenticationController.getProfile);
router.put('/admin/:adminId', upload.uploadUserImage,AuthenticationController.updateProfile);
router.put('/admin/change-password/:adminId', AuthenticationController.changePassword);
export default router;