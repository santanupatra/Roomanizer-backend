import express from 'express';
import user from './UserRoute';
import landLord from './LandLordRoute';
import cms from './CmsRoute';
import setting from './SettingRoute'
import contactUs from './ContactUsRoute'
import Authentication from './AuthenticatonRoute';
import house from './HouseRoute'
// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json());

// Routes starting with specific path...
router.use('/user-api', user);
router.use('/landLord-api', landLord);
router.use('/auth-api', Authentication);
router.use('/cms-api', cms);
router.use('/setting-api', setting);
router.use('/contactUs-api', contactUs);
router.use('/house-api', house);



export default router;
