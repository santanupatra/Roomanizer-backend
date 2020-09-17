import express from 'express';
import upload from '../../../config/FileUpload';
import UserController from '../Controllers/UserController';
// intializing express router
const router = express.Router();

router.post('/user', upload.uploadUserImage,UserController.createUser);
router.get('/user', UserController.listUsers);
//router.get('/dashboard', UserController.activeUsers);
router.get('/user/:userId', UserController.listUser);
router.put('/user/:userId', upload.uploadUserImage,UserController.updateUser);
router.delete('/user/:userId', UserController.deleteUser);
export default router;