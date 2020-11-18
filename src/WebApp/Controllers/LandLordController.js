
import User from '../../Models/User';
import Room from '../../Models/Room';
import Favorite from '../../Models/Favorite'
import config from '../../../config/config'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import moment from 'moment'
const updateLandLord = async(req, res) => {
    if(req.params.landLordId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    console.log(req.params.landLordId)

    try {
        const user = await User.findById({
            _id: req.params.landLordId
        });
        if(user){
            console.log(req.body)
            let allData = req.body;
             let setUserData = {
                firstName:allData.firstName,
                lastName:allData.lastName,
                //socialMediaLink:allData.socialMediaLink,
                facebookLink:allData.facebookLink,
                twitterLink:allData.twitterLink,
                gsuiteLink:allData.gsuiteLink,
                dateOfBirth:allData.dateOfBirth,
                age:allData.age,
                name:allData.lastName?allData.firstName+' '+allData.lastName:allData.firstName,
                userType:'landlord'
             }
             let setRoomData = {
                user_Id:allData.user_Id,
                roomName:allData.roomName,
                aboutRoom:allData.aboutRoom,
                flateMate:allData.flateMate,
                noOfBedRoom:allData.noOfBedRoom,
                houseRules:allData.houseRules,
                aminities:allData.aminities,
                age:allData.age,
                duration:allData.duration,
                moveIn:allData.moveIn,
                area:allData.area,
                deposite:allData.deposite,
                charges:allData.charges,
                chargesType:allData.chargesType,
                budget:allData.budget,
                address:allData.address,
                ageRange:allData.ageRange,
                city:allData.city,
                zipCode:allData.zipCode,
                longitude:allData.longitude,
                latitude:allData.latitude,
                location: {
                    type: "Point",
                    coordinates: [allData.longitude,allData.latitude]
                },
             }
            const update = await User.findByIdAndUpdate(
              { _id: req.params.landLordId },
                {
                  $set: setUserData
                }
            );
            console.log(req.params.landLordId)
            const roomDetails = await Room.findOne({
                
                user_Id: ObjectId(req.params.landLordId)
            });
            console.log(req.params.landLordId)
            if(roomDetails){
                const roomUpdate = await Room.findByIdAndUpdate(
                    { _id: roomDetails._id },
                      {
                        $set: setRoomData
                      }
                  );
            }else{
                const addRoom = await new Room(setRoomData).save();
            }
            res.status(200).json({ msg: "User Details has been updated" });
        } else {
            res.status(401).json({msg: "User Details not found with this id"});
        }  
    } catch (err) {
        console.log("Error1 => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }


/**
 * roomImage upload
 * Here update admin profile details
 * return JSON
 */
const roomImageUpload = async(req, res) => {
    if(req.params.landLordId == null || req.files.length <=0) {
        return res.status(200).json({ ack:false, msg:"Please Choose image file !!!" });
    }
    try {
        const userDetails = await User.findById({_id:req.params.landLordId});
        let updateData = await User.findByIdAndUpdate(
            { _id: req.params.landLordId },
            {
                $set: {userType:'landlord'}
            }
        );
        const userExit = await Room.findOne({user_Id:ObjectId(req.params.landLordId)});
        let existingImage = userExit.roomImage;
        let allExistngImage=[];
        const newList = await Promise.all(existingImage.map(async(value,key) => {
            allExistngImage.push({image:value.image})
          }))
        let allData = req.body;
        let setData ;
        let filesAmount = req.files.length;
        let total_image = [];
        for (let i = 0; i < filesAmount; i++) {
            total_image.push({ image: config.ROOM_IMAGE_PATH + req.files[i].filename });
        }
       let updatedIamge
       if(allExistngImage){
            updatedIamge = allExistngImage.concat(total_image);
       }else{
            updatedIamge = total_image;
       }
        setData = {
            user_Id:req.params.landLordId,
            roomImage:updatedIamge
        }
         

             let updatechef;
            if(userExit){
                 updatechef = await Room.findByIdAndUpdate(
                    { _id: userExit._id },
                    {
                        $set: setData
                    }
                );
                
            }else{
                 updatechef = await new Room(setData).save(); 

            }
            res.status(200).json({ack:true, msg: "Successfully room image upload " });
        
    } catch(err) {
        console.log("Error2 => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
/**for delete Room Image */
const deleteRoomImage = async (request, response) => {
    const roomId = request.params.roomId;
    const imageId = request.params.imageId;
    try {
      const roomDetails = await Room.findById(roomId);
      if (roomDetails) {
        await Room.findOneAndUpdate(
          { _id: roomId },
          {
            $pull: {
                roomImage: { _id: imageId },
            }
          }
        );
        response.status(200).json({ack:true, msg: 'Image deleted successfully.' });
  
      } else {
        response.status(404).json({ msg: 'Property not found' });
      }
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Server error' });
    }
  }
const listroomDetails = async(req, res) => {
    if(req.params.landLordId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    
    try {
        const details = await Room.findOne({ user_Id: ObjectId(req.params.landLordId)});
        res.status(200).json({data:details});
    } catch (err) {
        console.log('Error3 => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}
const allroomList = async(req, res) => {
  // console.log('REQ==>',req)
  console.log("req.query",req.query);
  console.log("asmita");
    if(req.query.page == null || req.query.perpage==null){
        return res.status(400).send({ack:1, message:"Parameter missing..."})
    }
    console.log('loginDetails',req.query.loginUserId) 
    let keyword = req.query;
    let limit = parseInt(req.query.perpage);
    let page = req.query.page;
    var skip = (limit*page);
    let filterData = {}
    console.log('houserules==>',keyword.houserules)
    if((keyword.houserules && keyword.houserules.length > 0)&&(keyword.amenities && keyword.amenities.length > 0)){
      var rulesArr = keyword.houserules.split(',');
      var animitiesArr = keyword.amenities.split(',');
      filterData = {
          'houseRules.value' :  { $in : rulesArr },
          'aminities.value' :  { $in : animitiesArr }
      }
    }
    else{
    if(keyword.houserules && keyword.houserules.length > 0){
      var rulesArr = keyword.houserules.split(',');
      filterData = {
        'houseRules.value' :  { $in : rulesArr }
      }
    }
   
    if(keyword.amenities && keyword.amenities.length > 0){
      var animitiesArr = keyword.amenities.split(',');
      filterData = {
          'aminities.value' :  { $in : animitiesArr }
      }
    }
  }
    let noOfBedRoom
    if(keyword.bedrooms){
        noOfBedRoom = keyword.bedrooms;
        filterData.noOfBedRoom = noOfBedRoom;
    }
    let city
    if (keyword.city) {
        city = keyword.city;
        filterData.city = { $regex: city, $options: 'i' };
    } 
    let address
    if (keyword.location) {
      address = keyword.location;
      filterData.address = address;
    } 
    let moveIn
    if (keyword.moveIn) {
      moveIn = { $lt: moment(keyword.moveIn).toDate() };
      filterData.moveIn = moveIn;
      }
      let ageRange
      if (keyword.ageRange) {
        ageRange = keyword.ageRange;
        filterData.ageRange = ageRange;
      } 
      let duration
      if (keyword.duration) {
        duration = keyword.duration;
        filterData.duration = duration;
      } 
      let budget
      if (keyword.budget) {
        budget = keyword.budget;
        filterData.budget = budget;
      } 
      let flateMate
      if (keyword.gender) {
        console.log( "gender",keyword.gender)
        flateMate = keyword.gender;
        filterData.flateMate = flateMate;
      } 
      // if(req.query.loginUserId)   {
      //   filterData = {
      //     '_id' :  { $nin : req.query.loginUserId }
      //   }
      // } 
      filterData.isActive =true;
      filterData.isDeleted =false;
    
     console.log("req.query.loginUserId",req.query.loginUserId)
      
    console.log("filterData==",filterData)
    try {
        
        const list = await Room.find(filterData)
        .populate({
            path: "user_Id",
            model: "user"
          })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        console.log("list---->",list);
        const newList = await Promise.all(list.map(async(value,key) => {
           
          const userList =  await Favorite.find({loginUserId:ObjectId(req.query.loginUserId),roomId:ObjectId(value._id),isActive:true})
          
          let newFav = {...value.toJSON()}
          if(userList && userList.length>0){
            newFav.isFav=true;
          }else{
            newFav.isFav=false;
          }
          return newFav
        }))
        const count = await Room.find(filterData).countDocuments();
        const result = {
            'list': newList,
            'count': count,
            'limit': limit
        };
        res.status(200).json({ data: result});
        
    } catch (err) {
        console.log("Error4 => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }

export default { updateLandLord,roomImageUpload,deleteRoomImage,listroomDetails,allroomList}