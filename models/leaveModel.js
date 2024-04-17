const mongoose = require('mongoose');
const validator = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
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
        type:String,
        trim: true
    },
    status: {
        type: String,
        default: 'Pending'
    }

});

const leaveRequest = mongoose.model('Leave',leaveSchema);

module.exports = leaveRequest