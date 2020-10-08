import express from 'express';
import upload from '../../../config/FileUpload';
import AuthenticationController from '../Controllers/AuthenticationController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/Login', AuthenticationController.login);
router.get('/profileDetails/:userId',Authentication,AuthenticationController.getProfile);
// router.put('/admin/:adminId', upload.uploadUserImage,AuthenticationController.updateProfile);
// router.put('/admin/change-password/:adminId', AuthenticationController.changePassword);
router.post('/web/forgotPassword', AuthenticationController.forgotPassword);
router.put('/web/updatePassword', AuthenticationController.updatePassword);
router.post('/userSignUp', AuthenticationController.signUp);
router.put('/activeAccount/:email', AuthenticationController.activeAccount);
router.post('/userLogin', AuthenticationController.login);
router.post('/socialLogin', AuthenticationController.socialLogin);
router.put('/changePassword/:userId', AuthenticationController.changePassword);
router.put('/LogOut/:userId', AuthenticationController.logOut);
router.put('/profilePicture/:userId', upload.uploadUserImage,AuthenticationController.profilePicture);
router.get('/user', AuthenticationController.listUsers);
router.get('/user/:userId', AuthenticationController.listUser);
//router.put('/roomPicture/:userId', upload.uploadRoomImage,AuthenticationController.roomPicture);

router.put('/updateProfile/:userId', AuthenticationController.updateUser);
export default router;