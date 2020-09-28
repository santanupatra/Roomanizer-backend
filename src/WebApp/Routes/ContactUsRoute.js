import express from 'express';
const router = express.Router();
import ContactUsController from '../Controllers/ContactUsController';

router.post('/contactUs', ContactUsController.details);
export default router;