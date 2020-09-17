import bcrypt from 'bcrypt';
import User from '../../Models/User';
import config from '../../../config/config';

/**
 * createLandlord
 * return JSON
 */
const createLandlord = async(req, res) => {
    if(req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.password == null) {
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const emailExist = await User.find({email: req.body.email});
        if(emailExist.length > 0){
            res.status(401).json({msg:"Email already exist"});
        } else {
            const allData = req.body
            const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
            delete allData.password;
            allData.password = hash;
            allData.name = allData.firstName+' '+allData.lastName;
            allData.userType = "landlord";
            allData.isAdminVerified = true;
            allData.isEmailVerified = true;
            allData.profilePicture = config.USER_IMAGE_PATH + req.file.filename
            const addLandlord = await new User(allData).save();
            res.status(200).json({msg:"Landlord Details has been added Successfully."});
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listLandlords
 * return JSON
 */
const listLandlords = async(req, res) => {
    // if(req.query.keyword == null || req.query.page == null){
    //     return res.status(400).send({ack:1, message:"Parameter missing..."})
    // }
    try {
        let keyword = req.query.keyword;
        let limit = 30;
        let page = req.query.page;
        var skip = (limit*page);
        const list = await User.find({
            isAdmin: false,
            isDeleted: false,
            userType: "landlord",
            $or: [
                { name: { $regex: keyword, $options: 'm' } },
                { email: { $regex: keyword, $options: 'm' } }
            ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        const listAll = await User.find({
            isAdmin: false,
            isDeleted: false,
            userType: "landlord",
            $or: [
                { name: { $regex: keyword, $options: 'm' } },
                { email: { $regex: keyword, $options: 'm' } }
            ]
        }).countDocuments();
        const AllData = {
            'list': list,
            'count': listAll,
            'limit': limit
        };
        res.status(200).json({data: AllData});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}


/**
 * listLandlord
 * return JSON
 */
const listLandlord = async(req, res) => {
    if(req.params.landlordId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const landlord = await User.findById({
            _id: req.params.landlordId
        });
        res.status(200).json({data: landlord});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateLandlord
 * return JSON
 */
const updateLandlord = async(req, res) => {
    if(req.params.landlordId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const landlord = await User.findById({
            _id: req.params.landlordId
        });
        if(landlord){
            const emailExist = await User.find({
                email: req.body.email,
                _id: { $ne: req.params.landlordId }
            });
            if(emailExist.length > 0){
                res.status(401).json({msg:"Email already exist"});
            } else {
                let allData = req.body;
                if (req.file) {
                    allData.profilePicture = config.USER_IMAGE_PATH + req.file.filename
                    const update = await User.findByIdAndUpdate(
                        { _id: req.params.landlordId },
                        {
                            $set: allData
                        }
                    );
                    res.status(200).json({ msg: "Landlord Details has been updated" });
                } else {
                    const update = await User.findByIdAndUpdate(
                        { _id: req.params.landlordId },
                        {
                            $set: req.body
                        }
                    );
                    res.status(200).json({msg:"Landlord Details has been updated"});
                }
            }
        } else {
            res.status(401).json({msg: "Landlord Details not found with this id"});
        }  
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteLandlord
 * return JSON
 */
const deleteLandlord = async(req, res) => {
    if(req.params.landlordId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const landlord = await User.findByIdAndUpdate(
            { _id: req.params.landlordId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "Landlord Details has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createLandlord, listLandlords, listLandlord, updateLandlord, deleteLandlord }