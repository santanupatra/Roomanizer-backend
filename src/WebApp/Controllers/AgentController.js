import User from '../../Models/User';
import mongoose from "mongoose";

const listAllAgent = async(req, res) => {
    console.log("wertyu")
    try {
        const agentlist = await User.find({userType:"agent",isDeleted: false });
        console.log(agentlist)
        res.status(200).json({data:agentlist});
    } catch (err) {
        console.log('Error => ',err.message);   
        res.status(500).json({msg:"Something went wrong"});
    }
}
export default {listAllAgent }