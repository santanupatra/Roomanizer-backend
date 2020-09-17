import Room from '../../Models/Room';

/**
 * addRoom
 * return JSON
 */
const add = (req, res) => {
    // console.log("add")
     try {
         let allData = req.body;
         const addData = new Room(allData).save();
         res.status(200).json({msg:"Successfully added"});
        //  console.log("add1")
     } catch (err) {
         console.log("Error => ",err.message);
         res.status(500).json({ message:"Something went wrong" });
        //  console.log("add2")
     }
 }

/**
 * listAllRoom
 * return JSON
 */

const listAll= async(req, res) => {
    try {
        const room = await Room.find({ isDeleted: false }).populate("user_Id" , "name   email").exec();
        res.status(200).json({data:room});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listRoom
 * return JSON
 */
const listRoom = async(req, res) => {
    if(req.params.roomId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const room = await Room.findById({
            _id: req.params.roomId
        });
        res.status(200).json({data: room});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
/**
 * updateRoom
 * return JSON
 */
const updateRoom = async(req, res) => {
    if(req.params.roomId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const room = await Room.findByIdAndUpdate(
            { _id: req.params.roomId },
                {
                    $set: req.body
                }
            );
        res.status(200).json({msg:"Room updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}
/**
 * deleteUser
 * return JSON
 */
const deleteRooom = async(req, res) => {
    if(req.params.roomId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const user = await Room.findByIdAndUpdate(
            { _id: req.params.roomId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "Room has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { add, listAll, listRoom, updateRoom, deleteRooom }