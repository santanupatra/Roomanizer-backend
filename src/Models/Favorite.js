import mongoose from 'mongoose';
const  {Schema}  = mongoose;
// Creating user schema
const schema = new Schema({
    loginUserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    roomMateId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    roomId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'room'
    },
    type:{
        type:String,
        enum:['roomMate','room']
    } ,
    isActive: {
        type: Boolean, 
        default: true
    },                    
    isDeleted: {
        type: Boolean, 
        default: false
    }, 
    createdDate: {
        type: Date, 
        default: Date.now
    },     
});
// schema.index({ "location": "2dsphere" });
const Favorite = mongoose.model('favorite', schema);
export default Favorite;