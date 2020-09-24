
import User from '../../Models/User';
//import chefServices from '../../Models/chefServices';
import config from '../../../config/config'
import bcrypt from 'bcrypt';
import nodeMailer from '../../../config/nodemailer'
import mongoose from "mongoose";

/**
 * createChef
 * return JSON
 */
const createChef = async(req, res) => {
    if(req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.password == null) {
        return res.status(400).json({ ack:false,msg:"Parameter missing..." })
    }
    try {
        const emailExist = await User.find({email: req.body.email});
        if(emailExist.length > 0){
            if(emailExist[0].isChefProfileComplete == true){
                res.status(200).json({ack:false,msg:"Email already exist"});
            }else {
                if(req.body.password === req.body.confirmPassword){
                    const allData = req.body
                    const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
                    delete allData.password;
                    allData.password = hash;
                    allData.name = allData.firstName+' '+allData.lastName;
                    allData.isEmailVerified = false;
                    allData.isActive = false;
                if(req.body.email === req.body.confirmEmail){
                       const updatechef = await User.findByIdAndUpdate(
                                { _id: emailExist[0]._id },
                                {
                                    $set: allData
                                }
                            );
                        const userDetails = await User.findById({_id: emailExist[0]._id});   
                        res.status(200).json({ack:true,msg:"Chef has been added Successfully.", data:userDetails});
                 }else {
                        res.status(200).json({ack:false,msg:"Confirm email is not matched"});
                    }
              }else {
                   res.status(200).json({ack:false, msg:"Confirm Password is not matched"});
                      
                }
                
            }
        } else {
          if(req.body.password === req.body.confirmPassword){
                const allData = req.body
                const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
                delete allData.password;
                allData.password = hash;
                allData.name = allData.firstName+' '+allData.lastName;
                allData.isEmailVerified = false;
                allData.isActive = false;
            if(req.body.email === req.body.confirmEmail){
                    const addUser = await new User(allData).save();
                    res.status(200).json({ack:true,msg:"Chef has been added Successfully.", data:addUser});
                }else {
                    res.status(200).json({ack:false,msg:"Confirm email is not matched"});
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
 * chefAddress
 * Here update admin profile details
 * return JSON
 */
const chefAddressAdd = async(req, res) => {
    if(req.params.chefId == null) {
        return res.status(400).jsn({ msg:"Parameter missing !!!" });
    }
    try {
        let allData = req.body;
        let setData = {
                        location: {
                                    type: "Point",
                                    coordinates: [allData.longitude,allData.latitude]
                                },
                        address:allData.address,
                        city:    allData. city,
                        phoneNumber:allData.phoneNumber,
                        province:allData.province,
                        street:allData.street,
                        zipCode:allData.zipCode   
                    }
            const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.chefId },
                {
                    $set: setData
                }
            );
            res.status(200).json({ack:true, msg: "Chef register new account successfully" });
        
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
/**
 * completeChefProfile
 * Here update admin profile details
 * return JSON
 */
const completeChefProfile = async(req, res) => {
    if(req.params.chefId == null) {
        return res.status(400).jsn({ ack:false, msg:"Parameter missing !!!" });
    }
    try {
        const chefDetails = await User.findById({_id:req.params.chefId});
        let allData = req.body;
        let setData ;
        let filesAmount = req.files.length;
        let total_image = [];
        for (let i = 0; i < filesAmount; i++) {
            total_image.push({ image: config.MEAL_IMAGE_PATH + req.files[i].filename });
        }
       
        setData = {
            chefId:req.params.chefId,
            paymentType:allData.paymentType,
            travelDistance:allData.travelDistance,
            cookingSchool:allData.cookingSchool,
            details:allData.details,
            foodCategory:allData.foodCategory,
            serviceId:allData.serviceId,
            availability:allData.availability,
            experienceType:allData.experienceType,
            mealImage:total_image
        }
        
          const chefExit = await chefServices.findOne({chefId:mongoose.Types.ObjectId(req.params.chefId)});
             let updatechef;
            if(chefExit){
                 updatechef = await chefServices.findByIdAndUpdate(
                    { _id: chefExit._id },
                    {
                        $set: setData
                    }
                );
                
            }else{
                 updatechef = await new chefServices(setData).save(); 

            }
            
            if(updatechef){
                let updatechefUser = await User.findByIdAndUpdate(
                    { _id: req.params.chefId },
                    {
                        $set: {isChefProfileComplete:true}
                    }
                );
                const to = chefDetails.email;
            // const subject = getTemplate.emailSubject;
            const subject = "Request To active chef Account";
            // const emailContent = getTemplate.emailContent;
            // let body = emailContent.replace("[OTP]", otp);
           // const Link = "http://localhost:5073/web/chef-api/chefActive/"+req.params.chefId;
            const url = config.WEB_URL+"active/"+ req.params.chefId;
            console.log("url==",url);
            var linkHref = "<a href='" +url+ "'>Click Here</a>";
            const body = "Hi,<br/> <br/>Click this link to active your account <br>"+ linkHref  ;
            
            const response = await nodeMailer.sendMail(subject,body,to);
            }
            
            res.status(200).json({ack:true, msg: "Successfully chef complete  profile " });
        
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
const chefDetails = async(req,res)=>{
    if(req.params.chefId == null) {
        return res.status(400).jsn({ ack:false, msg:"Parameter missing !!!" });
    }
    try {
        const chefDetail = await User.findById({_id: req.params.chefId});
        res.status(200).json({ack:true, data:chefDetail});
        
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
const chefActive = async(req,res)=>{
    if(req.params.chefId == null) {
        return res.status(400).jsn({ ack:false, msg:"Parameter missing !!!" });
    }
    try {
        const chef = await User.findById(
            { _id: req.params.chefId });
        const updatechef = await User.findByIdAndUpdate(
            { _id: req.params.chefId },
            {
                $set: {isEmailVerified:true,
                        isActive:true}
            }
        );
        res.status(200).json({ack:true, data:chef});
        
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
export default { createChef,chefAddressAdd ,completeChefProfile,chefDetails,chefActive}