import express from 'express';
import UserController from '../Controllers/UserController';
import Authorization from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.put('/changePassword/:userId', UserController.changePassword);
router.get('/:userId', UserController.getProfile);
router.put('/:userId', Authorization,UserController.updateUser);
router.get('/', UserController.allUserList);
router.put('/profilePicture/:userId', Authorization,upload.uploadUserImage,UserController.profilePicture);


export default router;