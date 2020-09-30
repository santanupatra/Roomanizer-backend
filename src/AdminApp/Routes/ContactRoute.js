import express from 'express';
import ContactController from '../Controllers/ContactController';
// intializing express router
const router = express.Router();

router.get('/contact', ContactController.listAll);
export default router;