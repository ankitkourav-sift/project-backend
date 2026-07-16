const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    cid:{
        type:String,
        required:true
    },

    fullName:{
        type:String,
        required:true
    },

    mobile:{
        type:String,
        required:true
    },

    house:{
        type:String,
        required:true
    },

    area:{
        type:String,
        required:true
    },

    landmark:{
        type:String,
        default:""
    },

    city:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    pincode:{
        type:String,
        required:true
    },

    isDefault:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Address",addressSchema);