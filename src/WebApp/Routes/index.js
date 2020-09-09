import express from 'express';
import user from './UserRoute';
import chef from './ChefRoute';
import cms from './CmsRoute';
import Authentication from './AuthenticatonRoute';
// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json());

// Routes starting with specific path...
router.use('/user-api', user);
router.use('/chef-api', chef);
router.use('/auth-api', Authentication);
router.use('/cms-api', cms);

export default router;
