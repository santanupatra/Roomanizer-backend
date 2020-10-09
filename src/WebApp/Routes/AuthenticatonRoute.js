import express from 'express';
import AuthenticationController from '../Controllers/AuthenticationController';
// intializing express router
const router = express.Router();
router.post('/userSignUp', AuthenticationController.signUp);
router.post('/Login', AuthenticationController.login);
router.post('/forgotPassword', AuthenticationController.forgotPassword);
router.put('/updatePassword', AuthenticationController.updatePassword);
router.put('/activeAccount/:email', AuthenticationController.activeAccount);
router.post('/userLogin', AuthenticationController.login);
router.post('/socialLogin', AuthenticationController.socialLogin);
router.put('/LogOut/:userId', AuthenticationController.logOut);
export default router;