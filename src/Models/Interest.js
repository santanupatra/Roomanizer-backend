import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    profilePicture: {
        type: String, 
        default: "/image/user.png"
    },
    name: {
        type: String, 
    },
    isIntrested: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const Interest = mongoose.model('interest',schema);
export default Interest;