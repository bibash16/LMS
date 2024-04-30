const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your first name.']
    },

    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address.']
    },

    contactNumber: {
        type: Number,
        required: [true, 'Please provide your contact number.']
    },

    position: {
        type: String,
        required: [true, 'Please provide your position']
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [5, 'Password must have at least 5 characters']
    },

    passwordChangedAt: Date,
    
    remainingLeave: {
        Casual: {
            type: Number,
            default: 15
        },
        Sick: {
            type: Number,
            default: 15
        },
        Maternity: {
            type: Number,
            default: 90
        },
        Paternity: {
            type: Number,
            default: 5
        },
        Wedding: {
            type: Number,
            default: 5
        },
        Bereavement: {
            type: Number,
            default: 15
        }
    },
    leaveTaken: {
        Casual: {
            type: Number,
            default: 0
        },
        Sick: {
            type: Number,
            default: 0
        },
        Maternity: {
            type: Number,
            default: 0
        },
        Paternity: {
            type: Number,
            default: 0
        },
        Wedding: {
            type: Number,
            default: 0
        },
        Bereavement: {
            type: Number,
            default: 0
        }
    }
});

userSchema.plugin(mongoosePaginate);

const user = mongoose.model('user', userSchema);

module.exports = user;
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User