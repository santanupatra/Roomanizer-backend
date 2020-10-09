import express from 'express';
const router = express.Router();
import SettingController from '../Controllers/SettingController';

router.get('/setting', SettingController.details);
router.get('/house', SettingController.listAllAminities);
router.get('/city',SettingController.listAllCity);

export default router;