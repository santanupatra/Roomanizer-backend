import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    type: {
        type: String,
        enum: ['login','logout'],
        default: "login"
    },
    loginType: {
        type: String,
        enum: ['social','web'],
        default: "web"
    },
    logTime: {
        type: Date,
        default: Date.now
    },
    logoutTime: {
        type: Date,
        //default: Date.now
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
const LoginDetails = mongoose.model('login_details',schema);
export default LoginDetails;