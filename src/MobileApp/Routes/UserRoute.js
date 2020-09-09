import express from 'express';
import UserController from '../Controllers/UserController';
import Authorization from '../../../middleware/isAuth';
// import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/user/login', UserController.test);
export default router;