import express from 'express';
import SettingController from '../Controllers/SettingController';
import upload from '../../../config/FileUpload';
const router = express.Router();

router.post('/setting', SettingController.addSetting);
router.put('/setting', upload.uploadLogo,SettingController.editSetting);
router.get('/setting', SettingController.detailsSetting);
export default router;