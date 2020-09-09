
import User from '../../Models/User';
import chefServices from '../../Models/chefServices';
import config from '../../../config/config'
import bcrypt from 'bcrypt';
import nodeMailer from '../../../config/nodemailer'
import mongoose from "mongoose";

/**
 * createChef
 * return JSON
 */
const createUser = async(req, res) => {
    if(req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.password == null) {
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
                allData.name = allData.firstName+' '+allData.lastName;
                allData.isEmailVerified = true;
                allData.isActive = true;
            if(req.body.email === req.body.confirmEmail){
                    const addUser = await new User(allData).save();
                    res.status(200).json({ack:true,msg:"User has been registered Successfully.", data:addUser});
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

export default {createUser}