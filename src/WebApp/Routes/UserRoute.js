import express from 'express';
import UserController from '../Controllers/UserController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/chnagePassword', Authorization,UserController.changePassword);
router.get('/:userId', Authorization,UserController.getProfile);
router.put('/:userId', Authorization,UserController.updateUser);


export default router;