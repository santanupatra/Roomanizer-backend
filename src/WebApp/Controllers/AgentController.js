import User from '../../Models/User';
//import AgentProperty from '../../Models/AgentProperty';
import config from '../../../config/config'
const ObjectId = mongoose.Types.ObjectId;

import mongoose from "mongoose";
import Room from '../../Models/Room';
import Interest from '../../Models/Interest';

/*Add agent property*/
const AddAgentProperty = async (req, res) => {
  // if(req.body.userId==null){
  //     return res.status(400).json({msg: "parameter missing.."});
  // }
  const allData = req.body;


  // console.log("req.file",req.file)
  try {
    let setRoomData = {
      user_Id: allData.user_Id,
      roomName: allData.roomName,
      aboutRoom: allData.aboutRoom,
      flateMate: allData.flateMate,
      noOfBedRoom: allData.noOfBedRoom,
      houseRules: JSON.parse(allData.houseRules[0]),
      aminities: JSON.parse(allData.aminities[0]),
      duration: allData.duration,
      moveIn: allData.moveIn,
      area: allData.area,
      deposite: allData.deposite,
      charges: allData.charges,
      chargesType: allData.chargesType,
      budget: allData.budget,
      address: allData.address,
      ageRange: allData.ageRange,
      city: allData.city,
      zipCode: allData.zipCode,
      longitude: allData.longitude,
      latitude: allData.latitude,
      location: {
        type: "Point",
        coordinates: [allData.longitude, allData.latitude]
      },
      isDraft:allData.isDraft
    }
    let filesAmount = req.files ? req.files.length : '';
    let total_image = [];
    for (let i = 0; i < filesAmount; i++) {
      total_image.push({ image: config.ROOM_IMAGE_PATH + req.files[i].filename });
    }
    setRoomData.roomImage = total_image;
    const addProperty = await new Room(setRoomData).save();
    res.status(200).json({ msg: "Successfully property added" });

  } catch (err) {
    console.log('Error => ', err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}
const listProperty = async (req, res) => {

  if (req.query.page == null || req.query.perpage == null) {
    return res.status(400).send({ ack: 1, message: "Parameter missing..." })
  }
  let keyword = req.query;
  let limit = parseInt(req.query.perpage);
  let page = req.query.page;
  var skip = (limit * page);
  try {
    let filterData = {}
    if(keyword.isDraft == "false"){
      filterData.isActive =keyword.isActive;
    }
    filterData.isDeleted =false;
    
      filterData.isDraft = keyword.isDraft;
   
    filterData.user_Id = ObjectId(keyword.userId);
    let roomName;
    if( keyword.roomName && keyword.roomName != undefined){
        roomName = keyword.roomName;
        filterData.roomName = { $regex: roomName, $options: 'i' };
       
    }
   
    const list = await Room.find( filterData )
      .populate({
        path: "user_Id",
        model: "user"
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: 'DESC' });
    const newList = await Promise.all(list.map(async (value, key) => {

      const interestUserList = await Interest.find({ roomId: ObjectId(value._id), isIntrested: true }).limit(5);
      let newObj = { ...value.toJSON() }
      if (interestUserList && interestUserList.length > 0) {
        newObj.interestUsers = interestUserList;
      } else {
        newObj.interestUsers = [];
      }
      return newObj
    }))
    const count = await Room.find(filterData);
    const result = {
      'list': newList,
      'count': count.length,
      'limit': limit
    };
    res.status(200).json({ data: result });
  } catch (err) {
    console.log('Error => ', err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}

const updateAgentProperty = async (req, res) => {
  const allData = req.body;

  try {
    let setRoomData = {
      user_Id: allData.user_Id,
      roomName: allData.roomName,
      aboutRoom: allData.aboutRoom,
      flateMate: allData.flateMate,
      noOfBedRoom: allData.noOfBedRoom,
      houseRules: JSON.parse(allData.houseRules[0]),
      aminities: JSON.parse(allData.aminities[0]),
      duration: allData.duration,
      moveIn: allData.moveIn,
      area: allData.area,
      deposite: allData.deposite,
      charges: allData.charges,
      chargesType: allData.chargesType,
      budget: allData.budget,
      address: allData.address,
      ageRange: allData.ageRange,
      city: allData.city,
      zipCode: allData.zipCode,
      longitude: allData.longitude,
      latitude: allData.latitude,
      isDraft:allData.isDraft,
      location: {
        type: "Point",
        coordinates: [allData.longitude, allData.latitude]
      },
    }
    let existingImage;
    let allExistngImage = [];
    const roomExit = await Room.findById({ _id: req.params.roomId });
    if (roomExit) {
      existingImage = roomExit.roomImage;
      const newList = await Promise.all(existingImage.map(async (value, key) => {
        allExistngImage.push({ image: value.image })
      }))
    }
    let filesAmount = req.files ? req.files.length : '';
    let total_image = [];
    for (let i = 0; i < filesAmount; i++) {
      total_image.push({ image: config.ROOM_IMAGE_PATH + req.files[i].filename });
    }
    let updatedIamge
    if (allExistngImage && allExistngImage.length > 0) {
      updatedIamge = allExistngImage.concat(total_image);
    } else {
      updatedIamge = total_image;
    }
    setRoomData.roomImage = updatedIamge;
    const update = await Room.findByIdAndUpdate(
      { _id: req.params.roomId },
      {
        $set: setRoomData
      }
    );
    if (update) {
      res.status(200).json({ msg: "Successfully updated " });
    }
  } catch (err) {
    console.log('Error => ', err.message);
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
      response.status(200).json({ ack: true, msg: 'Image deleted successfully.' });

    } else {
      response.status(404).json({ msg: 'Property not found' });
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ msg: 'Server error' });
  }
}

const listpropertyDetails = async (req, res) => {
  //console.log("req.params",req.params);
  if (req.params.roomId == null) {
    return res.status(400).jsn({ msg: "Parameter missing..." });
  }

  try {
    const details = await Room.findById({ _id: req.params.roomId }).populate({
      path: "user_Id",
      model: "user"
    });
    res.status(200).json({ data: details });
  } catch (err) {
    console.log('Error3 => ', err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}
const statusChange = async (request, response) => {

  const roomId = request.params.roomId;

  try {
    const roomDetails = await Room.findById(roomId);
    if (roomDetails) {
      await Room.findOneAndUpdate(
        { _id: roomId },
        {
          $set: {
            isActive: request.body.isActive
          }
        }
      );
      response.status(200).json({ ack: true, msg: ' Successfully status change.' });

    } else {
      response.status(404).json({ msg: 'Property not found' });
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ msg: 'Server error' });
  }
}
/*Add agent property*/
const interestAdd = async (req, res) => {
  const allData = req.body;

  try {
    const interestExist = await Interest.find({ userId: ObjectId(allData.userId), roomId: ObjectId(allData.roomId) });

      if (interestExist.length !== 0) {
        res.status(200).json({ ack: false });
      } else {
        const addProperty = await new Interest(allData).save();
        if (req.body.isIntrested == true) {
          res.status(200).json({ ack: true, msg: "User interested" });
        }
        else {
          res.status(200).json({ ack: true, msg: "User not interested" });
        }
      }

  } catch (err) {
    console.log('Error => ', err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}
const interestUserList = async (req, res) => {

  if (req.query.page == null || req.query.perpage == null) {
    return res.status(400).send({ ack: 1, message: "Parameter missing..." })
  }
  let keyword = req.query;
  let limit = parseInt(keyword.perpage);
  let page = keyword.page;
  var skip = (limit * page);
  try {


    const list = await Interest.find({ roomId: ObjectId(req.params.roomId), isIntrested: true })
      .populate({
        path: "userId",
        model: "user"
      }).populate({
        path: "roomId",
        model: "room"
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: 'DESC' });

    const count = await Interest.find({ roomId: ObjectId(req.params.roomId), isIntrested: true });
    const result = {
      'list': list,
      'count': count.length,
      'limit': limit
    };
    res.status(200).json({ data: result });
  } catch (err) {
    console.log('Error => ', err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
}
export default { AddAgentProperty, listProperty, updateAgentProperty, deleteRoomImage, listpropertyDetails, statusChange, interestAdd, interestUserList }