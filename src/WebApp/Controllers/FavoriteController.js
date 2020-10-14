
import User from '../../Models/User';
import Room from '../../Models/Room';
import Favorite from '../../Models/Favorite';
import config from '../../../config/config'
import bcrypt from 'bcrypt';
var ObjectId = require('mongodb').ObjectID;

/**
 * addfavorite
 * Here admin add new cms page
 * return JSON
 */
const addfavorite = async(req, res) => {
    
    if(req.body.loginUserId == null 
        || req.body.type == null
        ) {
        return res.status(400).json({ack:false, msg:"Parameter missing..." })
    }
    try {
            if(req.body.type =='roomMate'){
                let roomMateDetails = await Favorite.findOne({loginUserId:req.body.loginUserId,roomMateId:req.body.roomMateId,isActive:true});
                const update = await Favorite.findByIdAndUpdate(
                                  { _id: roomMateDetails._id },
                                    {
                                      $set: {isActive:false}
                                    }
                              );
                res.status(200).json({msg:"Successfully remove from favorite list."});
                
            }else if(req.body.type =='room') {
                let roomDetails = await Favorite.findOne({loginUserId:req.body.loginUserId,roomId:req.body.roomId,isActive:true});
                const update = await Favorite.findByIdAndUpdate(
                                { _id: roomDetails._id },
                                    {
                                    $set: {isActive:false}
                                    }
                            );
                res.status(200).json({msg:"Successfully remove from favorite list."});
                
            }else{
                const allData = req.body
                const addfav = await new Favorite(allData).save();
                res.status(200).json({msg:"Successfully add to favorite list."});
            }
            
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}


const favRoomList = async(req, res) => {
    // if(req.query.page == null || req.query.perpage==null){
    //     return res.status(400).send({ack:1, message:"Parameter missing..."})
    // }
    
    let keyword = req.query;
    //let limit = parseInt(req.query.perpage);
    let limit = 10;
    let page = 0;
    //let page = req.query.page;
    var skip = (limit*page);
    let filterData = {
        type:"room",
        loginUserId:req.params.loginUserId,
        isActive:true
    }

    try {
        
        const list = await Favorite.find(filterData)
        .populate({
            path: "room",
            model: "room"
          })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        console.log("list",list);
        const count = await Favorite.find(filterData).countDocuments();
        const result = {
            'list': list,
            'count': count,
            'limit': limit
        };
        res.status(200).json({ data: result});
        
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }

  const favRoomMateList = async(req, res) => {
    // if(req.query.page == null || req.query.perpage==null){
    //     return res.status(400).send({ack:1, message:"Parameter missing..."})
    // }
    
    let keyword = req.query;
    //let limit = parseInt(req.query.perpage);
    let limit = 10;
    let page = 0;
    //let page = req.query.page;
    var skip = (limit*page);
    let filterData = {
        type:"roomMate",
        loginUserId:req.params.loginUserId,
        isActive:true
    }

    try {
        
        const list = await Favorite.find(filterData)
        .populate({
            path: "user",
            model: "user"
          })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        console.log("list",list);
        const count = await Favorite.find(filterData).countDocuments();
        const result = {
            'list': list,
            'count': count,
            'limit': limit
        };
        res.status(200).json({ data: result});
        
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
  }
  

export default {addfavorite,favRoomList,favRoomMateList}
