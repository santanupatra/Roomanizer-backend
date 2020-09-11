import config from '../../../config/config';
import Setting from '../../Models/Setting';

/**
 * editSetting
 * return JSON
 */


const editSetting = (req, res) => {
   console.log("add")
    try {
        let allData = req.body;
        const addData = new Setting(allData).save();
        res.status(200).json({msg:"Successfully added"});
        
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
        
    }
}

/**
 * editSetting
 * return JSON
 */

const editSetting = async(req, res) => {
    console.log("no edit")
    try {
        const getData = await Setting.findById(
            { _id: config.SETTING_PRIMARY_ID}
        );
        
        res.status(200).json({data:getData});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
}

/**
 * editSetting
 * return JSON
 */
const editSetting = async(req, res) => {
    try {
        let allData = req.body;
            if (req.file) {
                allData.siteLogo = config.LOGO_IMAGE_PATH + req.file.filename
                const add = await Setting.findByIdAndUpdate(
                   { _id: config.SETTING_PRIMARY_ID },
                    {
                        $set: allData
                    }
                );
                res.status(200).json({ msg: "Settings updated successfully" });
            } 
            else 
            {
                const add = await Setting.findByIdAndUpdate(
                   { _id: config.SETTING_PRIMARY_ID },
                    {
                        $set: allData
                    }
                );
                res.status(200).json({ msg: "Settings updated successfully" });
            }
        }
      
     catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
}
export default { addSetting, editSetting, detailsSetting }