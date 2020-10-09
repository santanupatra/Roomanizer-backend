import config from '../../../config/config';
import Setting from '../../Models/Setting';
import Aminities from '../../Models/Aminities'

const details = async(req, res) => {
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

const listAllAminities = async(req, res) => {
    try {
        const city = await Aminities.find({ isDeleted: false });
        res.status(200).json({data:city});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

export default { details ,listAllAminities}