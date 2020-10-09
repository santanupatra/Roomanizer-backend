import express from 'express';
const router = express.Router();
import SettingController from '../Controllers/SettingController';

router.get('/setting', SettingController.details);
router.get('/city',SettingController.listAllCity);
router.get('/aminities',SettingController.listAllAminities);

export default router;