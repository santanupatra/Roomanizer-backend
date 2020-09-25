import User from '../../Models/User';
import LoginDetails from '../../Models/LoginDetails';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import nodeMailer from '../../../config/nodemailer'
//import moment from "moment";
/**
 * User Sign Up
 * return JSON
 */
const signUp = async(req, res) => {
    if(req.body.email == null || req.body.password == null || req.body.confirmPassword == null) {
        return res.status(400).json({ ack:false,msg:"Parameter missing..." })
    }
    try {
        const emailExist = await User.find({email: req.body.email});
        if(emailExist.length > 0){
                res.status(200).json({ack:false,msg:"Email already exist"});
        } else {
          if(req.body.password === req.body.confirmPassword){
                const allData = req.body
                const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
                delete allData.password;
                allData.password = hash;
                allData.isEmailVerified = false;
                allData.isActive = false;
                const addUser = await new User(allData).save();
                if(addUser){
                    const to = req.body.email;
                    const subject = "Request To active chef Account";
                    const url = config.WEB_URL+"active/"+ req.body.email;
                    console.log("url==",url);
                    var linkHref = "<a href='" +url+ "'>Click Here</a>";
                    const body = "Hi,<br/> <br/>Click this link to active your account <br>"+ linkHref  ;
                    
                    const response = await nodeMailer.sendMail(subject,body,to);
                    res.status(200).json({ack:true,msg:"User has been registered Successfully,Please check your email to active account.", data:addUser});
                }
               
          }else {
               res.status(200).json({ack:false, msg:"Confirm Password is not matched"});
                  
            }
            
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
/**
 * Active user accout to login
 * return JSON
 */
const activeAccount = async(req,res)=>{
    if(req.params.email == null) {
        return res.status(400).jsn({ ack:false, msg:"Parameter missing !!!" });
    }
    try {
        const userDetails = await User.findById(
            { email: req.params.email });
        const updatechef = await User.findByIdAndUpdate(
            { _id: userDetails._id },
            {
                $set: {isEmailVerified:true,
                        isActive:true}
            }
        );
        res.status(200).json({ack:true, data:userDetails});
        
    } catch(err) {
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
                            type:"login",
                            loginType:"web"
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
/*
* Social Media Login
* return json
*/

exports.socialLogin = async(request, response) => {
    const session = request.db_session;
    //console.log('request====',request.body);
    if(request.body.name == null || request.body.email== null || request.body.socialMediaType == null ||request.body.socialId == null){
        return response.status(400).send({ack: false, details:"Parameter missing..."})
    }
      try{
            let name = request.body.name;
            let arrName = name.split(" ");
            let firstName = arrName.slice(0, 1).join(' ');
            let lastName = arrName.slice(1, arrName.length).join(' ');
        const checkForIfExists = await User.find({'email':request.body.email}, {}, {session});
      if(checkForIfExists.length > 0){
              const token = jwt.create({id: checkForIfExists[0]._id}, {subject: "Bearer", audience: 'all'});
              const updateUser = await User.findByIdAndUpdate(
                { _id: checkForIfExists[0]._id },
                {
                    $set: {
                        email: request.body.email,
                        firstName:firstName,
                        lastName: lastName,
                        name:request.body.name,
                        profilePicture:request.body.profilePicture,
                        socialId:request.body.socialId,
                        isSocialMediaUser:true,
                        socialMediaType:request.body.socialMediaType,
                        lastLogin: new Date().toISOString()
                    }
                }
            )
            let logData = {
                userId:userDetails._id,
                type:"login",
                loginType:"social"
            }
            new LoginDetails(logData).save(); 
            const userData = await User.findById({ _id: checkForIfExists[0]._id });
            response.status(200).json({ack: true, details:'Logged in succesfully', token:token, data:userData});
      }else{
            
          const userExist = await User.find({ socialId: request.body.socialId });
          if(userExist.length > 0){
            const token = jwt.create({id: userExist[0]._id}, {subject: "Bearer", audience: 'all'});
            const updateUser = await User.findByIdAndUpdate(
              { _id: userExist[0]._id },
              {
                  $set: {
                      email: request.body.email,
                      firstName:firstName,
                      lastName: lastName,
                      name:request.body.name,
                      profilePicture:request.body.profilePicture,
                      socialId:request.body.socialId,
                      isSocialMediaUser:true,
                      socialMediaType:request.body.socialMediaType,
                      lastLogin: new Date().toISOString(),
                  }
              }
          )
            let logData = {
                userId:userDetails._id,
                type:"login",
                loginType:"social"
            }
            new LoginDetails(logData).save(); 
            const userData = await User.findById({ _id: userExist[0]._id });
            response.status(200).json({ack: true, details:'Logged in succesfully', token:token, data:userData});
          } else{
              const users = await User.create({
                email: request.body.email,
                firstName:firstName,
                lastName: lastName,
                name:request.body.name,
                profilePicture:request.body.profilePicture,
                socialId:request.body.socialId,
                isSocialMediaUser:true,
                socialMediaType:request.body.socialMediaType,
                lastLogin: new Date().toISOString(),
              });
              let logData = {
                userId:userDetails._id,
                type:"login",
                loginType:"social"
            }
            new LoginDetails(logData).save();   
            const userData = await User.findById({ _id: users._id });
            const token = jwt.create({id: userData._id}, {subject: "Bearer", audience: 'all'});
  
            response.status(200).json({ack: true, details:'Logged in succesfully', token:token, data:userData});
  
          } 
           
      }
      }catch(error){
        console.error(error);
        response.status(500).json({ack: false, details: 'Server error'});
      }
    
          
    
  };





export default {signUp, activeAccount, login, socialLogin }