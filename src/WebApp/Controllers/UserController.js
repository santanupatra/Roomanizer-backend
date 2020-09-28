
import User from '../../Models/User';
import config from '../../../config/config'
import bcrypt from 'bcrypt';

/**
 * changePassword
 * Here update user password
 * return JSON
 */
const changePassword = (req, res) => {
    if (req.params.userId == null || req.body.currentPassword == null || req.body.newPassword == null || req.body.confirmPassword == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    User.findById({
        _id: req.params.userId
    })
    .then(user => {
        if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
            if (req.body.newPassword == req.body.confirmPassword) {
                const hash = bcrypt.hashSync(req.body.newPassword, config.SALT_ROUND);
                User.findByIdAndUpdate(
                    { _id: req.params.userId },
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
        res.status(401).json({ msg: "User not found with this id" });
    });
}
/**
 * getProfile
 * Get user profile details
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
        //console.log('totalLoginCount',loginDetails,'data==',new Date('2020 ,08, 22'));
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

export default {changePassword,getProfile}