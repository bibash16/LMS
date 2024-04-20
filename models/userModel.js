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

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'The passwords do not match.'
        }
    },
    passwordChangedAt: Date,
    
    remainingLeave: {
        casual: {
            type: Number,
            default: 10
        },
        sick: {
            type: Number,
            default: 15
        }
    },
    leaveTaken: {
        casual: {
            type: Number,
            default: 0
        },
        sick: {
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
    this.passwordConfirm = undefined;
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
