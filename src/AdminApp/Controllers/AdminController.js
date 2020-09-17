import User from '../../Models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config';




/*
* Admin Login
* return json
*/

const adminLogin = (req, res) => {
    console.log(req.body)
    if (req.body.email == null || req.body.password == null) {
        return res.status(400).json({ msg: "Parameter missing..." });
    }
    User.findOne({
        email: req.body.email
    })
    .then( admin => {
        bcrypt.compare(req.body.password, admin.password)
        .then(isMatch => {
            if (isMatch) {
                if (admin.isAdmin == true) {
                    let token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                    const result = {
                        admin: admin,
                        token: token
                    };
                    res.status(200).json({ msg: "Successfully logedin", data: result });
                } else {
                    res.status(201).json({ msg: "You are not admin" });
                }
            } else {
                res.status(201).json({ msg: "Invalid password" });
            }
        })
        .catch(err => {
            console.log("Error is => ", err);
            res.status(500).json({ msg: "Something not right" });
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
    if(req.params.adminId == null) {
        return res.status(400).jsn({ msg:"Parameter missing !!!" });
    }
    try {
        const admin = await User.findById({ _id: req.params.adminId });
        res.status(200).json({ data: admin });
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

  export default { adminLogin, getProfile, updateProfile, changePassword}
