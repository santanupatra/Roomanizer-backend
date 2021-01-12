import mongoose from 'mongoose';
const { Schema } = mongoose;
//mongoose.set('useCreateIndex', true);
//Creating new setting schema
const {Point} = require('mongoose-geojson-schema');
// Creating Point  schema

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
   // required: true
  },
  coordinates: {
    type: [Number],
   // required: true
  }
})
const schema = new Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    roomNo: {
        type: String
    },
    roomImage:[{
        image:{type: String},
    }],
    roomName: {
        type: String
    },
    aboutRoom: {
        type: String
    },
    flateMate: {
        type: String,
        enum:['female','male','other']
    },
    ageRange: {
        type: String, 
    },
    noOfBedRoom: {
        type: String
    },
    houseRules: {
        type: [], 
    },
    aminities: {
        type: [], 
    },
    age: {
        type: String, 
    },
    duration: {
        type: String, 
    },
    moveIn: {
        type: Date, 
    },
    area: {
        type: Number
    },
    deposite: {
        type: Number
    },
    charges: {
        type: Number
    },
    chargesType: {
        type: String,
        enum:['monthly','yearly'],
        default:'monthly'
    },
    budget: {
        type: Number
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    // location: {
    //     type: { type: String, default: "Point" },
    //     coordinates: [] //[<longitude>, <latitude>]
    // },
    location: {
        type: pointSchema,
        //required: true
      },
    zipCode: {
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
schema.index({ location: "2dsphere" });

const Room = mongoose.model('room', schema);
export default Room;