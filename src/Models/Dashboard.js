import User from '../../Models/User';

/**
 * Count Active User and Chef
 * return JSON
 */

const activeCount = async(req, res) => {
    // if(req.query.keyword == null || req.query.page == null){
    //     return res.status(400).send({ack:1, message:"Parameter missing..."})
    // }
    try {
        // let keyword = req.query.keyword;
        // let limit = 30;
        // let page = req.query.page;
        // var skip = (limit*page);
        const countUser = await User.find({
            isAdmin: false,
            isDeleted: false,
            isActive: true,
            userType: 'customer',
            // $or: [
            //     { name: { $regex: keyword, $options: 'm' } },
            //     { email: { $regex: keyword, $options: 'm' } }
            // ]
        }).countDocuments();
        const countChef = await User.find({
            isAdmin: false,
            isDeleted: false,
            isActive: true,
            userType: 'landoard',
            // $or: [
            //     { name: { $regex: keyword, $options: 'm' } },
            //     { email: { $regex: keyword, $options: 'm' } }
            // ]
        }).countDocuments();
        const AllCount = {
            'countUser': countUser,
            'countLandloard': countLandloard,
            //'limit': limit
        };
        res.status(200).json({data: AllCount});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
    
}
export default { activeCount }