import User from '../../Models/User';
import LoginDetails from '../../Models/LoginDetails';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config'
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
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
 * forgotPassword
 * return JSON
 */
const forgotPassword = async (request, response, next) => {
    let email = request.body.email;
    console.log(email)
    if (request.body.email == null) {
      response.status(201).json({ ack: false, details: "parameter missing..." });
    } else {
      try {
        const userDetails = await User
          .find({ email:email , isDeleted: false });
          console.log(userDetails)
          // console.log(userDetails[0])
        if (userDetails.length == 0) {
          response
            .status(201)
            .send({ ack: false, details: "Invalid email. Please try again" });
        } else {
          let userName = userDetails[0].firstName;
          console.log("fghjkdfghi",userName)
          let otp = Math.floor(Math.random() * 999999) + 100000;
          const subject = "Request To Change Your Password";
          const body = "Hi "+userName+ "<br/>"+ 'this is your OTP for your forgot password +"<br>"'+otp;
          let transporter = nodemailer.createTransport({
            host: "111.93.169.90",
            port: 27929,
            secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
              user: config.HOST_EMAIL_1, // generated ethereal user
              pass: config.HOST_EMAIL_PASSWORD_1 // generated ethereal password
            }
          });
        //   console.log(req.body.email)
          const mailOptions = {
            to:email,
            from: config.HOST_EMAIL_1,
            subject: subject,
            text:"Hi "+userName+",  <br/>This is your OTP to change your password <br>"+otp,
            // text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            // 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            // 'reset/' + otp + '\n\n' +
            // 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          console.log(mailOptions)
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
              return err
            } else {
              console.log('Email sent : ' + info.response);
            //   return info.response;
            res.status(200).send('recovery email sent');
            }
          })
  
  
  
          
          // let sendMail = nodemailer.send({email,subject,body});
          console.log(userDetails)
          const updateUser = await User.findOneAndUpdate(
            { _id: userDetails[0]._id },
            { $set: { otp: otp } },
            { new: true }
          );
          console.log(otp)
          return response
            .status(200)
            .send({ ack: true, details: "OTP Send Successfully" });
        }
      } catch (error) {
        console.log("error--------", error);
        return response.status(500).send({ ack: false, details: error.message });
      }
    }
  };



  const updatePassword = async (request, response, next) => {
    let email = request.body.email;
    let password = request.body.password;
    let otp=request.body.otp;  
    if (request.body.email == null || request.body.otp == null) {
      response.status(201).json({ ack: false, details: "parameter missing..." });
    } else {
      try {
        const userDetails = await User
          .find({ email: email, otp: otp, isDeleted: false });
          console.log(userDetails)
        if (userDetails.length == 0) {
          return response
            .status(201)
            .json({ ack: false, details: "Otp is Not Matched" });
        } else {
          if (request.body.email == null || request.body.password == null||request.body.otp==null) {
            response.status(201).json({ ack: false, details: "parameter missing..." });
          } else {
            try {
              const userDetails = await User
                .find({ email: email, isDeleted: false });
              if (userDetails.length == 0) {
                return response
                  .status(201)
                  .json({ ack: false, message: "Invalid email. Please try again" });
              } else {
                // console.log("in else");
                let newPass = bcrypt.hashSync(password, salt);
                // console.log("newPass", newPass)
                await User.findOneAndUpdate(
                  { _id: userDetails[0]._id },
                  { $set: { password: newPass } }
                );
                // console.log(" dfjskjdslk");
                return response
                  .status(200)
                  .json({ ack: true, details: "Password Change Successfully" });
        
              }
            } catch (error) {
              response.status(500).json({ ack: false, details: error.message });
            }
          }
        }
      } catch (error) {
        response.status(500).json({ ack: false, details: error.message });
      }
    }
  
  };

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

    export default { login, getProfile, updateProfile, changePassword, forgotPassword,updatePassword }