import Cms from '../../Models/Cms';
 import config from '../../../config/config';

const listCms = async(req, res) => {
    if(req.params.SlugId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Cms.find({ cmsSlug: req.params.SlugId });
        res.status(200).json({data:cmsData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

export default { listCms }