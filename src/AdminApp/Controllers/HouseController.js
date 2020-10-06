import bcrypt from 'bcrypt';
import House from '../../Models/House';
import config from '../../../config/config';

/**
 * createHouse
 * return JSON
 */
const createHouse = async(req, res) => {
    if(req.body.name == null) {
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const cityName = await House.find({name: req.body.name});
        if(cityName.length > 0){
            console.log("aaaa")
            res.status(401).json({msg:"House Name already exist"});
        } else {
            console.log("else")
            const allData = req.body
            const addCity = await new House(allData).save();
            res.status(200).json({msg:"House Name has been added Successfully."});
            console.log("done")
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
}
}
/**
 * listHouses
 * return JSON
 */
const listHouses = async(req, res) => {
    // try {
    //     const city = await House.find({ isDeleted: false });
    //     res.status(200).json({data:city});
    // } catch (err) {
    //     console.log('Error => ',err.message);
    //     res.status(500).json({msg:"Something went wrong"});
    // }


    if(req.query.keyword == null || req.query.page == null){
        return res.status(400).send({ack:1, message:"Parameter missing..."})
    }
   try {
       let keyword = req.query.keyword;
       let limit = 10;
       let page = req.query.page;
       var skip = (limit*page);
       const list = await House.find({
         
           isDeleted: false,
         
           $or: [
               { name: { $regex: keyword, $options: 'm' } }
           ]
       })
       .skip(skip)
       .limit(limit)
       .sort({ createdDate: 'DESC' });
       const listAll = await House.find({
          
           isDeleted: false,
           $or: [
               { name: { $regex: keyword, $options: 'm' } }
           ]
       }).countDocuments();
       const AllData = {
           'list': list,
           'count': listAll,
           'limit': limit
       };
       res.status(200).json({data: AllData});
   } catch (err) {
       console.log("Error => ",err.message);
       res.status(500).json({msg:"Something went wrong."});
   }


}


/**
 * listHouse
 * return JSON
 */
const listHouse = async(req, res) => {
    if(req.params.houseId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const house = await House.findById({
            _id: req.params.houseId
        });
        res.status(200).json({data: House});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateHouse
 * return JSON
 */
const updateHouse = async(req, res) => {
    if(req.params.houseId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const city = await House.findByIdAndUpdate(
            { _id: req.params.houseId },
            {
                $set: {
                    name: req.body.name,
                    isActive: req.body.isActive,
                    
                    
                }
            });
        res.status(200).json({msg:"City updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * deleteHouse
 * return JSON
 */
const deleteHouse = async(req, res) => {
    if(req.params.houseId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const house = await House.findByIdAndDelete(
            { _id: req.params.houseId },
        );
        res.status(200).json({msg: "House Details has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createHouse, listHouses, listHouse, updateHouse, deleteHouse }