import express from 'express';
import UserController from '../Controllers/UserController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/chnagePassword', UserController.changePassword);
router.get('/:userId', UserController.getProfile);


export default router;