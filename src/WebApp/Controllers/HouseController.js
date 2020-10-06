import House from '../../Models/House';





const listAllHouse = async(req, res) => {
    try {
        const city = await House.find({ isDeleted: false });
        res.status(200).json({data:city});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}


export default {listAllHouse}