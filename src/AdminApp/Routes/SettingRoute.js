import express from 'express';
import SettingController from '../Controllers/SettingController';
import upload from '../../../config/FileUpload';
const router = express.Router();

router.post('/setting', SettingController.add);
router.put('/setting', upload.uploadLogo,SettingController.edit);
router.get('/setting', SettingController.details);
export default router;