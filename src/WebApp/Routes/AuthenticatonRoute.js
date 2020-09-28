import express from 'express';
import upload from '../../../config/FileUpload';
import AuthenticationController from '../Controllers/AuthenticationController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/userSignUp', AuthenticationController.signUp);
router.put('/activeAccount/:email', AuthenticationController.activeAccount);
router.post('/userLogin', AuthenticationController.login);
router.post('/socialLogin', AuthenticationController.socialLogin);

export default router;