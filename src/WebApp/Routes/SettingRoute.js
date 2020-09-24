import express from 'express';
const router = express.Router();
import SettingController from '../Controllers/SettingController';

router.get('/setting', SettingController.details);
export default router;