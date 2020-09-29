import config from '../../../config/config';
import ContactUs from '../../Models/ContactUs';

const details = async(req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.subject == null || req.body.message == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
            const allData = req.body
            allData.name = allData.firstName+' '+allData.lastName;
            const addUser = await new ContactUs(allData).save();
            res.status(200).json({msg:"Details has been submitted Successfully."});
    }
    catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { details }