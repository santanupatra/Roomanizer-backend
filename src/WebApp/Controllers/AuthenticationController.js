import User from '../../Models/User';
import LoginDetails from '../../Models/LoginDetails';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
//import moment from "moment";
/*
* Admin Login
* return json
*/

const login = (req, res) => {
    if (req.body.email == null || req.body.password == null) {
        return res.status(400).json({ack:true, msg: "Parameter missing..." });
    }
    User.findOne({
        email: req.body.email
    })
    .then( userDetails => {
        bcrypt.compare(req.body.password, userDetails.password)
        .then(isMatch => {
            if (isMatch) {
                if (userDetails.isActive == true && userDetails.isEmailVerified == true && userDetails.isAdmin == false) {
                    let token = jwt.sign({ id: userDetails._id }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                    
                     User.findByIdAndUpdate(
                        { _id: userDetails._id },
                        {
                            $set: {lastLogin:new Date()}
                        }
                    ).then(res =>{
                        let logData = {
                            userId:userDetails._id,
                            type:"login"
                        }
                        new LoginDetails(logData).save(); 
                    })
                    const result = {
                        userDetails: userDetails,
                        token: token
                    };
                    res.status(200).json({ack:true, msg: "Successfully loggedin", data: result });
                } else {
                    res.status(201).json({ ack:false, msg: "You account is not active" });
                }
            } else {
                res.status(201).json({ ack:false, msg: "Invalid password" });
            }
        })
        .catch(err => {
            console.log("Error is => ", err);
            res.status(500).json({ack:false, msg: "Something not right" });
        });
    })
    .catch(err => {
        console.log("Error => ", err.msg);
        res.status(401).json({ msg: "Invalid email" });
    });
}

/**
 * getProfile
 * Get admin profile details
 * return JSON
 */
const getProfile = async(req, res) => {
    if(req.params.userId == null) {
        return res.status(400).jsn({ack:false, msg:"Parameter missing !!!" });
    }
    try {
        //const userDetails = await User.findById({ _id: req.params.userId });
            // let filterData = {
            //     _id: {$in:[req.params.userId]}
            // }
            const userDet = await User.aggregate([
                {
                    $match: {'_id':ObjectId(req.params.userId)}
                },
                {
                    $lookup: {
                        from: 'chef_services',
                        localField: '_id',
                        foreignField: 'chefId',
                        as: 'chefServices'
                    }
                },
                
                {
                    $lookup: {
                        from: 'login_details',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'LoginDetails'
                    }
                }
                
            ]);

        let loginDetails = await LoginDetails.find({userId:req.params.userId,type:"login",isActive:true}); 
        let todayLoginCount = loginDetails.length; 
        let totalLoginCount= userDet[0].LoginDetails.length;
        let UserDetails = {
            userDetails:userDet,
            totalLoginCount:totalLoginCount,
            todayLoginCount:todayLoginCount,
            lastLogin:userDet[0].lastLogin
        }
        console.log('totalLoginCount',loginDetails,'data==',new Date('2020 ,08, 22'));
      // if(userDetails){
         res.status(200).json({ack:true, data: UserDetails });
    //    }else{
    //     res.status(200).json({ack:false, data: [] });

    //    }
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    };
}

/**
 * updateProfile
 * Here update admin profile details
 * return JSON
 */
const updateProfile = async(req, res) => {
    if(req.params.adminId == null) {
        return res.status(400).jsn({ msg:"Parameter missing !!!" });
    }
    try {
        let allData = req.body;
        if (req.file) {
            allData.profilePicture = config.USER_IMAGE_PATH + req.file.filename
            const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.adminId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Profile updated successfully" });
        } else {
            const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.adminId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Profile updated successfully" });
        }
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}

/**
 * changePassword
 * Here update admin password
 * return JSON
 */
const changePassword = (req, res) => {
    if (req.params.adminId == null || req.body.currentPassword == null || req.body.newPassword == null || req.body.confirmPassword == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    User.findById({
        _id: req.params.adminId
    })
    .then(user => {
        if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
            if (req.body.newPassword == req.body.confirmPassword) {
                const hash = bcrypt.hashSync(req.body.newPassword, config.SALT_ROUND);
                User.findByIdAndUpdate(
                    { _id: req.params.adminId },
                    {
                        $set: {
                            password: hash
                        }
                    }
                )
                .then(() => {
                    res.status(200).json({ msg: "Password updated successfully" });
                })
                .catch(err => {
                    console.log('Error => ', err.msg);
                    res.status(500).json({ msg: "Something not right" });
                });
            } else {
                res.status(401).json({ msg: "New password and confirm password does not match" });
            }
        } else {
            res.status(400).json({ msg: "Current password is wrong" });
        }
    })
    .catch(err => {
        console.log('Error => ', err.msg);
        res.status(401).json({ msg: "Admin not found with this id" });
    });
}

export default { login, getProfile, updateProfile, changePassword }