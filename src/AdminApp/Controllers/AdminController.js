import User from '../../Models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config'
// import nodemailer from '../../../config/nodemailer';
import { read } from 'fs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { getMaxListeners } from 'process';
var async = require("async");
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
const forgetPassword = (req, res, next) => {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
          console.log(token)
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (user == null) {
            console.log('error', 'No account with that email address exists.');
         // req.flash('error', 'No account with that email address exists.');
            return res.status(403).send('email not found');
        
        }

  console.log('step 1')
  console.log(user)

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
          console.log('step 2')
          console.log(token)
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
            to: user.email,
            from: config.HOST_EMAIL_1,
            subject: 'Password Reset',
            text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
        //   console.log(mailOptions)
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
  }
    ], function(err) {
      console.log('this err' + ' ' + err)
      //res.redirect('/');
    });
  }
  const resetPassword = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log(user);
      if (!user) {
        console.log( 'Password reset token is invalid or has expired.');
        return res.json('Password reset token is invalid or has expired.');
      }
      res.status(200).send( {
       user: user.name ,
       message : "password reset link ok"
      
    });
    });
  }

  const changeForgetPassword = (req, res) => {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
            console.log(user);
            if (!user) {
            console.log( 'Password reset token is invalid or has expired.');
            return res.json('Password reset token is invalid or has expired.');
          }
          const hash = bcrypt.hashSync(req.body.password, config.SALT_ROUND);
            console.log(hash)
          user.password = hash ;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          console.log('password' + "  " + user.password + "   " + 'and the user is'+ "  " + user.name)
  
          user.save(function(err) {
            done(err, user);
          });
  
        });
      },
             //console.log("run")
            function(user, done) {
           console.log('got this far 4')
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
          console.log(req.body.email)
          const mailOptions = {
            to: user.email,
            from: config.HOST_EMAIL_1,
            subject: 'Your password has been changed',
            text:'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          console.log(mailOptions)
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
              return err
            } else {
              console.log('Email sent : ' + info.response);
            //   return info.response;
            res.status(200).send('password changed');
            }
          })
      }
      ]  // ], function(err) {
    //  // res.redirect('/');
    // }
    );
  };
  export default { adminLogin, getProfile, updateProfile, changePassword ,forgetPassword,resetPassword,changeForgetPassword}