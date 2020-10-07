import multer from 'multer';
import config from '../config/config';

/*upload user profile picture*/
const userImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir+"/uploads" + config.USER_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    } 
});
exports.uploadUserImage = multer({
    storage: userImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('profilePicture');

const roomImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir+"/uploads" + config.ROOM_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    } 
});
exports.uploadRoomImage = multer({
    storage: roomImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('roomPicture');

/*upload meal images*/
// const mealImageStore = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __basedir+"/uploads" + config.MEAL_IMAGE_PATH)
//     },
//     filename: (req, file, cb) => {
//         cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
//     }
// });
// exports.uploadMealImage = multer({
//     storage: mealImageStore,
//     limits: {
//         fileSize: 70 * 1024 * 1024,  // 70 MB,
//         files: 1
//     }
// }).single('mealImage');
/*upload property picture*/
const mealImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
       // console.log('request==',req);
        //console.log('file==',file);
        cb(null, __basedir+"/uploads" + config.MEAL_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});
exports.uploadMealImage = multer({
    storage: mealImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 10
    }
}).array('mealImage',10);


const logoStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir+"/uploads" + config.LOGO_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    } 
});
exports.uploadLogo = multer({
    storage: logoStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('siteLogo');
