import mongoose from 'mongoose';
const  {Schema}  = mongoose;
// Creating user schema
const schema = new Schema({
    // _id: {String},
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
});
// schema.index({ "location": "2dsphere" });
const ContactUs = mongoose.model('contactUs', schema);
export default ContactUs;