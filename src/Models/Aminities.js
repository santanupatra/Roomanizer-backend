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
const Aminities = mongoose.model('aminities', schema);
export default Aminities;