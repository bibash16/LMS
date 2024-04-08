const mongoose = require('mongoose');
const validator = require('validator');

const leaveSchema = new mongoose.Schema(
    {
        name:{
        type:String,
        required:[true,'A leave must have a name'],
        trim:true,
       
    },
    email:{
        type:String,
        required:[true,'A leave must have a email'],
        unique:true,
        trim:true
    },

    startdate:{
        type: Date,
        required:[true,'A leave must have a startdate'],
        trim:true

    },

    enddate:{
        type:Date,
        required:[true,'A leave must have a enddate'],
        trim:true
    },

    Typeofleave:{
        type:String,
        required:[true,'A leave must have a type of leave'],
        trim:true

    },

    leavedescription:{
        type:String,
        required:[true,'A leave must have a leavedescription'],
        trim:true

    }

});

const leave = mongoose.model('leave', leaveSchema);

module.exports = leave;