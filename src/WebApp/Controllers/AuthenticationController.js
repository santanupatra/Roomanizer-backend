import User from '../../Models/User';
import LoginDetails from '../../Models/LoginDetails';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config'
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
const ObjectId = mongoose.Types.ObjectId;
import nodeMailer from '../../../config/nodemailer'
//import moment from "moment";
/**
 * User Sign Up
 * return JSON
 */
const signUp = async (req, res) => {
  console.log(req.body)
  if (req.body.email == null || req.body.password == null || req.body.confirmPassword == null) {
    return res.status(400).json({ ack: false, msg: "Parameter missing..." })
  }
  try {
    const emailExist = await User.find({ email: req.body.email });
    console.log(emailExist)
    if (emailExist.length > 0) {
      res.status(200).json({ ack: false, msg: "Email already exist" });
    } else {
      if (req.body.password === req.body.confirmPassword) {
        const allData = req.body
        const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
        delete allData.password;
        allData.password = hash;
        allData.isEmailVerified = false;
        allData.isActive = false;
        const addUser = await new User(allData).save();
        if (addUser) {
          const to = req.body.email;
          const subject = "Request To active chef Account";
          const url = config.WEB_URL + "activeAccount/" + req.body.email;
          console.log("url==", url);
          var linkHref = "<a href='" + url + "'>Click Here</a>";
          const body = "Hi,<br/> <br/>Click this link to active your account <br>" + linkHref;

          const response = await nodeMailer.sendMail(subject, body, to);
          res.status(200).json({ ack: true, msg: "User has been registered Successfully,Please check your email to active account.", data: addUser });
        }

      } else {
        res.status(200).json({ ack: false, msg: "Confirm Password is not matched" });

      }

    }
  } catch (err) {
    console.log("Error_SignUp => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
/**
 * Active user accout to login
 * return JSON
 */
const activeAccount = async (req, res) => {
  if (req.params.email == null) {
    return res.status(400).jsn({ ack: false, msg: "Parameter missing !!!" });
  }
  try {
    const userDetails = await User.findOneAndUpdate(
      { email: req.params.email },
      {
        $set: {
          isEmailVerified: true,
          isActive: true
        }
      }
    );
    res.status(200).json({ ack: true, data: userDetails });

  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}
/*
* User Login
* return json
*/

const login = (req, res) => {
  if (req.body.email == null || req.body.password == null) {
    return res.status(400).json({ ack: true, msg: "Parameter missing..." });
  }
  User.findOne({
    email: req.body.email
  })
    .then(userDetails => {
      bcrypt.compare(req.body.password, userDetails.password)
        .then(isMatch => {
          if (isMatch) {
            if (userDetails.isActive == true && userDetails.isEmailVerified == true && userDetails.isAdmin == false) {
              let token = jwt.sign({ id: userDetails._id }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days

              User.findByIdAndUpdate(
                { _id: userDetails._id },
                {
                  $set: { lastLogin: new Date() }
                }
              ).then(res => {
                let logData = {
                  userId: userDetails._id,
                  type: "login",
                  loginType: "web"
                }
                new LoginDetails(logData).save();
              })
              const result = {
                userDetails: userDetails,
                token: token
              };
              res.status(200).json({ ack: true, msg: "Successfully loggedin", data: result });
            } else {
              res.status(201).json({ ack: false, msg: "You account is not active" });
            }
          } else {
            res.status(201).json({ ack: false, msg: "Invalid password" });
            
          }
        })
        .catch(err => {
          console.log("Error is => ", err);
          res.status(500).json({ ack: false, msg: "Something not right" });
        });
    })
    .catch(err => {
      // console.log("Error => ", err);
      res.status(401).json({ ack: false,msg: "Invalid email" });
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
        .find({ email: email, isDeleted: false });
      console.log(userDetails)
      // console.log(userDetails[0])
      if (userDetails.length == 0) {
        response
          .status(201)
          .send({ ack: false, details: "Invalid email. Please try again" });
      } else {
        let userName = userDetails[0].firstName;
        console.log("fghjkdfghi", userName)
        let otp = Math.floor(Math.random() * 999999) + 100000;
        const subject = "Request To Change Your Password";
        const body = "Hi " + userName + "<br/>" + 'this is your OTP for your forgot password +"<br>"' + otp;
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
          to: email,
          from: config.HOST_EMAIL_1,
          subject: subject,
          text: "Hi " + userName + ",  <br/>This is your OTP to change your password <br>" + otp,
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

/**
 * changePassword
 * return JSON
 */

const changePassword = (req, res) => {
  if (req.params.userId == null || req.body.newPassword == null || req.body.confirmPassword == null) {
    return res.status(400).json({ msg: "Parameter missing.." });
  }
  User.findById({
    _id: req.params.userId
  })
    .then(user => {
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
    })
    .catch(err => {
      console.log('Error => ', err.msg);
      res.status(401).json({ msg: "User not found with this id" });
    });
}

/**
 * update Password
 * return JSON
 */

const updatePassword = async (request, response, next) => {
  console.log(request.body)
  // let email = request.body.email;
  let password = request.body.password;
  let otp = request.body.otp;
  if (request.body.otp == null) {
    response.status(201).json({ ack: false, details: "parameter missing..." });
  } else {
    try {
      const userDetails = await User
        .find({ otp: otp, isDeleted: false });
      console.log(userDetails)
      if (userDetails.length == 0) {
        return response
          .status(201)
          .json({ ack: false, details: "Otp is Not Matched" });
      } else {
        if (request.body.password == null || request.body.otp == null) {
          response.status(201).json({ ack: false, details: "parameter missing..." });
        } else {
          try {
            const userDetails = await User
              .find({ otp: otp, isDeleted: false });
            console.log(userDetails)
            if (userDetails.length == 0) {
              return response
                .status(201)
                .json({ ack: false, message: "Invalid email. Please try again" });
            } else {
              // console.log("in else");
              let newPass = bcrypt.hashSync(password, 10);
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



/*
* Social Media Login
* return json
*/

const socialLogin = async (request, response) => {
  const session = request.db_session;
  //console.log('request====',request.body);
  if (request.body.name == null || request.body.email == null || request.body.socialMediaType == null || request.body.socialId == null) {
    return response.status(400).send({ ack: false, details: "Parameter missing..." })
  }
  try {
    let name = request.body.name;
    let arrName = name.split(" ");
    let firstName = arrName.slice(0, 1).join(' ');
    let lastName = arrName.slice(1, arrName.length).join(' ');
    const checkForIfExists = await User.find({ 'email': request.body.email }, {}, { session });
    if (checkForIfExists.length > 0) {
      let token = jwt.sign({ id: checkForIfExists[0]._id }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
      
      
      const updateUser = await User.findByIdAndUpdate(
        { _id: checkForIfExists[0]._id },
        {
          $set: {
            email: request.body.email,
            firstName: firstName,
            lastName: lastName,
            name: request.body.name,
            socialId: request.body.socialId,
            isSocialMediaUser: true,
            socialMediaType: request.body.socialMediaType,
            lastLogin: new Date().toISOString()
          }
        }
      )
      let logData = {
        userId: checkForIfExists[0]._id,
        type: "login",
        loginType: "social"
      }
      new LoginDetails(logData).save();
      const userData = await User.findById({ _id: checkForIfExists[0]._id });
      response.status(200).json({ ack: true, details: 'Logged in succesfully', token: token, data: userData });
    } else {

      const userExist = await User.find({ socialId: request.body.socialId });
      if (userExist.length > 0) {
        let token = jwt.sign({ id: userExist[0]._id }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
        const updateUser = await User.findByIdAndUpdate(
          { _id: userExist[0]._id },
          {
            $set: {
              email: request.body.email,
              firstName: firstName,
              lastName: lastName,
              name: request.body.name,
              socialId: request.body.socialId,
              isSocialMediaUser: true,
              socialMediaType: request.body.socialMediaType,
              lastLogin: new Date().toISOString(),
            }
          }
        )
        let logData = {
          userId: userExist[0]._id,
          type: "login",
          loginType: "social"
        }
        new LoginDetails(logData).save();
        const userData = await User.findById({ _id: userExist[0]._id });
        response.status(200).json({ ack: true, details: 'Logged in succesfully', token: token, data: userData });
      } else {
        const users = await User.create({
          email: request.body.email,
          firstName: firstName,
          lastName: lastName,
          name: request.body.name,
          socialId: request.body.socialId,
          isSocialMediaUser: true,
          socialMediaType: request.body.socialMediaType,
          lastLogin: new Date().toISOString(),
        });
        let logData = {
          userId: users._id,
          type: "login",
          loginType: "social"
        }
        new LoginDetails(logData).save();
        const userData = await User.findById({ _id: users._id });
        let token = jwt.sign({ id: userData._id }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days

        response.status(200).json({ ack: true, details: 'Logged in succesfully', token: token, data: userData });

      }

    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ ack: false, details: 'Server error' });
  }



}
/*
* User Logout
* return json
*/
const logOut = async(req, res) => {
  if(req.params.userId == null) {
      return res.status(400).json({msg:"Parameter missing..."});
  }
  console.log(req.params.userId)

  try {
      const city = await LoginDetails.findOneAndUpdate(
          { userId: req.params.userId , type:"login"},
          {
              $set: {
                //userId:req.params.userId,
                type:"logout",
                loginType:"web",
                logoutTime :Date.now()
                                
                  
              }
          });
      res.status(200).json({msg:"Successfully loggedOut"});
  } catch (err) {
      console.log('Error => ',err.message);
      res.status(500).json({msg:"Something went wrong"});

  }
}

export default {forgotPassword,updatePassword,signUp, activeAccount,login, socialLogin,logOut}
