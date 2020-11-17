
import User from '../../Models/User';
import Room from '../../Models/Room';
import config from '../../../config/config'
import bcrypt from 'bcrypt';
import House from '../../Models/House';
import Favorite from '../../Models/Favorite';
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

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
      console.log("User",user)
      console.log("user",user.password)
      console.log("req.body.currentPassword",req.body.currentPassword)
      const password=req.body.currentPassword
      var compering=bcrypt.compareSync(password, user.password);
      console.log("compering",compering)
        if (compering) {
          console.log("inside",req.body.currentPassword)
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
// const getProfile = async(req, res) => {
//     if(req.params.userId == null) {
//         return res.status(400).jsn({ack:false, msg:"Parameter missing !!!" });
//     }
//     try {
//         //const userDetails = await User.findById({ _id: req.params.userId });
//             // let filterData = {
//             //     _id: {$in:[req.params.userId]}
//             // }
//             const userDet = await User.aggregate([
//                 {
//                     $match: {'_id':ObjectId(req.params.userId)}
//                 },
                
//                 {
//                     $lookup: {
//                         from: 'login_details',
//                         localField: '_id',
//                         foreignField: 'userId',
//                         as: 'LoginDetails'
//                     }
//                 }
                
//             ]);

//         let loginDetails = await LoginDetails.find({userId:req.params.userId,type:"login",isActive:true}); 
//         let todayLoginCount = loginDetails.length; 
//         let totalLoginCount= userDet[0].LoginDetails.length;
//         let UserDetails = {
//             userDetails:userDet,
//             totalLoginCount:totalLoginCount,
//             todayLoginCount:todayLoginCount,
//             lastLogin:userDet[0].lastLogin
//         }
//         //console.log('totalLoginCount',loginDetails,'data==',new Date('2020 ,08, 22'));
//       // if(userDetails){
//          res.status(200).json({ack:true, data: UserDetails });
//     //    }else{
//     //     res.status(200).json({ack:false, data: [] });

//     //    }
//     } catch(err) {
//         console.log("Error => ", err.message);
//         res.status(500).json({ msg: "Something went wrong" });
//     };
// }
/**
 * getProfile
 * Get admin profile details
 * return JSON
 */
const getProfile = async (req, res) => {
    if(req.params.userId == null) {
      return res.status(400).json({msg: "parameter missing.."});
    }
    try {
      const user = await User.findById({
        _id: req.params.userId
    });
    res.status(200).json({data: user});
    } catch (err) {
      console.log("Error => ",err.message);
      res.status(500).json({msg:"Something went wrong."});
    }
  }
/**
 * updateUser
 * return JSON
 */
const updateUser = async(req, res) => {
    if(req.params.userId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const user = await User.findById({
            _id: req.params.userId
        });
        if(user){
            const emailExist = await User.find({
                email: req.body.email,
                _id: { $ne: req.params.userId }
            });
            let allData = req.body;
            var latitude = allData.latitude;
            var longitude = allData.longitude;

            const update = await User.findByIdAndUpdate(
              { _id: req.params.userId },
                {
                  $set: allData,
                  location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                    }
                  
                  
                }
            );
            const roomExit = await Room.findOne({
                  user_Id:req.params.userId
            })
            if(req.body.userType =='customer' && roomExit){
              const update = await Room.findByIdAndUpdate(
                { _id: roomExit._id },
                  {
                    $set: {isActive:false}
                  }
              );
            }else if (req.body.userType =='landlord' && roomExit){
                const update = await Room.findByIdAndUpdate(
                  { _id: roomExit._id },
                    {
                      $set: {isActive:true}
                    }
                );
            }
            
            res.status(200).json({ msg: "User Details has been updated" });
        } else {
            res.status(401).json({msg: "User Details not found with this id"});
        }  
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }
/**
 * listUsers
 * return JSON
 */
const allUserList = async(req, res) => {
    if(req.query.page == null || req.query.perpage==null){
        return res.status(400).send({ack:1, message:"Parameter missing..."})
    }
    console.log('loginDetails',req.query.loginUserId)

    let keyword = req.query;
    let limit = parseInt(req.query.perpage);
    let page = req.query.page;
    var skip = (limit*page);
    let filterData = {}
  
    // if((keyword.houserules && keyword.houserules.length > 0)||(keyword.amenities && keyword.amenities.length > 0)){
    //   console.log("keyword.houserules",keyword.houserules)
    //   var rulesArr = keyword.houserules.split(',');
    //   var animitiesArr = keyword.amenities.split(',');
    //   filterData = {
    //       'houseRules.value' :  { $in : rulesArr },
    //       'aminities.value' :  { $in : animitiesArr }
    //   }
    // }
    if(keyword.amenities && keyword.amenities.length > 0){
      var animitiesArr = keyword.amenities.split(',');
      filterData = {
          'aminities.value' :  { $in : animitiesArr }
      }
    }
    if(keyword.houserules && keyword.houserules.length > 0){
      var houserulesArr = keyword.houserules.split(',');
      filterData = {
          'houseRules.value' :  { $in : houserulesArr }
      }
    }
    let bedrooms
    if(keyword.bedrooms){
        bedrooms = keyword.bedrooms;
        filterData.noOfBedRoom = bedrooms;
    }
    let city
    if (keyword.city) {
        city = keyword.city;
        filterData.city = { $regex: city, $options: 'i' };
    } 
    let occupation
    if (keyword.occupation) {
        occupation = keyword.occupation;
        filterData.occupation = occupation;
      }
      let age
      if (keyword.age) {
        age = parseInt(keyword.age);
        filterData.age = age;
      } 
      let gender
      if (keyword.gender) {
        gender = keyword.gender;
        filterData.gender = gender;
      } 
      //let location
      
       if (keyword.location) {
      //   console.log(keyword.location)
      //  // location = keyword.location.replace("%20", "");
      
        //   filterData.location = keyword.location: {
        //   $near: {
        //    $maxDistance: 1000,
        //    $geometry: {
        //     type: "Point",
        //     coordinates: [long, latt]
        //    }
        //   }
        //  }
       
      } 
      console.log("req.query.loginUserId==>",req.query.loginUserId)
      
      if (keyword.lng && keyword.lat) {
        console.log(keyword.lng , keyword.lat)
        
                filterData = {
                    location:
                    {
                        $near:
                        {
                            $geometry: {
                                type: "Point",
                                coordinates: [keyword.lng, keyword.lat]
                            },
                            $maxDistance: 5000,
                            //spherical: true

                        }
                    }
                }
            }
            if(req.query.loginUserId)   {
              filterData = {
                '_id' :  { $nin : req.query.loginUserId }
              }
            }  
      filterData.isAdmin =false;
      filterData.isDeleted =false;
      filterData.userType ="customer";
        console.log(keyword)
    try {
         console.log(filterData)
        const list = await User.find(filterData)
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });

      //   const list = await User.aggregate([
      //     { "$geoNear": {
      //         "near": {
      //             "type": "Point",
      //             "coordinates": [keyword.lng,keyword.lat]
      //         },
      //          "distanceField": "location",
      //          "spherical": true,
      //         "maxDistance": 10000
      //     }}
      // ])
         
        const newList = await Promise.all(list.map(async(value,key) => {
           
          const userList =  await Favorite.find({loginUserId:ObjectId(req.query.loginUserId),roomMateId:ObjectId(value._id),isActive:true})
          
          let newFav = {...value.toJSON()}
          if(userList && userList.length>0){
            newFav.isFav=true;
          }else{
            newFav.isFav=false;
          }
          return newFav
        }))
        const count = await User.find(filterData).count();
        const result = {
            'list': newList,
            'count': count,
            'limit': limit
        };
        res.status(200).json({ data: result});
        
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }


  const profilePicture = async(req, res) => {
   
    if(req.params.userId == null || req.file == null) {
      
        return res.status(400).json({ msg:"Parameter missing !!!" });
        
    }
    
    try {
       let allData = req.body;
           
          if (req.file) {
             let allphoto = config.USER_IMAGE_PATH + req.file.filename
             //const p = req.file.path.replace("/")
                const updateAdmin = await User.findByIdAndUpdate(
                  { _id: req.params.userId },
                    {
                        $set: {
                          profilePicture: allphoto
                        }
                    }
                );
                res.status(200).json({ msg: "Profile Picture updated successfully" });
            } else{
              const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "file not found" });
              
            }
            
            
        }
     
     catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
  }

export default {changePassword,getProfile,updateUser,allUserList,profilePicture}
