import mongoose from 'mongoose';
const  {Schema}  = mongoose;
// Creating user schema
const schema = new Schema({
    name: {
        type: String
    }, 
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
const House = mongoose.model('house', schema);
export default House;