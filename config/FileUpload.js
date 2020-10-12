import multer from 'multer';
import config from '../config/config';
import Aminities from '../src/Models/Aminities';

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

// Aminities image
const aminitiesImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir+"/uploads" + config.AMINITIES_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    } 
});
exports.uploadAminitiesImage = multer({
    storage: aminitiesImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('aminitiesImage');

/*upload property picture*/
const roomImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
       // console.log('request==',req);
        //console.log('file==',file);
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
        files: 10
    }
}).array('roomImage',10);


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
