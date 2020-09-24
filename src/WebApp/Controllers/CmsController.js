//import Cms from '../../Models/Cms';
//  import config from '../../../config/config';


// const listAllCms = async(req, res) => {
//     try {
//         const allCms = await Cms.find({ isDeleted: false });
//         res.status(200).json({data:allCms});
//     } catch (err) {
//         console.log('Error => ',err.message);
//         res.status(500).json({msg:"Something went wrong"});
//     }
// }
const listCms = async(req, res) => {
    if(req.params.cmsId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Cms.findById({ _id: req.params.cmsId });
        res.status(200).json({data:cmsData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}
// export default { listCms, listAllCms }
export default { listCms }