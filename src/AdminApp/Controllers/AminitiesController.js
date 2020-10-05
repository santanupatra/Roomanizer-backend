import bcrypt from 'bcrypt';
import Aminities from '../../Models/Aminities';

/**
 * createAminities
 * return JSON
 */
const createAminities = async(req, res) => {
    if(req.body.name == null) {
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const cityName = await Aminities.find({name: req.body.name});
        if(cityName.length > 0){
            console.log("aaaa")
            res.status(401).json({msg:"Aminities Name already exist"});
        } else {
            console.log("else")
            const allData = req.body
            const addCity = await new Aminities(allData).save();
            res.status(200).json({msg:"Aminities Name has been added Successfully."});
            console.log("done")
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
}
}

/**
 * listAminitiesies
 * return JSON
 */
const listAminitiesies = async(req, res) => {
     if(req.query.keyword == null || req.query.page == null){
         return res.status(400).send({ack:1, message:"Parameter missing..."})
     }
    try {
        let keyword = req.query.keyword;
        let limit = 10;
        let page = req.query.page;
        var skip = (limit*page);
        const list = await Aminities.find({
          
            isDeleted: false,
          
            $or: [
                { name: { $regex: keyword, $options: 'm' } }
            ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        const listAll = await Aminities.find({
           
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
 * listAminities
 * return JSON
 */
const listAminities = async(req, res) => {
    if(req.params.aminitiesId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const aminities = await Aminities.findById({
            _id: req.params.aminitiesId
        });
        res.status(200).json({data: Aminities});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateAminities
 * return JSON
 */
const updateAminities = async(req, res) => {
    if(req.params.aminitiesId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const aminities = await Aminities.findById({
            _id: req.params.aminitiesId
        });
        if(aminities){
            const emailExist = await Aminities.find({
                _id: { $ne: req.params.aminitiesId }
            });
            if(emailExist.length > 0){
                res.status(401).json({msg:"Email already exist"});
            } else {
                let allData = req.body;
                if (req.body) {
                        const update = await Aminities.findByIdAndUpdate(
                        { _id: req.params.aminitiesId },
                        {
                            $set: allData
                        }
                    );
                    res.status(200).json({ msg: "Aminities Details has been updated" });
                } else {
                    const update = await Aminities.findByIdAndUpdate(
                        { _id: req.params.aminitiesId },
                        {
                            $set: req.body
                        }
                    );
                    res.status(200).json({msg:"Aminities Details has been updated"});
                }
            }
        } else {
            res.status(401).json({msg: "Aminities Details not found with this id"});
        }  
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteAminities
 * return JSON
 */
const deleteAminities = async(req, res) => {
    if(req.params.aminitiesId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const aminities = await Aminities.findByIdAndUpdate(
            { _id: req.params.aminitiesId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "Aminities Details has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createAminities, listAminitiesies, listAminities, updateAminities, deleteAminities }