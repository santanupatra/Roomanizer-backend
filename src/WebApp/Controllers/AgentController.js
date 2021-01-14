import User from '../../Models/User';
import AgentProperty from '../../Models/AgentProperty';
import config from '../../../config/config'

import mongoose from "mongoose";

/*Add agent property*/
const  AddAgentProperty= async(req, res) => {
    if(req.body.userId==null){
        return res.status(400).json({msg: "parameter missing.."});
    }
    const allData=req.body;
    console.log(allData,req.files)
    try {
        var setRoomData = {
            user_Id:allData.userId,
            propertyName:allData.propertyName,
            roomName:allData.roomName,
            aboutRoom:allData.aboutRoom,
            noOfBedRoom:allData.noOfBedRoom,
            houseRules:allData.houseRules,
            aminities:allData.aminities,
            duration:allData.duration,
            moveIn:allData.moveIn,
            area:allData.area,
            // address:allData.address,
            ageRange:allData.ageRange,
            city:allData.city,
            zipCode:allData.zipCode,
            // longitude:allData.longitude,
            // latitude:allData.latitude,
            // location: {
            //     type: "Point",
            //     coordinates: [allData.longitude,allData.latitude]
            // },
         }
        if (req.files) {
            // setRoomData.roomImage[] = config.ROOM_IMAGE_PATH + req.files[0].filename
            let filesAmount = req.files.length;
                    let total_image = [];
                    for (let i = 0; i < filesAmount; i++) {
                        total_image.push({ image: config.ROOM_IMAGE_PATH + req.files[i].filename });
                    }
               let updatedIamge = total_image;
                setRoomData.roomImage=updatedIamge
            const add = await AgentProperty(setRoomData).save();
            res.status(200).json({ msg: "sucessfully added updated successfully" });
        } 
       else{
         const addProperty = await new AgentProperty(setRoomData).save();
         if(addProperty){
            res.status(200).json({msg: "Successfully added"});
         }
        }
    } catch (err) {
        console.log('Error => ',err.message);   
        res.status(500).json({msg:"Something went wrong"});
    }
}

const listAllAgent = async(req, res) => {
    console.log("wertyu")
    try {
        const agentlist = await AgentProperty.find({isDeleted: false });
        console.log(agentlist)
        res.status(200).json({data:agentlist});
    } catch (err) {
        console.log('Error => ',err.message);   
        res.status(500).json({msg:"Something went wrong"});
    }
}
export default {AddAgentProperty,listAllAgent }