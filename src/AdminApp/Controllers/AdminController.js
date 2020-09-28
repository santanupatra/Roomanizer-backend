import User from '../../Models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import crypto from 'crypto';
var async = require("async");
var mongoose = require('mongoose');
import nodemailer from 'nodemailer';
// var bcrypt = require('bcryptjs');
var salt = 10;
import sendMail from '../../../config/nodemailer';


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
// Forget work
const forgotPassword = async (request, response, next) => {
  let email = request.body.email;
  console.log(email)
  if (request.body.email == null) {
    response.status(201).json({ ack: false, details: "parameter missing..." });
  } else {
    try {
      const userDetails = await User
        .find({ email:email , isDeleted: false,isAdmin:true });
        console.log(userDetails)
        // console.log(userDetails[0])
      if (userDetails.length == 0) {
        response
          .status(201)
          .send({ ack: false, details: "Invalid email. Please try again" });
      } else {
        let userName = userDetails[0].firstName;
        console.log("fghjkdfghi",userName)
        // const emailTemplateDetails = await User
        //   .findOne({ _id: '5f577f2f4548a2203c1ceff6', isDeleted: false });
        // let emailTempp = email;
        // let emailSubject = emailTemplateDetails.subject;
        // let emailrowContent = emailTemplateDetails.content;
        //* 6 digit otp create /
        let otp = Math.floor(Math.random() * 999999) + 100000;
        // const otptime = Date.now() + 3600000;
        // console.log(user.otptime)
        const subject = "Request To active chef Account";
        const body = "Hi "+userName+",  <br/>Click this link to active your account <br>"+otp;
        // let emailContentReplace = emailrowContent.replace(/(<([^>]+)>)/ig, "");
        // let emailContent = emailContentReplace.replace(/&nbsp;/ig, ' ');
        // let emailText1 = emailContent.replace("[USER]", userName);
        // let emailText = emailText1.replace("[OTP]", otp);

        let transporter = nodemailer.createTransport({
          host: "111.93.169.90",
          port: 27929,
          secure: false, // true for 465, false for other ports
          service: "gmail",
          auth: {
            user: config.HOST_EMAIL, // generated ethereal user
            pass: config.HOST_EMAIL_PASSWORD // generated ethereal password
          }
        });
      //   console.log(req.body.email)
        const mailOptions = {
          to:email,
          from: config.HOST_EMAIL,
          subject: subject,
          text:"Hi "+userName+",  <br/>Click this link to active your account <br>"+otp,
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

//* Check OTP /
// const checkOtp = async (request, response, next) => {
//   let email = request.body.email;
//   let otp = request.body.otp;
//   console.log(request.body)
//   if (request.body.email == null || request.body.otp == null) {
//     response.status(201).json({ ack: false, details: "parameter missing..." });
//   } else {
//     try {
//       const userDetails = await User
//         .find({ email: email, otp: otp, isDeleted: false });
//         console.log(userDetails)
//       if (userDetails.length == 0) {
//         return response
//           .status(201)
//           .json({ ack: false, details: "Otp is Not Matched" });
//       } else {
//         return response
//           .status(200)
//           .json({ ack: true, details: "Otp Matches Successfully" });
//       }
//     } catch (error) {
//       response.status(500).json({ ack: false, details: error.message });
//     }
//   }
// };

//* Update Password /
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
export default { adminLogin, getProfile, updateProfile, changePassword ,forgotPassword,updatePassword}
