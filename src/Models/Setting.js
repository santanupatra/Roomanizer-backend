import mongoose from 'mongoose';
const { Schema } = mongoose;

//Creating new setting schema
const schema = new Schema({
    name: {
        type: String
    },
    siteEmail: {
        type: String
    },
    sitePhoneNumber: {
        type: String
    },
    siteAddress: {
        type: String
    },
    siteLogo: {
        type: String
    },
    siteFavIcon: {
        type: String
    },
    distanceRatio: {
        type : String
    },
    paymentEnvironment: {
        type: String,
        enum: ["live","sandbox"],
        default: "sandbox"
    },
    stripeApiSanboxKey: {
        type: String
    },
    stripeApiLiveKey: {
        type: String
    },
    priceForFuelFees: {
        type: Number
    },
    wearAndTearFees: {
        type: Number
    },
    bookingFees: {
        type: Number
    },
    instagramUrl: {
        type: String
    },
    facebookUrl: {
        type: String
    },
    youtubeUrl: {
        type: String
    },
    twitterUrl: {
        type: String
    },
    linkedinUrl: {
        type: String
    }, 
    pinterestUrl: {
        type: String
    }
});
const Setting = mongoose.model('setting', schema);
export default Setting;