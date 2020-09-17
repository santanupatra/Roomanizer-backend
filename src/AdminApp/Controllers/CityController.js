import City from '../../Models/City';
import config from '../../../config/config';

/**
 * createCity
 * Here admin add new cms page
 * return JSON
 */
const createCity = async(req, res) => {
    console.log("hey")
if(req.body.cityName == null) {
    return res.status(400).json({ msg:"Parameter missing..." })
}
try {
    const cityName = await City.find({cityName: req.body.cityName});
    if(cityName.length > 0){
        console.log("aaaa")
        res.status(401).json({msg:"City Name already exist"});
    } else {
        console.log("else")
        const allData = req.body
        const addCity = await new City(allData).save();
        res.status(200).json({msg:"City Name has been added Successfully."});
        console.log("done")
    }
} catch (err) {
    console.log("Error => ",err.message);
    res.status(500).json({msg:"Something went wrong."});
}
}
/**
 * listAllCms
 * Here fetch all cms pages
 * return JSON
 */
const listAllCity = async(req, res) => {
    try {
        const city = await City.find({ isDeleted: false });
        res.status(200).json({data:city});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listCms
 * Here fetch all cms pages
 * return JSON
 */
const listCity = async(req, res) => {
    if(req.params.cityId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const city = await City.findById({ _id: req.params.cityId });
        res.status(200).json({data:city});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * updateCms
 * Here update cms page
 * return JSON
 */
const updateCity = async(req, res) => {
    if(req.params.cityId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const city = await City.findByIdAndUpdate(
            { _id: req.params.cityId },
            {
                $set: {
                    cityName: req.body.cityName,
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
 * deleteCms
 * Here delete cms page
 * return JSON
 */
const deleteCity = async(req, res) => {
    if(req.params.cityId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const city = await City.findByIdAndUpdate(
            { _id: req.params.cityId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({msg:"City deleted successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}
export default { createCity, listAllCity, listCity, updateCity, deleteCity, }

