import express from 'express';
const router = express.Router();
import FavoriteController from '../Controllers/FavoriteController';
import Authorization from '../../../middleware/isAuth';
router.post('/',Authorization,FavoriteController.addfavorite);
router.get('/favRoomList/:loginUserId',Authorization,FavoriteController.favRoomList);
router.get('/favRoomMateList/:loginUserId',Authorization,FavoriteController.favRoomMateList);
export default router;