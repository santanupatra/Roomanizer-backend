
import User from '../../Models/User';
import Room from '../../Models/Room';
import config from '../../../config/config'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

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
                name:allData.lastName?allData.firstName+' '+allData.lastName:allData.firstName,
                userType:'landlord'
             }
             let setRoomData = {
                user_Id:allData.user_Id,
                roomName:allData.roomName,
                aboutRoom:allData.aboutRoom,
                flateMate:allData.flatmates,
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
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }


/**
 * roomImage upload
 * Here update admin profile details
 * return JSON
 */
const roomImageUpload = async(req, res) => {
    if(req.params.landLordId == null) {
        return res.status(400).jsn({ ack:false, msg:"Parameter missing !!!" });
    }
    console.log(req.params.landLordId)
    console.log("req.files",req.files)

    try {
        const userDetails = await User.findById({_id:req.params.landLordId});
        let updateData = await User.findByIdAndUpdate(
            { _id: req.params.landLordId },
            {
                $set: {userType:'landlord'}
            }
        );
        let allData = req.body;
        let setData ;
        let filesAmount = req.files.length;
        let total_image = [];
        for (let i = 0; i < filesAmount; i++) {
            total_image.push({ image: config.ROOM_IMAGE_PATH + req.files[i].filename });
        }
       
        setData = {
            user_Id:req.params.landLordId,
            roomImage:total_image
        }
          const userExit = await Room.findOne({user_Id:mongoose.Types.ObjectId(req.params.landLordId)});
          console.log('userExit',userExit);

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
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
const listroomDetails = async(req, res) => {
    if(req.params.landLordId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Room.findOne({ user_Id: req.params.user_Id });
        res.status(200).json({data:cmsData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}


export default { updateLandLord,roomImageUpload,listroomDetails }