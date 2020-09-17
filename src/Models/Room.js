import mongoose from 'mongoose';
const { Schema } = mongoose;

//Creating new setting schema
const schema = new Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    roomNo: {
        type: String
    },
    bathNo: {
        type: String
    },
    isKitchen: {
        type: Boolean,
        default: true
    },
    isBalkani: {
        type: Boolean,
        default: true
    },
    commonSpace: {
        type: String
    },
    isFurniture: {
        type: Boolean,
        default: true
    },
    area: {
        type: Number
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const Room = mongoose.model('room', schema);
export default Room;