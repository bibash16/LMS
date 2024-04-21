const mongoose = require('mongoose');
const validator = require('mongoose');
const User = require('./../models/userModel');

const leaveSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
  },
    name: {
        type: String,
        required: [true, 'Please enter your full name.'],
        trim: true
        },
    email: {
        type: String,
        required: [true, 'Please enter your email.'], 
        trim: true
    },

    startDate: {
       type: Date,
        required: true,
        validate: {
            validator: function(value) {
             const today = new Date();
            today.setHours(0, 0, 0, 0); // Set hours to midnight for comparison
            return value >= today; // Ensure start date is today or in the future
        },
            message: 'Please provide a valid start date.'
        } },
    endDate: {
       type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= this.startDate; 
            },
            message: 'Please enter a valid ending date.'
        }
    },

    leaveType:{
        type: String,
        required: [true, 'Please enter the type of leave.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'Pending'
    }

});

//used to calculate the days  
leaveSchema.virtual('leaveDuration').get(function() {
    const start = this.startDate;
    const end = this.endDate;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

const leaveRequest = mongoose.model('Leave',leaveSchema);

module.exports = leaveRequest