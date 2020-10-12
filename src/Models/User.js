import mongoose from 'mongoose';
const  {Schema}  = mongoose;
// Creating user schema
const schema = new Schema({
    // _id: {String},
    firstName: {
        type: String,
        // required: true
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
    dateOfBirth: {
        type: String 
    },                   
    phoneNumber: {
        type: String
    },
    password: {
        type: String
    },  
    gender: {
        type: String,
        enum: ['Male','Female','Other']
    },   
             
    occupation: {
        type: String,
    },
    age: {
        type: Number
    },
    profilePicture: {
        type: String, 
        default: "/image/user.png"
    },
    roomPicture: {
        type: String, 
        default: "/image/user.png"
    },
    aboutMe: {
        type: String
    },
    maxBudget: {
        type: String
    },
    readyToMove: {
        type: Date, 
    },  
    houseRules: {
        type: [], 
    },
    aminities: {
        type: [], 
    },
    noOfBedRoom: {
        type: String, 
    },
    otp: {
        type: String
    },
    otptime:{
        type:String
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [] //[<longitude>, <latitude>]
    },
    userType: {
        type: String,
        enum: ['admin','customer','landlord'],
        default: "customer"
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
   
    address: {
        type: String
    },
    street: {
        type: String
    },
    zipCode: {
        type: String
    },
    favoriteDish: {
        type: String
    },
    totalReview: {
        type: Number
    },
    AvarageRating: {
        type: Number
    },
    socialId:{
        type:String
    },
    socialMediaType: {
        type:String
    },
    isSocialMediaUser:{
        type:Boolean,
        default:false
    },
    isNotification: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean, 
        default: false
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
    lastLogin: {
        type: Date
    },                                    
    isAdmin: {
        type: Boolean, 
        default: false
    },     
});
// schema.index({ "location": "2dsphere" });
const User = mongoose.model('user', schema);
export default User;