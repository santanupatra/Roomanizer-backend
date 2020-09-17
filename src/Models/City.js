import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    cityName: {
        type: String,
        required: true
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
const City = mongoose.model('city',schema);
export default City;