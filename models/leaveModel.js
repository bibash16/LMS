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
                return value.length > 0; // Ensure at least one start date is provided
            },
            message: 'Please provide a valid start date.'
        } },
    endDate: {
       type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return this.startDate.every(startDate => startDate <= value); // Ensure end date is after all start dates
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
        default: 'pending'
    }

});

const leaveRequest = mongoose.model('Leave',leaveSchema);

module.exports = leaveRequest