import ContactUs from '../../Models/ContactUs';


/**
 * listAllRoom
 * return JSON
 */

const listAll= async(req, res) => {
    try {
        const contact = await ContactUs.find({ isDeleted: false });
        res.status(200).json({data:contact});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}
export default { listAll}