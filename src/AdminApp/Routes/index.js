import express from 'express';
import admin from './AdminRoute';
import user from './UserRoute';
import room from './RoomRoute';
// import chef from './ChefRoute';
import landlord from './LandlordRoute';
import setting from './SettingRoute';
// import cms from './CmsRoute';
// import email from './EmailTemplateRoute';
// import food from './FoodRoute'
// import service from './ServiceRoute';
    import city from './CityRoute';
// import province from './ProvinceRoute';
// import dashboard from './DashboardRoute';


// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json());

// Routes starting with specific path...
router.use('/admin-api', admin);
router.use('/user-api', user);
// router.use('/chef-api', chef);
router.use('/room-api',room);
router.use('/landlord-api', landlord);
router.use('/setting-api', setting);
// router.use('/cms-api', cms);
// router.use('/email-api', email);
// router.use('/food-api', food);
// router.use('/service-api', service);
router.use('/city-api', city);
// router.use('/province-api', province);
// router.use('/dashboard-api', dashboard);


export default router;
